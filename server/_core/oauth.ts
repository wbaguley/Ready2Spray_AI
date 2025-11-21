import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      console.log('[OAuth] Setting cookie with options:', cookieOptions);
      console.log('[OAuth] Cookie name:', COOKIE_NAME);
      console.log('[OAuth] Session token length:', sessionToken?.length);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // For mobile browsers, add a small delay to ensure cookie is set
      const userAgent = req.headers["user-agent"] || "";
      const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      if (isMobile) {
        console.log('[OAuth] Mobile browser detected, using delayed redirect');
        // Send HTML with meta refresh for better mobile compatibility
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="refresh" content="0;url=/dashboard">
            <title>Redirecting...</title>
          </head>
          <body>
            <p>Logging you in...</p>
            <script>
              setTimeout(function() {
                window.location.href = '/dashboard';
              }, 100);
            </script>
          </body>
          </html>
        `);
      } else {
        console.log('[OAuth] Redirecting to /dashboard');
        res.redirect(302, "/dashboard");
      }
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

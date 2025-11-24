import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getUserOrganization } from "../dbOrganizations";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

/**
 * Development-only auto-login endpoint
 * Automatically logs in as the owner without OAuth
 * Only works when NODE_ENV=development
 */
export function registerDevLogin(app: Express) {
  // Only register in development
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  app.get("/api/dev-login", async (req: Request, res: Response) => {
    try {
      console.log("[DevLogin] Auto-logging in as owner");

      // Get or create owner user
      await db.upsertUser({
        openId: ENV.ownerOpenId,
        name: ENV.ownerName || "Owner",
        email: null,
        loginMethod: "dev",
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByOpenId(ENV.ownerOpenId);
      if (!user) {
        res.status(500).json({ error: "Failed to create owner user" });
        return;
      }

      // Ensure organization exists
      const existingOrg = await getUserOrganization(user.id);
      if (!existingOrg) {
        console.log("[DevLogin] Creating organization for owner");
        await db.getOrCreateUserOrganization(user.id);
      }

      // Create session token
      const sessionToken = await sdk.createSessionToken(ENV.ownerOpenId, {
        name: ENV.ownerName || "Owner",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Redirect to dashboard
      res.redirect(302, "/dashboard");
    } catch (error) {
      console.error("[DevLogin] Failed", error);
      res.status(500).json({ error: "Dev login failed" });
    }
  });

  console.log("[DevLogin] Registered /api/dev-login endpoint");
}

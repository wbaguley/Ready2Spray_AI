import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookies = opts.req.cookies;
    console.log('[Context] Cookies present:', Object.keys(cookies || {}).join(', ') || 'none');
    user = await sdk.authenticateRequest(opts.req);
    console.log('[Context] User authenticated:', user ? `${user.name} (${user.openId})` : 'null');
  } catch (error) {
    // Authentication is optional for public procedures.
    console.log('[Context] Authentication failed:', error instanceof Error ? error.message : String(error));
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

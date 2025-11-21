import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import {
  getApiKeyByHash,
  updateApiKeyUsage,
  logApiUsage,
  getOrCreateUserOrganization,
  // Jobs
  createJob,
  updateJob,
  getJobById,
  getJobsByOrgId,
  // Customers
  createCustomer,
  updateCustomer,
  getCustomerById,
  getCustomersByOrgId,
  // Sites
  createSite,
  updateSite,
  getSiteById,
  getSitesByOrgId,
  // Personnel
  createPersonnel,
  updatePersonnel,
  getPersonnelById,
  getPersonnelByOrgId,
  // Equipment
  createEquipment,
  updateEquipment,
  getEquipmentById,
  getEquipmentByOrgId,
} from "./db";

// Middleware to authenticate API key
export async function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  const apiKey = req.headers.authorization?.replace("Bearer ", "");

  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  try {
    // Find API key by prefix for faster lookup
    const keyPrefix = apiKey.substring(0, 12);
    
    // Get API keys by prefix for faster lookup
    const possibleKeys = await getApiKeysByPrefix(keyPrefix);
    let matchedKey = null;
    
    for (const key of possibleKeys) {
      const isValid = await bcrypt.compare(apiKey, key.keyHash);
      if (isValid) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey || !matchedKey.isActive) {
      await logApiUsage({
        apiKeyId: matchedKey?.id || 0,
        endpoint: req.path,
        method: req.method,
        statusCode: 401,
        responseTime: Date.now() - startTime,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        errorMessage: "Invalid or inactive API key",
      });
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Check expiration
    if (matchedKey.expiresAt && new Date(matchedKey.expiresAt) < new Date()) {
      return res.status(401).json({ error: "API key expired" });
    }

    // Update usage
    await updateApiKeyUsage(matchedKey.id);

    // Attach to request
    (req as any).apiKey = matchedKey;
    (req as any).startTime = startTime;

    next();
  } catch (error: any) {
    console.error("[API Auth] Error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

// Helper to get API keys by prefix
async function getApiKeysByPrefix(prefix: string) {
  const db = await import("./db").then(m => m.getDb());
  if (!db) return [];
  
  const { apiKeys } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  return await db.select().from(apiKeys).where(eq(apiKeys.keyPrefix, prefix));
}

// Middleware to log API usage
export async function logApiRequest(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;
  const startTime = (req as any).startTime || Date.now();

  res.send = function (data: any) {
    const apiKey = (req as any).apiKey;
    if (apiKey) {
      logApiUsage({
        apiKeyId: apiKey.id,
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        responseTime: Date.now() - startTime,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        requestBody: req.body,
        responseBody: typeof data === "string" ? JSON.parse(data) : data,
      }).catch(console.error);
    }
    return originalSend.call(this, data);
  };

  next();
}

// Job endpoints
export async function handleJobWebhook(req: Request, res: Response) {
  const { action } = req.params;
  const apiKey = (req as any).apiKey;

  try {
    switch (action) {
      case "create":
        const newJob = await createJob({ ...req.body, orgId: apiKey.organizationId });
        return res.json({ success: true, data: newJob });

      case "update":
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "Job ID required" });
        const updatedJob = await updateJob(id, updateData);
        return res.json({ success: true, data: updatedJob });

      case "get":
        const { id: jobId } = req.query;
        if (!jobId) return res.status(400).json({ error: "Job ID required" });
        const job = await getJobById(Number(jobId));
        return res.json({ success: true, data: job });

      case "list":
        const jobs = await getJobsByOrgId(apiKey.organizationId);
        return res.json({ success: true, data: jobs });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Job Webhook] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Customer endpoints
export async function handleCustomerWebhook(req: Request, res: Response) {
  const { action } = req.params;
  const apiKey = (req as any).apiKey;

  try {
    switch (action) {
      case "create":
        const newCustomer = await createCustomer({ ...req.body, orgId: apiKey.organizationId });
        return res.json({ success: true, data: newCustomer });

      case "update":
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "Customer ID required" });
        const updatedCustomer = await updateCustomer(id, updateData);
        return res.json({ success: true, data: updatedCustomer });

      case "get":
        const { id: customerId } = req.query;
        if (!customerId) return res.status(400).json({ error: "Customer ID required" });
        const customer = await getCustomerById(Number(customerId));
        return res.json({ success: true, data: customer });

      case "list":
        const customers = await getCustomersByOrgId(apiKey.organizationId);
        return res.json({ success: true, data: customers });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Customer Webhook] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Site endpoints
export async function handleSiteWebhook(req: Request, res: Response) {
  const { action } = req.params;
  const apiKey = (req as any).apiKey;

  try {
    switch (action) {
      case "create":
        const newSite = await createSite({ ...req.body, orgId: apiKey.organizationId });
        return res.json({ success: true, data: newSite });

      case "update":
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "Site ID required" });
        const updatedSite = await updateSite(id, updateData);
        return res.json({ success: true, data: updatedSite });

      case "get":
        const { id: siteId } = req.query;
        if (!siteId) return res.status(400).json({ error: "Site ID required" });
        const site = await getSiteById(Number(siteId));
        return res.json({ success: true, data: site });

      case "list":
        const sites = await getSitesByOrgId(apiKey.organizationId);
        return res.json({ success: true, data: sites });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Site Webhook] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Personnel endpoints
export async function handlePersonnelWebhook(req: Request, res: Response) {
  const { action } = req.params;
  const apiKey = (req as any).apiKey;

  try {
    switch (action) {
      case "create":
        const newPersonnel = await createPersonnel({ ...req.body, orgId: apiKey.organizationId });
        return res.json({ success: true, data: newPersonnel });

      case "update":
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "Personnel ID required" });
        const updatedPersonnel = await updatePersonnel(id, updateData);
        return res.json({ success: true, data: updatedPersonnel });

      case "get":
        const { id: personnelId } = req.query;
        if (!personnelId) return res.status(400).json({ error: "Personnel ID required" });
        const personnel = await getPersonnelById(Number(personnelId));
        return res.json({ success: true, data: personnel });

      case "list":
        const allPersonnel = await getPersonnelByOrgId(apiKey.organizationId);
        return res.json({ success: true, data: allPersonnel });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Personnel Webhook] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Equipment endpoints
export async function handleEquipmentWebhook(req: Request, res: Response) {
  const { action } = req.params;
  const apiKey = (req as any).apiKey;

  try {
    switch (action) {
      case "create":
        const newEquipment = await createEquipment({ ...req.body, orgId: apiKey.organizationId });
        return res.json({ success: true, data: newEquipment });

      case "update":
        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "Equipment ID required" });
        const updatedEquipment = await updateEquipment(id, updateData);
        return res.json({ success: true, data: updatedEquipment });

      case "get":
        const { id: equipmentId } = req.query;
        if (!equipmentId) return res.status(400).json({ error: "Equipment ID required" });
        const equipment = await getEquipmentById(Number(equipmentId));
        return res.json({ success: true, data: equipment });

      case "list":
        const allEquipment = await getEquipmentByOrgId(apiKey.organizationId);
        return res.json({ success: true, data: allEquipment });

      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Equipment Webhook] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

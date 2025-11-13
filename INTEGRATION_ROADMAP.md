# Zoho CRM & FieldPulse Integration Roadmap

## ✅ Completed (Phase 1-2)

### Database Foundation
- ✅ 4 integration tables created (connections, field_mappings, sync_logs, entity_mappings)
- ✅ Drizzle schema updated with integration types
- ✅ Database procedures implemented (getConnections, createConnection, updateConnection, getSyncLogs, createEntityMapping)

### API Research
- ✅ Zoho CRM API documentation reviewed (OAuth 2.0, V8 APIs)
- ✅ FieldPulse API documentation reviewed (API Key, REST endpoints)
- ✅ Data mapping strategies documented
- ✅ Rate limit handling planned

---

## 🔄 Remaining Work (Phases 3-7)

### Phase 3: Integration Settings UI (2-3 hours)

**Location:** `/client/src/pages/Settings.tsx`

**Tasks:**
1. Add "Integrations" card after "Organization Mode" section
2. Create Zoho CRM connection UI:
   - OAuth button ("Connect Zoho CRM")
   - Display connection status (connected/disconnected)
   - Show last sync timestamp
   - Disconnect button
3. Create FieldPulse connection UI:
   - API key input field
   - Test connection button
   - Connection status indicator
4. Add sync settings toggles:
   - Sync Customers (checkbox)
   - Sync Jobs (checkbox)
   - Sync Personnel (checkbox)
   - Sync Interval (dropdown: 15min, 30min, 1hr, 2hr, 4hr)
5. Create tRPC router for integrations:
   - `integrations.list` - Get all connections
   - `integrations.create` - Create new connection
   - `integrations.update` - Update connection settings
   - `integrations.delete` - Remove connection
   - `integrations.testConnection` - Test API credentials

**Files to Create/Modify:**
- `server/routers.ts` - Add integrations router
- `server/validation.ts` - Add integration schemas
- `client/src/pages/Settings.tsx` - Add Integrations UI

---

### Phase 4: Zoho CRM OAuth Flow (3-4 hours)

**OAuth Flow:**
1. User clicks "Connect Zoho CRM" button
2. Frontend redirects to Zoho OAuth authorization URL
3. User grants permissions in Zoho
4. Zoho redirects back to callback URL with authorization code
5. Backend exchanges code for access token + refresh token
6. Store tokens in database (encrypted)

**Implementation:**

**1. Create OAuth Callback Handler**
```typescript
// server/_core/zohoOAuth.ts
export async function handleZohoCallback(code: string, organizationId: number) {
  // Exchange code for tokens
  const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: process.env.ZOHO_REDIRECT_URI,
      code
    })
  });
  
  const { access_token, refresh_token, expires_in } = await tokenResponse.json();
  
  // Store in database
  await updateIntegrationConnection(connectionId, {
    zohoAccessToken: access_token,
    zohoRefreshToken: refresh_token,
    zohoTokenExpiresAt: new Date(Date.now() + expires_in * 1000)
  });
}
```

**2. Create Token Refresh Logic**
```typescript
// server/_core/zohoOAuth.ts
export async function refreshZohoToken(connectionId: number) {
  const connection = await getIntegrationConnection(connectionId);
  
  const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: connection.zohoClientId,
      client_secret: connection.zohoClientSecret,
      refresh_token: connection.zohoRefreshToken
    })
  });
  
  const { access_token, expires_in } = await tokenResponse.json();
  
  await updateIntegrationConnection(connectionId, {
    zohoAccessToken: access_token,
    zohoTokenExpiresAt: new Date(Date.now() + expires_in * 1000)
  });
  
  return access_token;
}
```

**3. Add OAuth Route**
```typescript
// server/routers.ts
integrations: router({
  zohoCallback: publicProcedure
    .input(z.object({ code: z.string(), state: z.string() }))
    .mutation(async ({ input }) => {
      const organizationId = parseInt(input.state); // State contains org ID
      await handleZohoCallback(input.code, organizationId);
      return { success: true };
    })
})
```

**Files to Create:**
- `server/_core/zohoOAuth.ts` - OAuth flow handlers
- `server/_core/zohoApi.ts` - Zoho API client
- Add route to `server/routers.ts`

**Environment Variables Needed:**
- `ZOHO_CLIENT_ID` - From Zoho API Console
- `ZOHO_CLIENT_SECRET` - From Zoho API Console
- `ZOHO_REDIRECT_URI` - Your callback URL

---

### Phase 5: FieldPulse API Client (2 hours)

**Implementation:**

**1. Create FieldPulse API Client**
```typescript
// server/_core/fieldpulseApi.ts
export class FieldPulseClient {
  private apiKey: string;
  private baseUrl = 'https://api.fieldpulse.com/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`FieldPulse API error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getCustomers() {
    return this.request('/customers');
  }
  
  async createCustomer(data: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async updateCustomer(id: string, data: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async getJobs() {
    return this.request('/jobs');
  }
  
  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async testConnection() {
    try {
      await this.request('/customers?limit=1');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

**2. Add Test Connection Endpoint**
```typescript
// server/routers.ts
integrations: router({
  testFieldPulse: protectedProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ input }) => {
      const client = new FieldPulseClient(input.apiKey);
      return await client.testConnection();
    })
})
```

**Files to Create:**
- `server/_core/fieldpulseApi.ts` - FieldPulse API client

---

### Phase 6: Bidirectional Customer Sync (4-5 hours)

**Sync Strategy:**
- **Conflict Resolution:** Last-write-wins based on `updatedAt` timestamp
- **Sync Direction:** Bidirectional (R2S ↔ External)
- **Sync Trigger:** Manual + Scheduled (every N minutes)

**Implementation:**

**1. Zoho CRM Customer Sync**
```typescript
// server/_core/zohoSync.ts
export async function syncCustomersToZoho(connectionId: number, organizationId: number) {
  const connection = await getIntegrationConnection(organizationId, 'zoho_crm');
  const customers = await getCustomersByOrgId(organizationId);
  
  for (const customer of customers) {
    try {
      // Check if customer already synced
      const mapping = await getEntityMapping(connectionId, 'customer', customer.id);
      
      const zohoData = {
        First_Name: customer.name.split(' ')[0],
        Last_Name: customer.name.split(' ').slice(1).join(' ') || '.',
        Email: customer.email,
        Phone: customer.phone,
        Mailing_Street: customer.address,
        Mailing_City: customer.city,
        Mailing_State: customer.state,
        Mailing_Zip: customer.zipCode
      };
      
      if (mapping) {
        // Update existing contact
        await zohoApi.updateContact(mapping.externalId, zohoData);
      } else {
        // Create new contact
        const response = await zohoApi.createContact(zohoData);
        await createEntityMapping({
          connectionId,
          entityType: 'customer',
          ready2sprayId: customer.id,
          externalId: response.data[0].details.id
        });
      }
      
      await createSyncLog({
        connectionId,
        syncDirection: 'to_external',
        entityType: 'customer',
        entityId: customer.id,
        operation: mapping ? 'update' : 'create',
        status: 'success'
      });
    } catch (error) {
      await createSyncLog({
        connectionId,
        syncDirection: 'to_external',
        entityType: 'customer',
        entityId: customer.id,
        operation: mapping ? 'update' : 'create',
        status: 'error',
        errorMessage: error.message
      });
    }
  }
}

export async function syncCustomersFromZoho(connectionId: number, organizationId: number) {
  const connection = await getIntegrationConnection(organizationId, 'zoho_crm');
  const zohoContacts = await zohoApi.getContacts();
  
  for (const contact of zohoContacts.data) {
    try {
      // Check if contact already mapped
      const mapping = await getEntityMappingByExternalId(connectionId, 'customer', contact.id);
      
      const customerData = {
        orgId: organizationId,
        name: `${contact.First_Name} ${contact.Last_Name}`,
        email: contact.Email,
        phone: contact.Phone,
        address: contact.Mailing_Street,
        city: contact.Mailing_City,
        state: contact.Mailing_State,
        zipCode: contact.Mailing_Zip
      };
      
      if (mapping) {
        // Update existing customer
        await updateCustomer(mapping.ready2sprayId, customerData);
      } else {
        // Create new customer
        const newCustomer = await createCustomer(customerData);
        await createEntityMapping({
          connectionId,
          entityType: 'customer',
          ready2sprayId: newCustomer.id,
          externalId: contact.id
        });
      }
      
      await createSyncLog({
        connectionId,
        syncDirection: 'from_external',
        entityType: 'customer',
        entityId: mapping?.ready2sprayId || 0,
        externalId: contact.id,
        operation: mapping ? 'update' : 'create',
        status: 'success'
      });
    } catch (error) {
      await createSyncLog({
        connectionId,
        syncDirection: 'from_external',
        entityType: 'customer',
        entityId: 0,
        externalId: contact.id,
        operation: mapping ? 'update' : 'create',
        status: 'error',
        errorMessage: error.message
      });
    }
  }
}
```

**2. FieldPulse Customer Sync**
```typescript
// server/_core/fieldpulseSync.ts
export async function syncCustomersToFieldPulse(connectionId: number, organizationId: number) {
  const connection = await getIntegrationConnection(organizationId, 'fieldpulse');
  const fieldpulse = new FieldPulseClient(connection.fieldpulseApiKey);
  const customers = await getCustomersByOrgId(organizationId);
  
  for (const customer of customers) {
    try {
      const mapping = await getEntityMapping(connectionId, 'customer', customer.id);
      
      const fpData = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: {
          street: customer.address,
          city: customer.city,
          state: customer.state,
          zip: customer.zipCode
        }
      };
      
      if (mapping) {
        await fieldpulse.updateCustomer(mapping.externalId, fpData);
      } else {
        const response = await fieldpulse.createCustomer(fpData);
        await createEntityMapping({
          connectionId,
          entityType: 'customer',
          ready2sprayId: customer.id,
          externalId: response.id
        });
      }
      
      await createSyncLog({
        connectionId,
        syncDirection: 'to_external',
        entityType: 'customer',
        entityId: customer.id,
        operation: mapping ? 'update' : 'create',
        status: 'success'
      });
    } catch (error) {
      await createSyncLog({
        connectionId,
        syncDirection: 'to_external',
        entityType: 'customer',
        entityId: customer.id,
        operation: mapping ? 'update' : 'create',
        status: 'error',
        errorMessage: error.message
      });
    }
  }
}

// Similar implementation for syncCustomersFromFieldPulse
```

**3. Add Sync Endpoints**
```typescript
// server/routers.ts
integrations: router({
  syncCustomers: protectedProcedure
    .input(z.object({ 
      connectionId: z.number(),
      direction: z.enum(['to_external', 'from_external', 'bidirectional'])
    }))
    .mutation(async ({ ctx, input }) => {
      const org = await getOrCreateUserOrganization(ctx.user.id);
      const connection = await getIntegrationConnection(org.id, input.connectionId);
      
      if (connection.integrationType === 'zoho_crm') {
        if (input.direction === 'to_external' || input.direction === 'bidirectional') {
          await syncCustomersToZoho(input.connectionId, org.id);
        }
        if (input.direction === 'from_external' || input.direction === 'bidirectional') {
          await syncCustomersFromZoho(input.connectionId, org.id);
        }
      } else if (connection.integrationType === 'fieldpulse') {
        if (input.direction === 'to_external' || input.direction === 'bidirectional') {
          await syncCustomersToFieldPulse(input.connectionId, org.id);
        }
        if (input.direction === 'from_external' || input.direction === 'bidirectional') {
          await syncCustomersFromFieldPulse(input.connectionId, org.id);
        }
      }
      
      await updateIntegrationConnection(input.connectionId, {
        lastSyncAt: new Date()
      });
      
      return { success: true };
    })
})
```

**Files to Create:**
- `server/_core/zohoSync.ts` - Zoho sync logic
- `server/_core/fieldpulseSync.ts` - FieldPulse sync logic
- Add endpoints to `server/routers.ts`

---

### Phase 7: Sync Dashboard (3-4 hours)

**Location:** `/client/src/pages/Integrations.tsx`

**Features:**
1. **Connection Status Cards**
   - Zoho CRM: Connected/Disconnected, Last Sync
   - FieldPulse: Connected/Disconnected, Last Sync
   
2. **Manual Sync Triggers**
   - "Sync Customers to Zoho" button
   - "Sync Customers from Zoho" button
   - "Sync Customers Bidirectionally" button
   - Same for FieldPulse
   
3. **Sync Logs Table**
   - Columns: Timestamp, Direction, Entity Type, Operation, Status, Error Message
   - Filtering: By status, entity type, direction
   - Pagination: 50 per page
   - Auto-refresh every 30 seconds

4. **Sync Statistics**
   - Total syncs today
   - Success rate
   - Last successful sync
   - Pending conflicts

**Implementation:**
```typescript
// client/src/pages/Integrations.tsx
export default function Integrations() {
  const { data: connections } = trpc.integrations.list.useQuery();
  const { data: logs } = trpc.integrations.logs.useQuery({ limit: 50 });
  const syncCustomers = trpc.integrations.syncCustomers.useMutation();
  
  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1>Integrations</h1>
        
        {/* Connection Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          {connections?.map(conn => (
            <Card key={conn.id}>
              <CardHeader>
                <CardTitle>{conn.integrationType}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {conn.isEnabled ? 'Connected' : 'Disconnected'}</p>
                <p>Last Sync: {conn.lastSyncAt ? formatDate(conn.lastSyncAt) : 'Never'}</p>
                <Button onClick={() => syncCustomers.mutate({ 
                  connectionId: conn.id, 
                  direction: 'bidirectional' 
                })}>
                  Sync Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Sync Logs Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sync History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDate(log.syncedAt)}</TableCell>
                    <TableCell>{log.syncDirection}</TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.operation}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.errorMessage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

**Files to Create:**
- `client/src/pages/Integrations.tsx` - Sync dashboard
- Add route to `client/src/App.tsx`
- Add to sidebar in `DashboardLayout.tsx`

---

## 📋 Summary

**Total Estimated Time:** 14-18 hours

**Phases:**
1. ✅ Database Schema (Complete)
2. ✅ API Research (Complete)
3. ⏳ Settings UI (2-3 hours)
4. ⏳ Zoho OAuth (3-4 hours)
5. ⏳ FieldPulse Client (2 hours)
6. ⏳ Customer Sync (4-5 hours)
7. ⏳ Sync Dashboard (3-4 hours)

**Key Files to Create:**
- `server/_core/zohoOAuth.ts`
- `server/_core/zohoApi.ts`
- `server/_core/zohoSync.ts`
- `server/_core/fieldpulseApi.ts`
- `server/_core/fieldpulseSync.ts`
- `client/src/pages/Integrations.tsx`

**Environment Variables Needed:**
- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REDIRECT_URI`

**Testing Checklist:**
- [ ] Zoho OAuth flow works end-to-end
- [ ] FieldPulse API key validation works
- [ ] Customer sync to Zoho CRM creates contacts
- [ ] Customer sync from Zoho CRM creates R2S customers
- [ ] Customer sync to FieldPulse works
- [ ] Customer sync from FieldPulse works
- [ ] Sync logs are recorded correctly
- [ ] Error handling works (invalid credentials, API errors)
- [ ] Token refresh works for Zoho
- [ ] Manual sync triggers work from dashboard
- [ ] Scheduled sync works (cron job)

---

## 🚀 Next Steps

1. **Complete Settings UI** - Add integration cards to Settings page
2. **Implement OAuth Flow** - Set up Zoho OAuth callback and token management
3. **Build API Clients** - Create Zoho and FieldPulse API wrappers
4. **Implement Sync Logic** - Build bidirectional customer sync
5. **Create Dashboard** - Build sync monitoring and manual trigger UI
6. **Test End-to-End** - Verify all sync scenarios work correctly
7. **Add Job Sync** - Extend sync to include jobs/deals (similar to customers)
8. **Schedule Sync** - Set up cron job for automatic syncing

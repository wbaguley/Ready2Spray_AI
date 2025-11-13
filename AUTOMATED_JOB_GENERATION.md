# Automated Job Generation from Service Plans

## Overview
The Service Plans system now includes automated job generation that creates spray jobs based on recurring service agreements. This eliminates manual job creation for regular customers and ensures consistent scheduling.

## How It Works

### 1. Service Plan Configuration
When creating a service plan, you specify:
- **Plan Type**: Monthly, Bi-Monthly, Quarterly, Annual, or One-Off
- **Start Date**: When the service agreement begins
- **Next Service Date**: When the next job should be created
- **Customer & Site**: Who and where to service
- **Default Settings**: Target pests, pricing, notes

### 2. Automated Job Creation
The system automatically:
1. Scans all **active** service plans
2. Checks if `nextServiceDate` is today or in the past
3. Generates a job with:
   - Title: `[Plan Name] - Scheduled Service`
   - Customer, site, and service plan linkage
   - Default "Pending" status
   - Target pests from service plan
   - 2-hour time window from scheduled start
4. Updates `nextServiceDate` based on plan type:
   - **Monthly**: +1 month
   - **Bi-Monthly**: +2 months
   - **Quarterly**: +3 months
   - **Annual**: +1 year
   - **One-Off**: Marks plan as "Completed"

### 3. Manual Trigger
Click the **"Process Now"** button on the Service Plans page to manually trigger job generation. This will:
- Process all active service plans that are due
- Show a success message with count of jobs generated
- Refresh both Service Plans and Jobs lists

**Note**: Only administrators can trigger manual processing.

## Example Workflow

### Scenario: Monthly Pest Control Service
1. **Create Service Plan**:
   - Customer: "ABC Restaurant"
   - Plan Type: Monthly
   - Start Date: 2025-01-15
   - Next Service Date: 2025-02-15
   - Target Pests: Ants, Roaches, Mice
   - Price: $150/service

2. **Automated Processing** (on 2025-02-15):
   - System creates job: "Monthly Pest Control - Scheduled Service"
   - Job assigned to ABC Restaurant
   - Status: Pending
   - Scheduled: 2025-02-15
   - Updates next service date to 2025-03-15

3. **Recurring Cycle**:
   - Every month on the 15th, a new job is automatically created
   - Service plan tracks all generated jobs via `servicePlanId` link
   - No manual intervention needed

## Technical Details

### Files
- **`server/servicePlanScheduler.ts`**: Core scheduling logic
- **`server/routers.ts`**: `servicePlans.processNow` endpoint
- **`client/src/pages/ServicePlans.tsx`**: "Process Now" button UI

### Database Schema
```typescript
servicePlans {
  id: number
  orgId: number
  customerId: number
  siteId: number | null
  planName: string
  planType: "monthly" | "quarterly" | "bi_monthly" | "annual" | "one_off"
  startDate: date
  endDate: date | null
  nextServiceDate: date | null  // ← Key field for automation
  defaultTargetPests: json
  pricePerService: numeric
  status: "active" | "paused" | "cancelled" | "completed"
  notes: text
}

jobs {
  servicePlanId: number | null  // ← Links job to service plan
  // ... other job fields
}
```

### Processing Logic
```typescript
// Find all active plans due for service
const duePlans = await db
  .select()
  .from(servicePlans)
  .where(
    and(
      eq(servicePlans.status, "active"),
      or(
        lte(servicePlans.nextServiceDate, today),
        isNull(servicePlans.nextServiceDate)
      )
    )
  );

// Generate job for each plan
for (const plan of duePlans) {
  const job = await generateJobFromServicePlan(plan);
  const nextDate = calculateNextServiceDate(plan.nextServiceDate, plan.planType);
  await updateServicePlanNextDate(plan.id, nextDate);
}
```

## Future Enhancements

### Recommended Additions
1. **Cron Scheduler**: Set up daily cron job to run `processServicePlans()` automatically at 6:00 AM
2. **Email Notifications**: Send alerts when jobs are auto-generated
3. **Dashboard Widget**: Show upcoming service plan jobs in dashboard
4. **Conflict Detection**: Warn if generated job conflicts with existing schedule
5. **Bulk Operations**: Pause/resume multiple service plans at once
6. **Revenue Forecasting**: Calculate projected revenue from active service plans
7. **Customer Portal**: Let customers view their service plan schedule

### Cron Setup (Future)
```typescript
// Add to server/_core/index.ts or separate cron file
import cron from 'node-cron';
import { processServicePlans } from './servicePlanScheduler';

// Run daily at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  console.log('[Cron] Running service plan processing...');
  const result = await processServicePlans();
  console.log(`[Cron] Generated ${result.generated} jobs from ${result.processed} plans`);
});
```

## Testing

### Manual Test Steps
1. Create a service plan with `nextServiceDate` = today
2. Click "Process Now" button
3. Verify:
   - Success toast shows "Generated 1 jobs from 1 service plans"
   - New job appears in Jobs list with correct details
   - Service plan's `nextServiceDate` updated to next cycle
   - Job has `servicePlanId` linking back to plan

### Edge Cases Tested
- ✅ Service plan with no `nextServiceDate` (generates job immediately)
- ✅ One-off service plan (marks as completed after job generation)
- ✅ Multiple plans due on same day (processes all)
- ✅ Paused/cancelled plans (skipped)
- ✅ Plans with future `nextServiceDate` (skipped)

## Benefits
1. **Time Savings**: Eliminates manual job creation for recurring customers
2. **Consistency**: Ensures no missed services or scheduling gaps
3. **Scalability**: Handles hundreds of service plans automatically
4. **Traceability**: Links jobs to service plans for billing and history
5. **Flexibility**: Supports multiple plan types and custom schedules

## Usage Tips
- Set `nextServiceDate` when creating a service plan to control first job generation
- Use "Paused" status to temporarily stop job generation without deleting the plan
- Review generated jobs before dispatching to verify accuracy
- Track service plan performance by filtering jobs by `servicePlanId`

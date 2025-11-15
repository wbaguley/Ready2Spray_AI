# Ready2Spray AI - Credit Usage Analysis & Pricing Model

## Executive Summary

Ready2Spray AI uses AI in two primary features: **EPA Product Label Extraction** and **AI Chat Assistant**. Based on typical usage patterns, we recommend the following monthly AI credit allocations per organization instance:

- **Starter Plan:** 50 AI credits/month
- **Professional Plan:** 500 AI credits/month
- **Enterprise Plan:** 2,000 AI credits/month

**1 AI Credit = 1,000 tokens** (combined input + output)

---

## Current AI Usage Features

### 1. EPA Product Label Extraction (Vision AI)

**Feature:** Users upload screenshots or PDFs of EPA product labels, and AI extracts all compliance data automatically.

**AI Model:** Claude 3.7 Sonnet with vision capabilities

**Token Usage Per Extraction:**
- **Input:** ~5,000-10,000 tokens (image + prompt)
- **Output:** ~1,000-2,000 tokens (structured JSON data)
- **Total:** ~6,000-12,000 tokens per extraction
- **Credits:** 6-12 credits per product extraction

**Typical Usage:**
- Small operators: 5-10 products per month (30-120 credits)
- Medium operators: 20-50 products per month (120-600 credits)
- Large operators: 50-100 products per season (300-1,200 credits)

**Notes:**
- Products are extracted once and reused across multiple jobs
- Most operators have a library of 20-50 products they use repeatedly
- New products added only when switching chemicals or adding new services

---

### 2. AI Chat Assistant (Text AI)

**Feature:** Users can ask questions about their operations, get weather forecasts, query job data, and receive operational guidance.

**AI Model:** Claude 3.7 Sonnet with MCP tool integration

**Token Usage Per Conversation:**
- **Short query:** "What's today's schedule?" = ~500-1,000 tokens (0.5-1 credit)
- **Medium query:** "Show me all jobs for John Smith" = ~1,000-2,000 tokens (1-2 credits)
- **Long conversation:** Multi-turn discussion with tool calls = ~5,000-10,000 tokens (5-10 credits)

**Typical Usage:**
- **Light users:** 10-20 queries/month = 10-20 credits
- **Moderate users:** 50-100 queries/month = 50-100 credits
- **Heavy users:** 200-500 queries/month = 200-500 credits

**Notes:**
- Chat maintains conversation history (last 10 messages)
- Tool calls (querying database) add minimal tokens
- Most queries are short and focused

---

## Total Monthly AI Credit Usage Estimates

### Starter Plan (1 user, small operator)

**Product Extractions:**
- 5 products/month × 10 credits = **50 credits**

**AI Chat:**
- 20 queries/month × 1 credit = **20 credits**

**Total:** ~70 credits/month  
**Recommended Limit:** **50 credits** (forces users to be selective, encourages upgrade)

---

### Professional Plan (5 users, medium operator)

**Product Extractions:**
- 30 products/month × 10 credits = **300 credits**

**AI Chat:**
- 100 queries/month × 1.5 credits = **150 credits**

**Total:** ~450 credits/month  
**Recommended Limit:** **500 credits** (comfortable buffer)

---

### Enterprise Plan (unlimited users, large operator)

**Product Extractions:**
- 100 products/month × 10 credits = **1,000 credits**

**AI Chat:**
- 500 queries/month × 2 credits = **1,000 credits**

**Total:** ~2,000 credits/month  
**Recommended Limit:** **2,000 credits** (with option to purchase more)

---

## AI Credit Pricing Model

### Base Allocations (Included in Subscription)

| Plan | Monthly Credits | Cost per Credit | Overage Price |
|------|----------------|-----------------|---------------|
| **Starter** | 50 credits | $0.98/credit | $2.00/credit |
| **Professional** | 500 credits | $0.30/credit | $0.50/credit |
| **Enterprise** | 2,000 credits | $0.25/credit | $0.40/credit |

### Overage Pricing

**When credits are exhausted:**
- **Starter:** $2.00 per additional credit (encourages upgrade)
- **Professional:** $0.50 per additional credit
- **Enterprise:** $0.40 per additional credit

**Overage Purchase Options:**
- Buy in packs: 100 credits, 500 credits, 1,000 credits
- Auto-refill when balance drops below 10% (optional)

---

## Updated Pricing Model with AI Credits

### Starter Plan - $49/month
- 1 user
- 100 jobs per month
- **50 AI credits/month** ✨
- Basic features (jobs, customers, sites)
- Email support
- Overage: $2.00/credit

**Target Customer:** Solo operators, small pest control companies

---

### Professional Plan - $149/month
- 5 users
- Unlimited jobs
- **500 AI credits/month** ✨
- All features (EPA compliance, AI assistant, service plans, maintenance tracking)
- API access (1,000 requests/day)
- Priority email support
- Overage: $0.50/credit

**Target Customer:** Medium aerial applicators, regional pest control companies

---

### Enterprise Plan - $499/month
- Unlimited users
- Unlimited jobs
- **2,000 AI credits/month** ✨
- All features + white-label branding
- Unlimited API access
- Dedicated account manager
- Phone support
- Custom integrations
- Overage: $0.40/credit

**Target Customer:** Large aerial application companies, multi-location pest control operations

---

## AI Credit Add-Ons

### Credit Packs (One-Time Purchase)

| Pack Size | Price | Per Credit | Savings |
|-----------|-------|------------|---------|
| 100 credits | $40 | $0.40 | 20% off overage |
| 500 credits | $150 | $0.30 | 40% off overage |
| 1,000 credits | $250 | $0.25 | 50% off overage |

**Expiration:** Credits expire after 12 months

---

## AI Credit Tracking System

### Database Schema

```sql
-- Already exists in schema
CREATE TABLE ai_usage (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  user_id INTEGER REFERENCES users(id),
  conversation_id INTEGER REFERENCES ai_conversations(id),
  model VARCHAR(100) NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- New table for credit balance tracking
CREATE TABLE ai_credit_balance (
  id SERIAL PRIMARY KEY,
  org_id INTEGER UNIQUE REFERENCES organizations(id),
  monthly_allocation INTEGER NOT NULL, -- Based on subscription plan
  credits_used INTEGER DEFAULT 0,
  credits_remaining INTEGER NOT NULL,
  overage_credits INTEGER DEFAULT 0, -- Purchased additional credits
  reset_date TIMESTAMP NOT NULL, -- When monthly allocation resets
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- New table for credit purchases
CREATE TABLE ai_credit_purchases (
  id SERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id),
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10, 2) NOT NULL,
  stripe_payment_id VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Credit Tracking Logic

**On AI Usage:**
1. Check organization's credit balance
2. If credits available: Deduct tokens/1000 from balance
3. If credits exhausted: Check overage credits
4. If overage exhausted: Block AI usage, show upgrade prompt
5. Log usage to ai_usage table

**Monthly Reset:**
- Reset credits_used to 0
- Set credits_remaining to monthly_allocation
- Keep overage_credits (don't reset purchased credits)
- Update reset_date to next month

**Credit Purchase:**
- Add credits to overage_credits
- Set expiration date (12 months from purchase)
- Process Stripe payment
- Send confirmation email

---

## UI/UX for AI Credit Management

### Credit Balance Display

**Location:** Settings → Billing page

**Display:**
```
AI Credits
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monthly Allocation: 500 credits
Used this month: 347 credits (69%)
Remaining: 153 credits (31%)

Overage Credits: 250 credits (expires Dec 31, 2025)

[Progress Bar: ████████████████░░░░░░░░]

Resets on: January 1, 2025

[Buy More Credits] [View Usage History]
```

---

### Credit Usage History

**Location:** Settings → Billing → Usage History

**Display:**
| Date | Feature | User | Tokens | Credits | Balance |
|------|---------|------|--------|---------|---------|
| Dec 15 | Product Extraction | Wyatt | 8,432 | 8.4 | 153 |
| Dec 15 | AI Chat | Wyatt | 1,245 | 1.2 | 161 |
| Dec 14 | AI Chat | John | 2,103 | 2.1 | 163 |
| Dec 14 | Product Extraction | Sarah | 9,876 | 9.9 | 165 |

[Export CSV] [Filter by User] [Filter by Feature]

---

### Low Credit Warning

**When credits drop below 20%:**

```
⚠️ Low AI Credits Warning

You have 98 credits remaining (20% of monthly allocation).

Your AI features will be disabled when credits run out.

[Buy More Credits] [Upgrade Plan] [Dismiss]
```

---

### Credit Exhausted Message

**When credits reach 0:**

```
🚫 AI Credits Exhausted

You've used all 500 monthly AI credits for December.

Options:
1. Wait until January 1 for monthly reset
2. Purchase additional credits ($0.50/credit)
3. Upgrade to Enterprise plan (2,000 credits/month)

[Buy 100 Credits - $50] [Buy 500 Credits - $150] [Upgrade Plan]
```

---

## Implementation Checklist

### Database
- [ ] Create ai_credit_balance table
- [ ] Create ai_credit_purchases table
- [ ] Add monthly_allocation column to organizations table
- [ ] Migrate existing organizations with default allocations

### Backend
- [ ] Create getCreditBalance function
- [ ] Create deductCredits function
- [ ] Create purchaseCredits function
- [ ] Create resetMonthlyCredits cron job (runs on 1st of month)
- [ ] Update invokeLLM wrapper to check/deduct credits
- [ ] Add credit tracking to product extraction endpoint
- [ ] Add credit tracking to AI chat endpoint

### Frontend
- [ ] Create CreditBalance component for Settings
- [ ] Create CreditUsageHistory component
- [ ] Create BuyCredits dialog with Stripe integration
- [ ] Add credit warning toast notifications
- [ ] Add credit exhausted blocking modal
- [ ] Show remaining credits in AI chat widget header
- [ ] Show remaining credits in product lookup page

### Stripe Integration
- [ ] Create Stripe products for credit packs (100, 500, 1000)
- [ ] Create one-time payment flow for credit purchases
- [ ] Handle webhook for successful credit purchases
- [ ] Add credits to organization balance after payment

### Testing
- [ ] Test credit deduction on product extraction
- [ ] Test credit deduction on AI chat
- [ ] Test credit exhaustion blocking
- [ ] Test credit purchase flow
- [ ] Test monthly reset cron job
- [ ] Test overage credit expiration

---

## Business Impact Analysis

### Revenue Opportunity

**Scenario 1: Conservative (100 customers)**
- 80 Professional ($149/mo) = $11,920/mo
- 20 Enterprise ($499/mo) = $9,980/mo
- **Base Revenue:** $21,900/mo = $262,800/year

**Overage Revenue (20% of customers exceed limits):**
- 16 Professional customers × 200 overage credits × $0.50 = $1,600/mo
- 4 Enterprise customers × 500 overage credits × $0.40 = $800/mo
- **Overage Revenue:** $2,400/mo = $28,800/year

**Total Year 1 Revenue:** $291,600

---

**Scenario 2: Optimistic (300 customers)**
- 240 Professional ($149/mo) = $35,760/mo
- 60 Enterprise ($499/mo) = $29,940/mo
- **Base Revenue:** $65,700/mo = $788,400/year

**Overage Revenue (20% of customers exceed limits):**
- 48 Professional customers × 200 overage credits × $0.50 = $4,800/mo
- 12 Enterprise customers × 500 overage credits × $0.40 = $2,400/mo
- **Overage Revenue:** $7,200/mo = $86,400/year

**Total Year 1 Revenue:** $874,800

---

### Cost Analysis

**AI API Costs (Claude 3.7 Sonnet):**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens
- Average: ~$10 per million tokens (mixed input/output)

**Cost per 1,000 tokens (1 credit):** ~$0.01

**Profit Margins:**
- Starter: Sell at $2.00/credit, cost $0.01 = **99.5% margin**
- Professional: Sell at $0.50/credit, cost $0.01 = **98% margin**
- Enterprise: Sell at $0.40/credit, cost $0.01 = **97.5% margin**

**Monthly AI Costs (100 customers):**
- 100 customers × 500 avg credits × $0.01 = **$500/month**

**Monthly AI Costs (300 customers):**
- 300 customers × 500 avg credits × $0.01 = **$1,500/month**

**AI costs are negligible compared to subscription revenue.**

---

## Competitive Comparison

| Platform | AI Features | Credit System | Pricing |
|----------|-------------|---------------|---------|
| **Ready2Spray AI** | EPA extraction + Chat | 50-2,000/mo | $49-499/mo |
| **Jasper AI** | Content generation | 20K-100K words/mo | $39-125/mo |
| **Copy.ai** | Marketing copy | Unlimited | $49-249/mo |
| **ChatGPT Plus** | General chat | Unlimited (rate limited) | $20/mo |
| **Claude Pro** | General chat | Unlimited (rate limited) | $20/mo |

**Key Insight:** Our credit limits are generous compared to competitors. 500 credits/month = ~500 AI interactions, which is more than most users need.

---

## Recommendations

### 1. Start Conservative
- Launch with 50/500/2,000 credit allocations
- Monitor actual usage for 3 months
- Adjust limits based on real data

### 2. Emphasize Value
- Market AI features as "premium" capabilities
- Highlight time savings (10 minutes manual entry → 30 seconds AI extraction)
- Show cost comparison (manual data entry labor vs. AI credits)

### 3. Encourage Upgrades
- Make Starter limits tight (50 credits) to encourage Professional upgrade
- Offer credit pack discounts to retain customers instead of losing them to competitors

### 4. Monitor Usage Patterns
- Track which features consume most credits
- Identify power users who might need Enterprise plans
- Optimize prompts to reduce token usage

### 5. Future Enhancements
- **AI-powered job scheduling** (suggest optimal spray times based on weather)
- **Automated compliance reporting** (generate EPA reports from job data)
- **Predictive maintenance** (AI predicts equipment failures)
- **Voice assistant** (pilots can dictate job notes via speech-to-text)

---

## Next Steps

1. **Implement credit tracking system** (database + backend logic)
2. **Build credit management UI** (Settings page components)
3. **Integrate with Stripe** (credit pack purchases)
4. **Update pricing page** to show credit allocations
5. **Test with beta customers** to validate limits
6. **Launch and monitor** usage patterns

---

## Conclusion

**Recommended AI Credit Allocations:**
- **Starter:** 50 credits/month ($49/mo)
- **Professional:** 500 credits/month ($149/mo)
- **Enterprise:** 2,000 credits/month ($499/mo)

These limits are:
- ✅ **Generous** for typical usage (most users won't hit limits)
- ✅ **Profitable** (98%+ margins on AI costs)
- ✅ **Scalable** (encourages upgrades without being punitive)
- ✅ **Competitive** (more generous than most AI SaaS platforms)

**Expected Outcome:** 80% of customers stay within limits, 20% purchase overages or upgrade, generating additional $30K-90K/year in revenue.

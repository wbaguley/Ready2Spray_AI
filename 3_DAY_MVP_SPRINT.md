# Ready2Spray AI - 3-Day MVP Sprint Plan

## Mission: Production-Ready in 72 Hours 🚀

**Start:** Today  
**Launch:** 3 days from now  
**Developer:** Manus AI (full-time)  
**Goal:** Fully functional MVP with Stripe payments, REST API, AI credits, and production infrastructure

---

## Sprint Overview

### Day 1 (24 hours) - Core Features
- Hybrid AI model implementation (Haiku for chat)
- REST API system with authentication
- AI credit tracking system
- Remove legacy Jobs page

### Day 2 (24 hours) - Infrastructure & Polish
- Stripe payment integration
- Viewer role implementation
- Settings page reorganization
- KML visualization
- Custom domain setup

### Day 3 (24 hours) - Testing & Launch
- End-to-end testing
- Security audit
- Production deployment
- Monitoring setup
- Go live!

---

## Detailed Hour-by-Hour Plan

---

## 🔴 DAY 1: Core Features (Hours 1-24)

### Hours 1-3: Hybrid AI Model Implementation
**Goal:** Switch chat to Claude 3.5 Haiku, keep Sonnet for extraction

**Tasks:**
- [ ] Update `server/claude.ts` to support model selection
- [ ] Add `getClaudeResponseWithModel(model, options)` function
- [ ] Update AI chat endpoint to use Haiku (`claude-3-5-haiku-20241022`)
- [ ] Keep product extraction using Sonnet (`claude-3-7-sonnet-20250219`)
- [ ] Test both endpoints work correctly
- [ ] Update cost calculations in documentation

**Deliverable:** AI chat costs reduced by 75% (from $10/M to $2.40/M tokens)

---

### Hours 4-8: REST API System
**Goal:** Enterprise-grade REST API with authentication

**Tasks:**
- [ ] Create `api_keys` table in Supabase
- [ ] Create `api_usage_logs` table in Supabase
- [ ] Add `generateApiKey()` function (bcrypt hashing)
- [ ] Add `validateApiKey()` middleware
- [ ] Create `/api/v1` router with authentication
- [ ] Implement endpoints:
  - GET /api/v1/jobs (list)
  - POST /api/v1/jobs (create)
  - GET /api/v1/jobs/:id (get)
  - PUT /api/v1/jobs/:id (update)
  - DELETE /api/v1/jobs/:id (delete)
  - GET /api/v1/customers (list)
  - POST /api/v1/customers (create)
  - GET /api/v1/sites (list)
  - POST /api/v1/sites (create)
- [ ] Add rate limiting (100 req/min)
- [ ] Test with Postman

**Deliverable:** Fully functional REST API

---

### Hours 9-13: AI Credit Tracking System
**Goal:** Track and limit AI usage per organization

**Tasks:**
- [ ] Create `ai_credit_balance` table in Supabase
- [ ] Create `ai_credit_purchases` table in Supabase
- [ ] Add `monthly_allocation` to organizations table
- [ ] Create `getCreditBalance(orgId)` function
- [ ] Create `deductCredits(orgId, credits)` function
- [ ] Create `purchaseCredits(orgId, credits, amount)` function
- [ ] Wrap `invokeLLM` to check/deduct credits
- [ ] Update product extraction to track credits
- [ ] Update AI chat to track credits
- [ ] Create `resetMonthlyCredits()` cron job
- [ ] Test credit deduction and exhaustion

**Deliverable:** AI credit system fully operational

---

### Hours 14-16: AI Credit Frontend UI
**Goal:** Display credit balance and usage

**Tasks:**
- [ ] Create `CreditBalance` component for Settings
- [ ] Show monthly allocation, used, remaining
- [ ] Add progress bar visualization
- [ ] Create low credit warning toast (< 20%)
- [ ] Create credit exhausted modal dialog
- [ ] Block AI features when credits exhausted
- [ ] Add "Buy More Credits" button (placeholder for Day 2)
- [ ] Test UI with different credit levels

**Deliverable:** Credit balance UI complete

---

### Hours 17-19: Remove Legacy Jobs Page
**Goal:** Clean up codebase, consolidate to Jobs V2

**Tasks:**
- [ ] Delete `client/src/pages/Jobs.tsx` (old page)
- [ ] Rename `client/src/pages/JobsV2.tsx` → `Jobs.tsx`
- [ ] Rename `client/src/pages/JobV2Detail.tsx` → `JobDetail.tsx`
- [ ] Update `App.tsx` routes: `/jobs-v2` → `/jobs`
- [ ] Update `App.tsx` routes: `/jobs-v2/:id` → `/jobs/:id`
- [ ] Update sidebar navigation: "Jobs V2" → "Jobs"
- [ ] Update all internal links to use `/jobs`
- [ ] Test navigation works correctly

**Deliverable:** Clean Jobs page, no legacy code

---

### Hours 20-22: Viewer Role Implementation
**Goal:** Add read-only role for customers/stakeholders

**Tasks:**
- [ ] Add "viewer" to user_role enum in database
- [ ] Update permissions matrix in `usePermissions` hook
- [ ] Add "Viewer" option to User Management dropdown
- [ ] Hide all action buttons (Create, Edit, Delete) for viewers
- [ ] Add read-only badges to pages for viewers
- [ ] Test viewer can see pages but cannot modify data

**Deliverable:** Viewer role fully functional

---

### Hours 23-24: Day 1 Testing & Checkpoint
**Goal:** Verify all Day 1 features work

**Tasks:**
- [ ] Test hybrid AI model (chat uses Haiku, extraction uses Sonnet)
- [ ] Test REST API endpoints with Postman
- [ ] Test AI credit deduction and exhaustion
- [ ] Test credit balance UI updates correctly
- [ ] Test Jobs page navigation
- [ ] Test Viewer role permissions
- [ ] Fix any critical bugs
- [ ] Save checkpoint: "Day 1 Complete - Core Features"
- [ ] Push to GitHub

**Deliverable:** Day 1 checkpoint saved

---

## 🟡 DAY 2: Infrastructure & Polish (Hours 25-48)

### Hours 25-32: Stripe Payment Integration
**Goal:** Accept payments for subscriptions and credit purchases

**Tasks:**
- [ ] Create Stripe account (if not exists)
- [ ] Create products in Stripe:
  - Starter Plan ($49/mo)
  - Professional Plan ($149/mo)
  - Enterprise Plan ($499/mo)
  - Credit Pack 100 ($40 one-time)
  - Credit Pack 500 ($150 one-time)
  - Credit Pack 1000 ($250 one-time)
- [ ] Install Stripe SDK: `npm install stripe`
- [ ] Add `STRIPE_SECRET_KEY` to environment variables
- [ ] Create `stripe_customer_id` column in organizations table
- [ ] Create `subscription_status` column in organizations table
- [ ] Create `subscription_tier` column in organizations table
- [ ] Create Stripe webhook endpoint: `/api/webhooks/stripe`
- [ ] Implement subscription creation flow
- [ ] Implement subscription update flow (upgrade/downgrade)
- [ ] Implement subscription cancellation flow
- [ ] Implement credit purchase flow (one-time payment)
- [ ] Create Pricing page showing all tiers
- [ ] Create Checkout page with Stripe Elements
- [ ] Create Billing page in Settings showing current plan
- [ ] Add "Upgrade Plan" button
- [ ] Add "Update Payment Method" button
- [ ] Add "Cancel Subscription" button
- [ ] Test with Stripe test cards
- [ ] Handle webhook events (invoice.paid, subscription.updated)

**Deliverable:** Full Stripe integration working

---

### Hours 33-35: Settings Page Reorganization
**Goal:** Clean, tabbed Settings page

**Tasks:**
- [ ] Create tabbed layout for Settings page
- [ ] Add tabs: General, Status Management, User Management, API Keys, Audit Log, Email Test, Integrations, Billing
- [ ] Move UserManagement component into Settings
- [ ] Move AuditLog component into Settings
- [ ] Move EmailTest component into Settings
- [ ] Create APIKeys component (list, generate, revoke)
- [ ] Create Billing component (plan, payment method, invoices)
- [ ] Remove User Management from sidebar
- [ ] Remove Audit Log from sidebar
- [ ] Remove Email Test from sidebar
- [ ] Test all Settings tabs work

**Deliverable:** Organized Settings page

---

### Hours 36-38: API Keys Management UI
**Goal:** Users can generate and manage API keys

**Tasks:**
- [ ] Create APIKeys component for Settings
- [ ] Add "Generate API Key" button with name input
- [ ] Display generated key once with copy-to-clipboard
- [ ] Show masked keys in list (e.g., "rsk_live_abc...xyz")
- [ ] Add revoke/delete button for each key
- [ ] Show last used timestamp
- [ ] Create API documentation page for users
- [ ] Add code examples (curl, JavaScript, Python)
- [ ] Test key generation and revocation

**Deliverable:** API key management complete

---

### Hours 39-42: KML Visualization
**Goal:** Display uploaded map files on job maps

**Tasks:**
- [ ] Install parsing libraries: `npm install @tmcw/togeojson xml2js`
- [ ] Create `parseKML(fileContent)` utility function
- [ ] Create `parseGPX(fileContent)` utility function
- [ ] Create `parseGeoJSON(fileContent)` utility function
- [ ] Update JobDetail map to load linked map files
- [ ] Use Google Maps Data Layer to render GeoJSON
- [ ] Color-code geometries (polygons=blue, lines=red, markers=green)
- [ ] Add info windows showing geometry metadata
- [ ] Add layer toggle controls for multiple files
- [ ] Test with real KML/GPX/GeoJSON files

**Deliverable:** KML visualization working

---

### Hours 43-45: Custom Domain Setup
**Goal:** Configure production domain

**Tasks:**
- [ ] Purchase domain (e.g., ready2spray.com) - USER ACTION
- [ ] Configure DNS CNAME via Manus Management UI
- [ ] Wait for DNS propagation (1-2 hours)
- [ ] Verify SSL certificate auto-provisioned
- [ ] Test HTTPS access on custom domain
- [ ] Update FROM_EMAIL to use custom domain
- [ ] Configure Mailgun domain verification
- [ ] Add DNS records (TXT, CNAME, MX) for email
- [ ] Test email sending from custom domain

**Deliverable:** Custom domain configured

---

### Hours 46-48: Day 2 Testing & Checkpoint
**Goal:** Verify all Day 2 features work

**Tasks:**
- [ ] Test Stripe subscription creation
- [ ] Test Stripe credit purchase
- [ ] Test Settings tabs navigation
- [ ] Test API key generation and usage
- [ ] Test KML file visualization on maps
- [ ] Test custom domain loads correctly
- [ ] Test email sending from custom domain
- [ ] Fix any critical bugs
- [ ] Save checkpoint: "Day 2 Complete - Infrastructure"
- [ ] Push to GitHub

**Deliverable:** Day 2 checkpoint saved

---

## 🟢 DAY 3: Testing & Launch (Hours 49-72)

### Hours 49-54: End-to-End Testing
**Goal:** Test all critical workflows

**Test Scenarios:**
- [ ] User registration and login (OAuth)
- [ ] Create organization
- [ ] Invite team member and assign role
- [ ] Create customer, site, personnel, equipment
- [ ] Create job with all fields
- [ ] Link EPA product via screenshot extraction (Sonnet)
- [ ] Ask AI chat question (Haiku)
- [ ] Verify credit deduction for both features
- [ ] Upload KML file to job
- [ ] View KML on job map
- [ ] Edit job and update fields
- [ ] Delete job
- [ ] Generate API key
- [ ] Test API endpoints with Postman
- [ ] Purchase subscription via Stripe
- [ ] Purchase credit pack via Stripe
- [ ] Test all user roles (Admin, Manager, Technician, Pilot, Sales, Viewer)
- [ ] Test bulk job import/export
- [ ] Test service plan automation
- [ ] Test email notifications
- [ ] Document all bugs found

**Deliverable:** Bug list and fixes

---

### Hours 55-58: Bug Fixes
**Goal:** Fix all critical bugs from testing

**Tasks:**
- [ ] Fix bugs from end-to-end testing
- [ ] Prioritize: Critical → High → Medium
- [ ] Test fixes work correctly
- [ ] Regression test to ensure no new bugs

**Deliverable:** All critical bugs fixed

---

### Hours 59-62: Security & Performance
**Goal:** Production-ready security and performance

**Tasks:**
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Verify HTTPS on all pages
- [ ] Test session timeout (30 minutes)
- [ ] Verify API rate limiting works
- [ ] Test file upload size limits
- [ ] Optimize slow database queries
- [ ] Add database indexes if needed
- [ ] Test with 50 concurrent users (load test)
- [ ] Verify error tracking works (check logs)

**Deliverable:** Security audit complete

---

### Hours 63-65: Production Infrastructure
**Goal:** Set up production services

**Tasks:**
- [ ] Upgrade Supabase to Pro plan ($25/mo)
- [ ] Enable automated daily backups
- [ ] Set up error tracking (Sentry or similar)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure alerts (email for errors)
- [ ] Verify analytics tracking works
- [ ] Test database backup restore
- [ ] Document recovery procedures

**Deliverable:** Production infrastructure ready

---

### Hours 66-68: Legal & Documentation
**Goal:** Legal pages and user documentation

**Tasks:**
- [ ] Create Privacy Policy page (use template)
- [ ] Create Terms of Service page (use template)
- [ ] Add legal pages to footer navigation
- [ ] Create user guide / help center (basic)
- [ ] Create FAQ page
- [ ] Update API documentation
- [ ] Document environment variables
- [ ] Create deployment runbook

**Deliverable:** Legal and docs complete

---

### Hours 69-71: Final Deployment
**Goal:** Deploy to production

**Tasks:**
- [ ] Create final database backup
- [ ] Tag release in GitHub: `v1.0.0-mvp`
- [ ] Switch Stripe from test mode to live mode
- [ ] Update Stripe API keys to live keys
- [ ] Verify all environment variables are set
- [ ] Deploy to production via Manus UI
- [ ] Verify deployment successful
- [ ] Test critical user flows on production
- [ ] Monitor error logs for 1 hour
- [ ] Test payment processing with real card
- [ ] Test email delivery
- [ ] Verify custom domain works

**Deliverable:** Live production deployment

---

### Hour 72: Launch Announcement
**Goal:** Announce to the world

**Tasks:**
- [ ] Create launch announcement post
- [ ] Post on social media (Twitter, LinkedIn)
- [ ] Email beta testers
- [ ] Post on Product Hunt (optional)
- [ ] Post on Hacker News (Show HN)
- [ ] Monitor user signups
- [ ] Respond to support requests
- [ ] Celebrate! 🎉

**Deliverable:** MVP LAUNCHED!

---

## Critical Path Items

**Must Complete in Order:**

1. **Day 1 Morning:** Hybrid AI model (enables cost savings)
2. **Day 1 Afternoon:** REST API + AI credits (core monetization)
3. **Day 2 Morning:** Stripe integration (payment processing)
4. **Day 2 Afternoon:** Settings + API keys (user experience)
5. **Day 3 Morning:** Testing (quality assurance)
6. **Day 3 Afternoon:** Deployment (go live)

---

## Parallel Work Opportunities

**Can be done simultaneously:**
- Viewer role + Settings reorganization (both UI changes)
- KML visualization + Custom domain (independent features)
- Legal pages + Documentation (non-technical)

---

## Risk Mitigation

### High Risk Items:
1. **Stripe Integration (8 hours)** - Most complex, test thoroughly
2. **Custom Domain DNS (1-2 hours wait)** - Start early on Day 2
3. **End-to-End Testing (6 hours)** - May uncover unexpected bugs

### Mitigation Strategies:
- Start Stripe integration early on Day 2
- Purchase domain immediately and configure DNS
- Test continuously throughout Days 1-2, not just Day 3
- Have backup plan: If Stripe fails, launch without payments (add later)

---

## Success Criteria

### Day 1 Success:
- ✅ AI chat uses Haiku (75% cost reduction)
- ✅ REST API working with authentication
- ✅ AI credits track and limit usage
- ✅ Jobs page cleaned up (no legacy code)
- ✅ Viewer role functional

### Day 2 Success:
- ✅ Stripe subscriptions working (test mode)
- ✅ Settings page organized with tabs
- ✅ API keys can be generated and used
- ✅ KML files display on maps
- ✅ Custom domain configured

### Day 3 Success:
- ✅ All critical workflows tested
- ✅ All critical bugs fixed
- ✅ Production infrastructure ready
- ✅ Legal pages published
- ✅ Live on custom domain
- ✅ First customer can sign up and pay

---

## Post-Launch (Week 1)

**Daily Tasks:**
- Monitor error logs
- Monitor user signups
- Respond to support tickets
- Fix bugs as reported
- Collect user feedback

**Weekly Tasks:**
- Review analytics and metrics
- Prioritize bug fixes and features
- Plan next sprint
- Update roadmap

---

## Cost Breakdown (Updated with Haiku)

### AI Costs with Hybrid Model:

**Claude 3.5 Haiku (Chat):**
- Input: $0.80 per million tokens
- Output: $4.00 per million tokens
- Average: ~$2.40 per million tokens
- **Cost per credit:** $0.0024

**Claude 3.7 Sonnet (Product Extraction):**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens
- Average: ~$10 per million tokens
- **Cost per credit:** $0.01

**Blended Cost (assuming 70% chat, 30% extraction):**
- Chat: 70% × $0.0024 = $0.00168
- Extraction: 30% × $0.01 = $0.003
- **Total per credit:** $0.00468 (~$0.005)

**New Profit Margins:**
- Starter: Sell at $2.00/credit, cost $0.005 = **99.75% margin**
- Professional: Sell at $0.50/credit, cost $0.005 = **99% margin**
- Enterprise: Sell at $0.40/credit, cost $0.005 = **98.75% margin**

**Monthly AI Costs (100 customers):**
- 100 customers × 500 avg credits × $0.005 = **$250/month** (was $500)

**Savings: 50% reduction in AI costs!**

---

## Infrastructure Costs (Monthly)

- Supabase Pro: $25/mo
- AWS S3 + CloudFront: $15-70/mo
- Mailgun Email: $35-80/mo
- Domain: ~$1/mo
- Monitoring (Sentry, UptimeRobot): $0-50/mo
- **Total:** $76-226/mo

**Plus AI costs:** $250/mo (100 customers)

**Grand Total:** $326-476/mo for 100 customers

**Revenue at 100 customers:** $21,900/mo

**Profit Margin:** 98%+ 🚀

---

## Communication Plan

### Daily Standups (End of Each Day):
- What was completed today
- What's planned for tomorrow
- Any blockers or risks
- Checkpoint saved and pushed to GitHub

### User Communication:
- Day 1: "Building core features, 33% complete"
- Day 2: "Infrastructure ready, 66% complete"
- Day 3: "Testing and launching, 100% complete"
- Launch: "Ready2Spray AI is LIVE!"

---

## Backup Plan

**If we fall behind schedule:**

### Priority 1 (Must Have for Launch):
- Hybrid AI model
- REST API
- AI credit tracking
- Stripe subscriptions
- Jobs page cleanup
- End-to-end testing

### Priority 2 (Nice to Have, Can Add Post-Launch):
- Viewer role
- Settings reorganization
- API key management UI
- KML visualization
- Custom domain

**If needed, launch with Priority 1 only, add Priority 2 in Week 2.**

---

## Let's Go! 🚀

**Ready to start?** I'll begin with Hour 1: Hybrid AI Model Implementation.

**Your role:**
- Approve this plan
- Purchase domain when I notify you (Day 2, Hour 43)
- Test features as I complete them
- Provide feedback on bugs/issues

**My role:**
- Execute this plan hour-by-hour
- Keep you updated at end of each day
- Save checkpoints after each major milestone
- Get us to MVP in 72 hours

**Let's ship this! 💪**

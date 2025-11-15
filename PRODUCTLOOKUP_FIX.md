# ProductLookup Navigation Fix

## Problem
When users click "Upload Product" from the Products page, the ProductLookup page shows "Save & Return to Job Form" button text, which is confusing since they're not creating a job. After saving, it tries to navigate to the job form instead of returning to the Products page.

## Solution
Update ProductLookup.tsx to detect where the user came from and adjust button text and navigation accordingly.

## Code Changes

### File: `client/src/pages/ProductLookup.tsx`

#### Change 1: Add `fromProducts` detection (around line 20-23)

**Find:**
```typescript
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('jobId') ? parseInt(urlParams.get('jobId')!) : null;
  const jobV2Id = urlParams.get('jobV2Id') ? parseInt(urlParams.get('jobV2Id')!) : null;
  
  // Product data form fields
```

**Replace with:**
```typescript
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('jobId') ? parseInt(urlParams.get('jobId')!) : null;
  const jobV2Id = urlParams.get('jobV2Id') ? parseInt(urlParams.get('jobV2Id')!) : null;
  const fromProducts = urlParams.get('from') === 'products';
  
  // Product data form fields
```

#### Change 2: Update button text and navigation (around line 520-530)

**Find:**
```typescript
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {(jobId || jobV2Id) ? 'Save & Link to Job' : 'Save & Return to Job Form'}
              </Button>
              <Button onClick={handleClear} variant="outline">
                Clear Form
              </Button>
              <Button onClick={() => navigate(jobId ? `/jobs/${jobId}` : jobV2Id ? `/jobs/${jobV2Id}` : "/jobs")} variant="ghost">
                Cancel
              </Button>
            </div>
```

**Replace with:**
```typescript
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {(jobId || jobV2Id) ? 'Save & Link to Job' : fromProducts ? 'Save Product' : 'Save & Return to Job Form'}
              </Button>
              <Button onClick={handleClear} variant="outline">
                Clear Form
              </Button>
              <Button onClick={() => navigate(jobId ? `/jobs/${jobId}` : jobV2Id ? `/jobs/${jobV2Id}` : fromProducts ? "/products" : "/jobs")} variant="ghost">
                Cancel
              </Button>
            </div>
```

## Verification

The Products page already passes the `?from=products` parameter correctly:
- Line 69: `<Button onClick={() => setLocation("/product-lookup?from=products")}>`
- Line 167: `<Button onClick={() => setLocation("/product-lookup?from=products")}>`

No changes needed to Products.tsx.

## Expected Behavior After Fix

### From Products Page:
1. Click "Upload Product" → Opens ProductLookup with `?from=products` parameter
2. Button shows "Save Product" (not "Save & Return to Job Form")
3. Click "Save Product" → Returns to `/products`
4. Click "Cancel" → Returns to `/products`

### From Job Detail Page:
1. Click "Link Product" → Opens ProductLookup with `?jobV2Id=X` parameter
2. Button shows "Save & Link to Job"
3. Click "Save & Link to Job" → Returns to `/jobs/X` with product linked
4. Click "Cancel" → Returns to `/jobs/X`

## Testing Checklist
- [ ] Navigate to Products page
- [ ] Click "Upload Product" button
- [ ] Verify button shows "Save Product"
- [ ] Upload a product and save
- [ ] Verify it returns to Products page
- [ ] Navigate to a job detail page
- [ ] Click "Link Product" button
- [ ] Verify button shows "Save & Link to Job"
- [ ] Link a product and save
- [ ] Verify it returns to job detail page with product linked

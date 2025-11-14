# EPA Pesticide Product Database Research

## Data Source: EPA PPIS (Pesticide Product Information System)

**Official Download Page**: https://www.epa.gov/ingredients-used-pesticide-products/ppis-download-product-information-data

## Available Data Files

### FIFRA Section 3 (Federal Registrations)
The main federal pesticide registrations covering all 50 states.

**Key Files:**
1. **Basic Registration Information** (pkzip-1,600k, ascii-9,200k)
   - EPA registration numbers
   - Product names
   - Registration status (active/cancelled)
   - Registration dates

2. **Product Formulation** (pkzip-674K, ascii-3,400K)
   - Active ingredients
   - Ingredient percentages
   - Chemical formulation details

3. **Alternate Product Names** (pkzip-1,600k, ascii-13,000k)
   - Trade names
   - Brand names
   - Product aliases

4. **Product Pests** (pkzip-3,331K, ascii-20,000K)
   - Target pests for each product
   - Pest control applications

5. **Product Sites** (pkzip-3,253K, ascii-20,800K)
   - Approved application sites (crops, structures, etc.)
   - Use locations

6. **Product Types** (pkzip-340K, ascii-2,000K)
   - Product categories (herbicide, insecticide, fungicide, etc.)

7. **Distributor Products** (pkzip-3,772K, ascii-16,400K)
   - Distributor information
   - Repackaged products

8. **Registrant Name and Address** (pkzip-1,259K, ascii-7,400K)
   - Company information
   - Manufacturer details

### FIFRA Section 24(c) Special Local Need
State-specific registrations for special local needs (smaller dataset).

### Vocabulary Files
- **Chemical Vocabulary** (pkzip-343K, ascii-1,400K) - Active ingredient names
- **Pest Code Vocabulary** (pkzip-88K, ascii-270K) - Pest classifications
- **Site Code Vocabulary** (pkzip-218K, ascii-1,300K) - Application site codes

## Data Format

- **Format**: ASCII text files (likely CSV or tab-delimited)
- **Compression**: PKZIP format
- **Update Schedule**: Updated every Tuesday at 12:01 AM EDT
- **Total Size**: ~45 MB compressed, ~175 MB uncompressed (Section 3 active products)

## XML Alternative

EPA also provides XML format with XSD schema:
- **PPIS XML (Active and Cancelled)**: pkzip-45,333k
- Includes both Section 3 and Section 24(c) data
- Structured format with schema validation

## Implementation Strategy

### Recommended Approach:
1. **Download "Basic Registration Information"** - Core product data
2. **Download "Product Formulation"** - Active ingredients
3. **Download "Product Types"** - Product categories
4. **Download "Chemical Vocabulary"** - Ingredient reference

### Database Schema:
```sql
CREATE TABLE epa_products (
  id SERIAL PRIMARY KEY,
  epa_reg_number VARCHAR(50) UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  registrant_name TEXT,
  active_ingredients JSONB,
  product_type VARCHAR(100),
  registration_status VARCHAR(20),
  registration_date DATE,
  formulation_type VARCHAR(100),
  signal_word VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_epa_reg_number ON epa_products(epa_reg_number);
CREATE INDEX idx_product_name ON epa_products USING gin(to_tsvector('english', product_name));
CREATE INDEX idx_active_ingredients ON epa_products USING gin(active_ingredients);
```

## Next Steps

1. Download the ASCII files from EPA website
2. Parse the text files (likely pipe-delimited or tab-delimited)
3. Create import script to populate Supabase database
4. Build search API with full-text search on product names and ingredients
5. Update Product Lookup UI to query local database

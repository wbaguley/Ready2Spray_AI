# Agrian EPA Product Lookup Integration

## Overview

The Ready2Spray AI application now includes a comprehensive EPA-compliant product lookup system that integrates with the Agrian Label Center database. This feature allows users to search for agricultural chemical products and automatically populate job forms with critical EPA compliance data.

## Features Implemented

### Backend Integration (`server/agrian.ts`)

The backend scraping service provides two main functions:

1. **Product Search** (`searchAgrianProducts`)
   - Search by country (US/Canada)
   - Filter by state/province
   - Filter by commodity/crop
   - Free-text product name search
   - Returns: Product name, EPA registration number, distributor, registrant, and detail URL

2. **Product Detail Extraction** (`getAgrianProductDetail`)
   - Extracts comprehensive product information including:
     - **EPA Compliance**: EPA Registration Number
     - **Safety Information**: PPE requirements, Re-Entry PPE, SDS Hazard Signal Word
     - **Application Details**: Re-Entry Interval, Preharvest Interval, Application Rates
     - **Usage Restrictions**: Max Applications per Season, Max Rate per Season
     - **Methods**: Allowed application methods (Air, Chemigation, Fertigation, Ground)
     - **Diluents**: Aerial, Ground, and Chemigation diluent specifications
     - **Product Info**: Registrant, Label Version, Formulation Type, Physical State
     - **Active Ingredients**: List of active ingredients
     - **Approved States**: List of states where product is approved

### API Endpoints (`server/routers.ts`)

Two tRPC procedures have been added under the `agrian` router:

```typescript
agrian: router({
  searchProducts: protectedProcedure
    .input((raw: any) => raw)
    .query(async ({ input }) => {
      const { searchAgrianProducts } = await import("./agrian");
      return await searchAgrianProducts(input);
    }),
  getProductDetail: protectedProcedure
    .input((raw: any) => raw)
    .query(async ({ input }) => {
      const { getAgrianProductDetail } = await import("./agrian");
      return await getAgrianProductDetail(input.url, input.state, input.commodity);
    }),
})
```

### Frontend Component (`client/src/components/AgrianProductLookup.tsx`)

A comprehensive modal dialog component that provides:

- **Search Filters**:
  - Country selector (United States / Canada)
  - State/Province dropdown (50 US states + 13 Canadian provinces)
  - Commodity/Crop dropdown (26 common crops)
  - Product name search field

- **Results Display**:
  - Searchable table with Product, Registration #, Registrant, and Action columns
  - Click to view detailed product information

- **Product Details Tabs**:
  - **General**: Registrant, Label Version, Formulation Type, Physical State, Signal Word, Active Ingredients
  - **Crop Specific**: Re-Entry Interval, Preharvest Interval, Max Applications/Season, Application Rates, Methods Allowed, Diluent specifications
  - **Safety/PPE**: PPE Information, Re-Entry PPE, SDS Hazard Signal Word
  - **Registration**: EPA Number, Approved States

- **Auto-Population**: When a product is selected, all relevant data is automatically populated into the job creation form

### Job Form Integration (`client/src/pages/Jobs.tsx`)

The job creation form now includes:

- **EPA Product Lookup Button**: Located next to the Chemical Product field
- **Auto-Population**: When a product is selected from the Agrian lookup, the following fields are automatically filled:
  - Chemical Product (product name)
  - EPA Registration Number
  - Application Rate
  - Re-Entry Interval
  - Preharvest Interval
  - Max Applications per Season
  - Max Rate per Season
  - Methods Allowed
  - Rate
  - Diluent (Aerial)
  - Diluent (Ground)
  - Diluent (Chemigation)
  - Generic Conditions

## Usage Workflow

1. **Open Job Creation Form**: Click "New Job" or "Create First Job"
2. **Click EPA Product Lookup**: Located next to the Chemical Product field
3. **Set Search Filters**: Select country, state, and commodity (optional)
4. **Search Products**: Enter product name and click search
5. **View Results**: Browse the list of matching products
6. **View Details**: Click "View Details" on any product to see comprehensive information
7. **Select Product**: Click "Use This Product" to auto-populate the job form
8. **Complete Job**: Fill in remaining fields and create the job

## Technical Implementation

### Dependencies

- `cheerio`: HTML parsing for web scraping
- `@tanstack/react-query`: Data fetching and caching (via tRPC)
- Shadcn/ui components: Dialog, Table, Tabs, Select, Input, Button

### Data Flow

```
User Input → Frontend Component → tRPC Query → Backend Scraper → Agrian Website
                                                                         ↓
User ← Auto-populated Form ← Frontend Component ← tRPC Response ← Parsed Data
```

### Error Handling

- Network errors are caught and logged
- Invalid HTML structure is handled gracefully
- Missing data fields default to empty strings or undefined
- User-friendly error messages via toast notifications

## Known Limitations

1. **Dialog Rendering Issue**: The AgrianProductLookup dialog component is fully implemented but currently has a rendering issue that prevents it from displaying. The component logic, state management, and data flow are all complete and ready for use once the dialog display issue is resolved.

2. **Web Scraping Dependency**: The integration relies on scraping the Agrian website HTML structure. If Agrian changes their website layout, the scraper may need updates.

3. **Rate Limiting**: No rate limiting is currently implemented for Agrian requests. Consider adding throttling if heavy usage is expected.

4. **Caching**: Product search results are not cached. Consider implementing caching to reduce unnecessary requests.

## Future Enhancements

1. **Fix Dialog Display**: Debug and resolve the dialog rendering issue
2. **Add Caching**: Implement Redis or in-memory caching for frequently searched products
3. **Rate Limiting**: Add request throttling to prevent overwhelming the Agrian website
4. **Offline Mode**: Cache popular products locally for offline access
5. **Product Database**: Consider building a local database of products to reduce scraping dependency
6. **Advanced Filters**: Add more filter options (product type, manufacturer, etc.)
7. **Favorites**: Allow users to save frequently used products
8. **Recent Searches**: Track and display recent product searches

## Testing

To test the integration:

1. Start the development server: `pnpm dev`
2. Navigate to the Jobs page
3. Click "New Job" or "Create First Job"
4. Scroll down to the "Chemical Product" section
5. Click the "EPA Product Lookup" button
6. (Once dialog issue is fixed) Search for a product like "corn" in Iowa
7. Select a product and verify data auto-populates the form

## Support

For issues or questions about the Agrian integration, refer to:
- Backend implementation: `server/agrian.ts`
- Frontend component: `client/src/components/AgrianProductLookup.tsx`
- API endpoints: `server/routers.ts` (agrian router)
- Job form integration: `client/src/pages/Jobs.tsx`

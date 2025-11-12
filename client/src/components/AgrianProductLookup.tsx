import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// US States
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// Canadian Provinces
const CA_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
];

// Common commodities/crops
const COMMON_CROPS = [
  "Corn", "Soybeans", "Wheat", "Cotton", "Rice", "Barley", "Oats",
  "Sorghum", "Alfalfa", "Hay", "Peanuts", "Sunflower", "Canola",
  "Sugar Beet", "Potato", "Tomato", "Lettuce", "Onion", "Carrot",
  "Apple", "Orange", "Grape", "Strawberry", "Almond", "Walnut"
];

interface AgrianProductLookupProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (productDetail: any) => void;
  defaultCountry?: "United States" | "Canada";
  defaultState?: string;
  defaultCommodity?: string;
}

export function AgrianProductLookup({
  open,
  onClose,
  onSelectProduct,
  defaultCountry = "United States",
  defaultState,
  defaultCommodity,
}: AgrianProductLookupProps) {
  console.log("AgrianProductLookup render, open:", open);
  const [country, setCountry] = useState<"United States" | "Canada">(defaultCountry);
  const [state, setState] = useState(defaultState || "");
  const [commodity, setCommodity] = useState(defaultCommodity || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Search products
  const searchProducts = trpc.agrian.searchProducts.useQuery(
    {
      country,
      state: state || undefined,
      commodity: commodity || undefined,
      query: searchQuery || undefined,
    },
    {
      enabled: false, // Only run when user clicks search
    }
  );

  // Get product details
  const productDetail = trpc.agrian.getProductDetail.useQuery(
    {
      url: selectedProduct?.url,
      state: state || undefined,
      commodity: commodity || undefined,
    },
    {
      enabled: !!selectedProduct?.url,
    }
  );

  const handleSearch = () => {
    if (!searchQuery && !state && !commodity) {
      toast.error("Please enter a search term or select state/commodity");
      return;
    }
    searchProducts.refetch();
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (productDetail.data) {
      onSelectProduct({
        ...selectedProduct,
        ...productDetail.data,
      });
      onClose();
      toast.success(`Selected: ${selectedProduct.name}`);
    }
  };

  const states = country === "United States" ? US_STATES : CA_PROVINCES;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>EPA Product Lookup - Agrian Label Center</DialogTitle>
          <DialogDescription>
            Search for EPA-registered agricultural products and import compliance data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={(v: any) => setCountry(v)}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="state">State/Province</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="commodity">Commodity/Crop</Label>
              <Select value={commodity} onValueChange={setCommodity}>
                <SelectTrigger id="commodity">
                  <SelectValue placeholder="Select crop..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Crops</SelectItem>
                  {COMMON_CROPS.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Product Name</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searchProducts.isFetching}>
                  {searchProducts.isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchProducts.data && searchProducts.data.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Registration #</TableHead>
                    <TableHead>Registrant</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchProducts.data.map((product: any, idx: number) => (
                    <TableRow
                      key={idx}
                      className={selectedProduct === product ? "bg-muted" : ""}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.registrationNumber || "—"}</TableCell>
                      <TableCell>{product.registrant || "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectProduct(product)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {searchProducts.data && searchProducts.data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Try adjusting your search criteria.
            </div>
          )}

          {/* Product Details */}
          {selectedProduct && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                {selectedProduct.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Agrian
                    </a>
                  </Button>
                )}
              </div>

              {productDetail.isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}

              {productDetail.data && (
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="crop">Crop Specific</TabsTrigger>
                    <TabsTrigger value="safety">Safety/PPE</TabsTrigger>
                    <TabsTrigger value="registration">Registration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Registrant:</span>{" "}
                        {productDetail.data.registrant || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Label Version:</span>{" "}
                        {productDetail.data.labelVersion || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Formulation Type:</span>{" "}
                        {productDetail.data.formulationType || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Physical State:</span>{" "}
                        {productDetail.data.physicalState || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Signal Word:</span>{" "}
                        {productDetail.data.labelSignalWord || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Federally Restricted:</span>{" "}
                        {productDetail.data.federallyRestricted ? "Yes" : "No"}
                      </div>
                      {productDetail.data.activeIngredients && (
                        <div className="col-span-2">
                          <span className="font-semibold">Active Ingredients:</span>{" "}
                          {productDetail.data.activeIngredients.join(", ")}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="crop" className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Re-Entry Interval:</span>{" "}
                        {productDetail.data.reEntryInterval || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Preharvest Interval:</span>{" "}
                        {productDetail.data.preharvestInterval || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Max Applications/Season:</span>{" "}
                        {productDetail.data.maxApplicationsPerSeason || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Max Rate/Season:</span>{" "}
                        {productDetail.data.maxRatePerSeason || "—"}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Methods Allowed:</span>{" "}
                        {productDetail.data.methodsAllowed?.join(", ") || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Rate:</span>{" "}
                        {productDetail.data.rate || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Diluent (Aerial):</span>{" "}
                        {productDetail.data.diluentAerial || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Diluent (Ground):</span>{" "}
                        {productDetail.data.diluentGround || "—"}
                      </div>
                      <div>
                        <span className="font-semibold">Diluent (Chemigation):</span>{" "}
                        {productDetail.data.diluentChemigation || "—"}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="safety" className="space-y-2">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">PPE Information:</span>
                        <p className="mt-1">{productDetail.data.ppeInformation || "—"}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Re-Entry PPE:</span>
                        <p className="mt-1">{productDetail.data.reEntryPPE || "—"}</p>
                      </div>
                      <div>
                        <span className="font-semibold">SDS Hazard Signal Word:</span>{" "}
                        {productDetail.data.sdsHazardSignalWord || "—"}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="registration" className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">EPA Number:</span>{" "}
                        {productDetail.data.epaNumber || productDetail.data.epaRegistrationNumber || "—"}
                      </div>
                      {productDetail.data.approvedStates && (
                        <div className="col-span-2">
                          <span className="font-semibold">Approved States:</span>{" "}
                          {productDetail.data.approvedStates.join(", ")}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Back to Results
                </Button>
                <Button
                  onClick={handleConfirmSelection}
                  disabled={!productDetail.data}
                >
                  Use This Product
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

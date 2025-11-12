import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function ProductLookup() {
  const [, navigate] = useLocation();
  
  // Product data form fields
  const [productData, setProductData] = useState({
    productName: "",
    epaNumber: "",
    registrant: "",
    activeIngredients: "",
    // Crop Specific
    reEntryInterval: "",
    preharvestInterval: "",
    maxApplicationsPerSeason: "",
    maxRatePerSeason: "",
    methodsAllowed: "",
    rate: "",
    diluentAerial: "",
    diluentGround: "",
    diluentChemigation: "",
    // Safety / PPE
    ppeInformation: "",
    labelSignalWord: "",
    // Notes
    genericConditions: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenAgrian = () => {
    window.open("https://www.agrian.com/labelcenter/results.cfm", "_blank", "width=1200,height=800");
    toast.info("Agrian Label Center opened in new window. Search for your product and copy the details back here.");
  };

  const handleSaveProduct = () => {
    // Validate required fields
    if (!productData.productName || !productData.epaNumber) {
      toast.error("Please enter at least Product Name and EPA Registration Number");
      return;
    }

    // Store the product data in localStorage so the job form can access it
    localStorage.setItem("selectedAgrianProduct", JSON.stringify({
      name: productData.productName,
      epaNumber: productData.epaNumber,
      registrant: productData.registrant,
      activeIngredients: productData.activeIngredients,
      reEntryInterval: productData.reEntryInterval,
      preharvestInterval: productData.preharvestInterval,
      maxApplicationsPerSeason: productData.maxApplicationsPerSeason,
      maxRatePerSeason: productData.maxRatePerSeason,
      methodsAllowed: productData.methodsAllowed,
      rate: productData.rate,
      diluentAerial: productData.diluentAerial,
      diluentGround: productData.diluentGround,
      diluentChemigation: productData.diluentChemigation,
      ppeInformation: productData.ppeInformation,
      labelSignalWord: productData.labelSignalWord,
      genericConditions: productData.genericConditions,
    }));
    
    toast.success("Product data saved! Returning to job form...");
    
    // Navigate back to jobs page
    setTimeout(() => {
      navigate("/jobs");
    }, 500);
  };

  const handleClearForm = () => {
    setProductData({
      productName: "",
      epaNumber: "",
      registrant: "",
      activeIngredients: "",
      reEntryInterval: "",
      preharvestInterval: "",
      maxApplicationsPerSeason: "",
      maxRatePerSeason: "",
      methodsAllowed: "",
      rate: "",
      diluentAerial: "",
      diluentGround: "",
      diluentChemigation: "",
      ppeInformation: "",
      labelSignalWord: "",
      genericConditions: "",
    });
    toast.info("Form cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/jobs")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">EPA Product Lookup</h1>
                <p className="text-sm text-muted-foreground">
                  Search Agrian Label Center and enter EPA-compliant product data
                </p>
              </div>
            </div>
            <Button
              onClick={handleOpenAgrian}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Agrian Label Center
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-4xl">
        {/* Instructions */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>How to use:</strong> Click "Open Agrian Label Center" above to search for EPA-registered products. 
            Once you find the right product, copy the relevant information from Agrian and paste it into the form below. 
            Then click "Save & Return to Job Form" to add this product to your work order.
          </AlertDescription>
        </Alert>

        {/* Product Data Entry Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Enter the EPA-registered product details from Agrian Label Center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Roundup PowerMAX"
                    value={productData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="epaNumber">
                    EPA Registration Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="epaNumber"
                    placeholder="e.g., 524-549"
                    value={productData.epaNumber}
                    onChange={(e) => handleInputChange("epaNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrant">Registrant/Manufacturer</Label>
                  <Input
                    id="registrant"
                    placeholder="e.g., Bayer CropScience"
                    value={productData.registrant}
                    onChange={(e) => handleInputChange("registrant", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activeIngredients">Active Ingredients</Label>
                  <Input
                    id="activeIngredients"
                    placeholder="e.g., Glyphosate 48.7%"
                    value={productData.activeIngredients}
                    onChange={(e) => handleInputChange("activeIngredients", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Crop Specific Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Crop Specific Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reEntryInterval">Re-Entry Interval (REI)</Label>
                  <Input
                    id="reEntryInterval"
                    placeholder="e.g., 4 hours"
                    value={productData.reEntryInterval}
                    onChange={(e) => handleInputChange("reEntryInterval", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preharvestInterval">Pre-Harvest Interval (PHI)</Label>
                  <Input
                    id="preharvestInterval"
                    placeholder="e.g., 7 days"
                    value={productData.preharvestInterval}
                    onChange={(e) => handleInputChange("preharvestInterval", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxApplicationsPerSeason">Max Applications/Season</Label>
                  <Input
                    id="maxApplicationsPerSeason"
                    placeholder="e.g., 3"
                    value={productData.maxApplicationsPerSeason}
                    onChange={(e) => handleInputChange("maxApplicationsPerSeason", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRatePerSeason">Max Rate/Season</Label>
                  <Input
                    id="maxRatePerSeason"
                    placeholder="e.g., 8 quarts/acre"
                    value={productData.maxRatePerSeason}
                    onChange={(e) => handleInputChange("maxRatePerSeason", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="methodsAllowed">Application Methods Allowed</Label>
                  <Input
                    id="methodsAllowed"
                    placeholder="e.g., Ground, Aerial"
                    value={productData.methodsAllowed}
                    onChange={(e) => handleInputChange("methodsAllowed", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Application Rate</Label>
                  <Input
                    id="rate"
                    placeholder="e.g., 22 fl oz/acre"
                    value={productData.rate}
                    onChange={(e) => handleInputChange("rate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diluentAerial">Diluent (Aerial)</Label>
                  <Input
                    id="diluentAerial"
                    placeholder="e.g., 3-15 gal/acre"
                    value={productData.diluentAerial}
                    onChange={(e) => handleInputChange("diluentAerial", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diluentGround">Diluent (Ground)</Label>
                  <Input
                    id="diluentGround"
                    placeholder="e.g., 10-40 gal/acre"
                    value={productData.diluentGround}
                    onChange={(e) => handleInputChange("diluentGround", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="diluentChemigation">Diluent (Chemigation)</Label>
                  <Input
                    id="diluentChemigation"
                    placeholder="e.g., Sufficient water to provide uniform coverage"
                    value={productData.diluentChemigation}
                    onChange={(e) => handleInputChange("diluentChemigation", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Safety / PPE Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Safety & PPE Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="labelSignalWord">Label Signal Word</Label>
                  <Input
                    id="labelSignalWord"
                    placeholder="e.g., CAUTION, WARNING, DANGER"
                    value={productData.labelSignalWord}
                    onChange={(e) => handleInputChange("labelSignalWord", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ppeInformation">PPE Requirements</Label>
                  <Input
                    id="ppeInformation"
                    placeholder="e.g., Long pants, long-sleeved shirt, gloves"
                    value={productData.ppeInformation}
                    onChange={(e) => handleInputChange("ppeInformation", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <div className="space-y-2">
                <Label htmlFor="genericConditions">Generic Conditions / Special Instructions</Label>
                <Textarea
                  id="genericConditions"
                  placeholder="Enter any special conditions, restrictions, or additional notes..."
                  rows={4}
                  value={productData.genericConditions}
                  onChange={(e) => handleInputChange("genericConditions", e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSaveProduct}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save & Return to Job Form
              </Button>
              <Button
                variant="outline"
                onClick={handleClearForm}
              >
                Clear Form
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/jobs")}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

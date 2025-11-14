import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Save, AlertCircle, Camera, Upload, Loader2, X, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ProductLookup() {
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [capturedScreenshots, setCapturedScreenshots] = useState<string[]>([]);
  
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

  const extractProductMutation = trpc.products.extractFromScreenshot.useMutation({
    onSuccess: (data) => {
      setIsExtracting(false);
      if (data.success && data.extractedData) {
        // Merge extracted data with existing data (don't overwrite non-empty fields)
        setProductData(prev => {
          const merged = { ...prev };
          Object.entries(data.extractedData).forEach(([key, value]) => {
            if (value && (!prev[key as keyof typeof prev] || prev[key as keyof typeof prev] === "")) {
              (merged as any)[key] = value;
            }
          });
          return merged;
        });
        toast.success("Product details extracted successfully! Please review and edit as needed.");
      } else {
        toast.error(data.error || "Failed to extract product details");
      }
    },
    onError: (error) => {
      setIsExtracting(false);
      toast.error("Error extracting product details: " + error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenAgrian = () => {
    window.open("https://www.agrian.com/labelcenter/results.cfm", "_blank", "width=1200,height=800");
    toast.info("Agrian Label Center opened in new window. Search for your product, then use 'Capture Screenshot' button.");
  };

  const handleCaptureScreenshot = async () => {
    try {
      // Check if browser supports screen capture
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        toast.error("Screen capture is not supported in your browser. Please use the Upload Screenshot option instead.");
        return;
      }

      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as any,
      });

      // Create video element to capture frame
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas and capture frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);

      // Stop the stream
      stream.getTracks().forEach(track => track.stop());

      // Convert to base64
      const base64Image = canvas.toDataURL("image/png");
      
      // Add to captured screenshots
      setCapturedScreenshots(prev => [...prev, base64Image]);
      toast.success(`Screenshot ${capturedScreenshots.length + 1} captured! You can capture more or extract data now.`);
    } catch (error: any) {
      if (error.name === "NotAllowedError") {
        toast.error("Screen capture permission denied");
      } else {
        toast.error("Failed to capture screenshot: " + error.message);
      }
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setCapturedScreenshots(prev => prev.filter((_, i) => i !== index));
    toast.info("Screenshot removed");
  };

  const handleExtractFromCaptures = async () => {
    if (capturedScreenshots.length === 0) {
      toast.error("Please capture at least one screenshot first");
      return;
    }

    setIsExtracting(true);
    toast.info(`Analyzing ${capturedScreenshots.length} screenshot(s)...`);

    // Process each screenshot and merge results
    for (let i = 0; i < capturedScreenshots.length; i++) {
      await extractProductMutation.mutateAsync({ imageData: capturedScreenshots[i] });
      if (i < capturedScreenshots.length - 1) {
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsExtracting(false);
  };

  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 10MB.");
      return;
    }

    setIsExtracting(true);
    toast.info("Analyzing screenshot...");

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      extractProductMutation.mutate({ imageData: base64String });
    };
    reader.onerror = () => {
      setIsExtracting(false);
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Validate required fields
    if (!productData.productName || !productData.epaNumber) {
      toast.error("Please fill in Product Name and EPA Registration Number");
      return;
    }

    // TODO: Save to database and return to job form
    toast.success("Product saved successfully!");
    navigate("/jobs");
  };

  const handleClear = () => {
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
    setCapturedScreenshots([]);
    toast.info("Form cleared");
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">EPA Product Lookup</h1>
          <p className="text-muted-foreground">Search Agrian Label Center and capture product details with AI</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Open Agrian, capture screenshots of product details, then extract data with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleOpenAgrian} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Agrian
            </Button>
            <Button onClick={handleCaptureScreenshot} variant="default" disabled={isExtracting}>
              <Camera className="h-4 w-4 mr-2" />
              Capture Screenshot
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline"
              disabled={isExtracting}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Screenshot
            </Button>
            {capturedScreenshots.length > 0 && (
              <Button 
                onClick={handleExtractFromCaptures} 
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={isExtracting}
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Extract from {capturedScreenshots.length} Screenshot{capturedScreenshots.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Screenshot Preview Gallery */}
        {capturedScreenshots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Captured Screenshots ({capturedScreenshots.length}/3)</CardTitle>
              <CardDescription>
                Review your captures. You can capture up to 3 screenshots from different tabs (General, Safety, Crop Specific).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {capturedScreenshots.map((screenshot, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={screenshot} 
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveScreenshot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Screenshot {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>How to use:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click "Open Agrian" to search for EPA-registered products</li>
              <li>Once you find the product, click "Capture Screenshot" to capture the visible page</li>
              <li>Navigate to different tabs (Safety, Crop Specific) and capture more screenshots if needed</li>
              <li>Click "Extract from Screenshots" to automatically fill in the product details</li>
              <li>Review and edit the extracted information as needed</li>
              <li>Click "Save & Return to Job Form" to add this product to your work order</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Product Information Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Capture screenshots or manually enter EPA-registered product details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Roundup PowerMAX"
                    value={productData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="epaNumber">EPA Registration Number *</Label>
                  <Input
                    id="epaNumber"
                    placeholder="e.g., 524-549"
                    value={productData.epaNumber}
                    onChange={(e) => handleInputChange("epaNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="registrant">Registrant/Manufacturer</Label>
                  <Input
                    id="registrant"
                    placeholder="e.g., Bayer CropScience"
                    value={productData.registrant}
                    onChange={(e) => handleInputChange("registrant", e.target.value)}
                  />
                </div>
                <div>
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Crop Specific Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reEntryInterval">Re-Entry Interval (REI)</Label>
                  <Input
                    id="reEntryInterval"
                    placeholder="e.g., 4 hours"
                    value={productData.reEntryInterval}
                    onChange={(e) => handleInputChange("reEntryInterval", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="preharvestInterval">Pre-Harvest Interval (PHI)</Label>
                  <Input
                    id="preharvestInterval"
                    placeholder="e.g., 7 days"
                    value={productData.preharvestInterval}
                    onChange={(e) => handleInputChange("preharvestInterval", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxApplicationsPerSeason">Max Applications/Season</Label>
                  <Input
                    id="maxApplicationsPerSeason"
                    placeholder="e.g., 3"
                    value={productData.maxApplicationsPerSeason}
                    onChange={(e) => handleInputChange("maxApplicationsPerSeason", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxRatePerSeason">Max Rate/Season</Label>
                  <Input
                    id="maxRatePerSeason"
                    placeholder="e.g., 8 quarts/acre"
                    value={productData.maxRatePerSeason}
                    onChange={(e) => handleInputChange("maxRatePerSeason", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="methodsAllowed">Application Methods Allowed</Label>
                  <Input
                    id="methodsAllowed"
                    placeholder="e.g., Ground, Aerial"
                    value={productData.methodsAllowed}
                    onChange={(e) => handleInputChange("methodsAllowed", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Application Rate</Label>
                  <Input
                    id="rate"
                    placeholder="e.g., 22 fl oz/acre"
                    value={productData.rate}
                    onChange={(e) => handleInputChange("rate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="diluentAerial">Diluent (Aerial)</Label>
                  <Input
                    id="diluentAerial"
                    placeholder="e.g., 3-15 gal/acre"
                    value={productData.diluentAerial}
                    onChange={(e) => handleInputChange("diluentAerial", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="diluentGround">Diluent (Ground)</Label>
                  <Input
                    id="diluentGround"
                    placeholder="e.g., 10-40 gal/acre"
                    value={productData.diluentGround}
                    onChange={(e) => handleInputChange("diluentGround", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
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

            {/* Safety & PPE Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Safety & PPE Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labelSignalWord">Label Signal Word</Label>
                  <Input
                    id="labelSignalWord"
                    placeholder="e.g., CAUTION, WARNING, DANGER"
                    value={productData.labelSignalWord}
                    onChange={(e) => handleInputChange("labelSignalWord", e.target.value)}
                  />
                </div>
                <div>
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <div>
                <Label htmlFor="genericConditions">Generic Conditions / Special Instructions</Label>
                <Textarea
                  id="genericConditions"
                  placeholder="Enter any additional notes, restrictions, or special instructions..."
                  value={productData.genericConditions}
                  onChange={(e) => handleInputChange("genericConditions", e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save & Return to Job Form
              </Button>
              <Button onClick={handleClear} variant="outline">
                Clear Form
              </Button>
              <Button onClick={() => navigate("/jobs")} variant="ghost">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

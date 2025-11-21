import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Plus, Pencil, Trash2, Building2, Trees } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteMapDrawer } from "@/components/SiteMapDrawer";

export default function Sites() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMapDrawer, setShowMapDrawer] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerId: undefined as number | undefined,
    name: "",
    siteType: "field" as "field" | "orchard" | "vineyard" | "pivot" | "property" | "commercial_building",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    centerLat: "",
    centerLng: "",
    acres: "",
    polygon: null as any,
    sensitiveAreas: [] as any[],
    crop: "",
    variety: "",
    growthStage: "",
    propertyType: undefined as "residential" | "commercial" | "multi_family" | "industrial" | undefined,
    units: "",
    notes: "",
  });

  const { data: sites, isLoading } = trpc.sites.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.sites.create.useMutation({
    onSuccess: () => {
      utils.sites.list.invalidate();
      toast.success("Site created successfully!");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to create site: ${error.message}`);
    },
  });

  const updateMutation = trpc.sites.update.useMutation({
    onSuccess: () => {
      utils.sites.list.invalidate();
      toast.success("Site updated successfully!");
      setShowEditDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to update site: ${error.message}`);
    },
  });

  const deleteMutation = trpc.sites.delete.useMutation({
    onSuccess: () => {
      utils.sites.list.invalidate();
      toast.success("Site deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete site: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      customerId: undefined,
      name: "",
      siteType: "field",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      centerLat: "",
      centerLng: "",
      acres: "",
      crop: "",
      variety: "",
      growthStage: "",
      propertyType: undefined,
      units: "",
      notes: "",
      polygon: null,
      sensitiveAreas: [],
    });
    setSelectedSite(null);
  };

  const handleCreate = () => {
    const payload: any = {
      ...formData,
      customerId: formData.customerId || undefined,
      acres: formData.acres ? parseFloat(formData.acres) : undefined,
      units: formData.units ? parseInt(formData.units) : undefined,
      polygon: formData.polygon || undefined,
      sensitiveAreas: formData.sensitiveAreas.length > 0 ? formData.sensitiveAreas : undefined,
    };
    createMutation.mutate(payload);
  };

  const handleEdit = (site: any) => {
    setSelectedSite(site);
    setFormData({
      customerId: site.customerId || undefined,
      name: site.name || "",
      siteType: site.siteType || "field",
      address: site.address || "",
      city: site.city || "",
      state: site.state || "",
      zipCode: site.zipCode || "",
      centerLat: site.centerLat || "",
      centerLng: site.centerLng || "",
      acres: site.acres || "",
      polygon: site.polygon || null,
      sensitiveAreas: site.sensitiveAreas || [],
      crop: site.crop || "",
      variety: site.variety || "",
      growthStage: site.growthStage || "",
      propertyType: site.propertyType || undefined,
      units: site.units || "",
      notes: site.notes || "",
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (!selectedSite) return;
    const payload: any = {
      id: selectedSite.id,
      ...formData,
      customerId: formData.customerId || undefined,
      acres: formData.acres ? parseFloat(formData.acres) : undefined,
      units: formData.units ? parseInt(formData.units) : undefined,
      polygon: formData.polygon || undefined,
      sensitiveAreas: formData.sensitiveAreas.length > 0 ? formData.sensitiveAreas : undefined,
    };
    updateMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this site?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage fields, properties, and treatment locations
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Site
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites?.map((site: any) => (
          <Card key={site.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {site.siteType === "field" || site.siteType === "orchard" || site.siteType === "vineyard" ? (
                    <Trees className="h-5 w-5 text-green-600" />
                  ) : (
                    <Building2 className="h-5 w-5 text-blue-600" />
                  )}
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(site)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {site.siteType.replace("_", " ").toUpperCase()}
                {site.customerName && ` • ${site.customerName}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {site.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {site.address}
                      {site.city && `, ${site.city}`}
                      {site.state && `, ${site.state}`}
                    </span>
                  </div>
                )}
                {site.acres && (
                  <div className="text-muted-foreground">
                    <strong>Acres:</strong> {site.acres}
                  </div>
                )}
                {site.crop && (
                  <div className="text-muted-foreground">
                    <strong>Crop:</strong> {site.crop}
                    {site.variety && ` (${site.variety})`}
                  </div>
                )}
                {site.propertyType && (
                  <div className="text-muted-foreground">
                    <strong>Property Type:</strong> {site.propertyType.replace("_", " ")}
                  </div>
                )}
                {site.units && (
                  <div className="text-muted-foreground">
                    <strong>Units:</strong> {site.units}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Site Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
            <DialogDescription>
              Add a new field, property, or treatment location
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={formData.customerId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerId: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., North Field, Main Property"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteType">Site Type *</Label>
              <Select
                value={formData.siteType}
                onValueChange={(value: any) => setFormData({ ...formData, siteType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field">Field</SelectItem>
                  <SelectItem value="orchard">Orchard</SelectItem>
                  <SelectItem value="vineyard">Vineyard</SelectItem>
                  <SelectItem value="pivot">Pivot</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="commercial_building">Commercial Building</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
              />
            </div>

            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMapDrawer(true)}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {formData.polygon ? "Edit Boundaries on Map" : "Draw Boundaries on Map"}
              </Button>
              {formData.acres && (
                <p className="text-sm text-muted-foreground">
                  Calculated acres: {formData.acres}
                </p>
              )}
            </div>

            {(formData.siteType === "field" || formData.siteType === "orchard" || formData.siteType === "vineyard" || formData.siteType === "pivot") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="acres">Acres</Label>
                  <Input
                    id="acres"
                    type="number"
                    step="0.01"
                    value={formData.acres}
                    onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="crop">Crop</Label>
                  <Input
                    id="crop"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    placeholder="e.g., Corn, Soybeans, Wheat"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g., Variety name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="growthStage">Growth Stage</Label>
                  <Input
                    id="growthStage"
                    value={formData.growthStage}
                    onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                    placeholder="e.g., V6, R3"
                  />
                </div>
              </>
            )}

            {(formData.siteType === "property" || formData.siteType === "commercial_building") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType || ""}
                    onValueChange={(value: any) => setFormData({ ...formData, propertyType: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="units">Units</Label>
                  <Input
                    id="units"
                    type="number"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    placeholder="Number of units"
                  />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this site"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Site Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
            <DialogDescription>
              Update site information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-customer">Customer</Label>
              <Select
                value={formData.customerId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerId: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-name">Site Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., North Field, Main Property"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-siteType">Site Type *</Label>
              <Select
                value={formData.siteType}
                onValueChange={(value: any) => setFormData({ ...formData, siteType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field">Field</SelectItem>
                  <SelectItem value="orchard">Orchard</SelectItem>
                  <SelectItem value="vineyard">Vineyard</SelectItem>
                  <SelectItem value="pivot">Pivot</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="commercial_building">Commercial Building</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-zipCode">ZIP Code</Label>
              <Input
                id="edit-zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
              />
            </div>

            {(formData.siteType === "field" || formData.siteType === "orchard" || formData.siteType === "vineyard" || formData.siteType === "pivot") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-acres">Acres</Label>
                  <Input
                    id="edit-acres"
                    type="number"
                    step="0.01"
                    value={formData.acres}
                    onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-crop">Crop</Label>
                  <Input
                    id="edit-crop"
                    value={formData.crop}
                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                    placeholder="e.g., Corn, Soybeans, Wheat"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-variety">Variety</Label>
                  <Input
                    id="edit-variety"
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g., Variety name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-growthStage">Growth Stage</Label>
                  <Input
                    id="edit-growthStage"
                    value={formData.growthStage}
                    onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                    placeholder="e.g., V6, R3"
                  />
                </div>
              </>
            )}

            {(formData.siteType === "property" || formData.siteType === "commercial_building") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-propertyType">Property Type</Label>
                  <Select
                    value={formData.propertyType || ""}
                    onValueChange={(value: any) => setFormData({ ...formData, propertyType: value || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-units">Units</Label>
                  <Input
                    id="edit-units"
                    type="number"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    placeholder="Number of units"
                  />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this site"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Map Drawer */}
      <SiteMapDrawer
        open={showMapDrawer}
        onOpenChange={setShowMapDrawer}
        onSave={(polygon, centerLat, centerLng, acres, sensitiveAreas) => {
          setFormData({
            ...formData,
            polygon,
            centerLat,
            centerLng,
            acres: acres.toFixed(2),
            sensitiveAreas: sensitiveAreas || [],
          });
        }}
        initialPolygon={formData.polygon}
        initialCenter={
          formData.centerLat && formData.centerLng
            ? { lat: parseFloat(formData.centerLat), lng: parseFloat(formData.centerLng) }
            : undefined
        }
        initialSensitiveAreas={formData.sensitiveAreas}
      />
    </div>
  );
}

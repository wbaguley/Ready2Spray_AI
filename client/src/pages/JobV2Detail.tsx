import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Link as LinkIcon, Package, AlertTriangle, Clock, Droplets, Sprout } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
// ProductLookup will be added later

export default function JobV2Detail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const jobId = params.id ? parseInt(params.id) : 0;
  const { data: job, isLoading, refetch } = trpc.jobsV2.getById.useQuery({ id: jobId });

  const handleLinkProduct = () => {
    // Navigate to ProductLookup page with jobV2Id parameter
    setLocation(`/product-lookup?jobV2Id=${jobId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Job not found</p>
              <Button onClick={() => setLocation("/jobs-v2")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/jobs-v2")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-muted-foreground mt-1">
                Created {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>Basic details about this spray job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-lg">{job.title}</p>
            </div>
            
            {job.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-base whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Chemical Product
                </CardTitle>
                <CardDescription>
                  Link a product to view EPA compliance and agricultural details
                </CardDescription>
              </div>
              <Button
                onClick={handleLinkProduct}
                variant={job.product ? "outline" : "default"}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {job.product ? "Change Product" : "Link Product"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {job.product ? (
              <div className="space-y-6">
                {/* Product Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                    <p className="text-lg font-semibold">{job.product.nickname || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">EPA Number</label>
                    <p className="text-lg">
                      {job.product.epaNumber ? (
                        <Badge variant="secondary" className="text-sm">
                          EPA {job.product.epaNumber}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                    <p>{job.product.manufacturer || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Active Ingredients</label>
                    <p>{job.product.activeIngredients || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                {/* EPA Compliance Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    EPA Compliance Requirements
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <label className="text-sm font-medium">REI (Re-Entry Interval)</label>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        {(job.product as any).reEntryInterval || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="w-4 h-4 text-green-600" />
                        <label className="text-sm font-medium">PHI (Pre-Harvest Interval)</label>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {(job.product as any).preharvestInterval || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <label className="text-sm font-medium">Max Applications/Season</label>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {(job.product as any).maxApplicationsPerSeason || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Agricultural Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Agricultural Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {(job.product as any).crop && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Crop</label>
                        <p>{(job.product as any).crop}</p>
                      </div>
                    )}
                    {(job.product as any).targetPest && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Target Pest</label>
                        <p>{(job.product as any).targetPest}</p>
                      </div>
                    )}
                    {(job.product as any).rate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Application Rate</label>
                        <p>{(job.product as any).rate}</p>
                      </div>
                    )}
                    {(job.product as any).methodsAllowed && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Allowed Methods</label>
                        <p>{(job.product as any).methodsAllowed}</p>
                      </div>
                    )}
                    {(job.product as any).maxRatePerSeason && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Max Rate/Season</label>
                        <p>{(job.product as any).maxRatePerSeason}</p>
                      </div>
                    )}
                    {(job.product as any).diluentAerial && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Diluent (Aerial)</label>
                        <p>{(job.product as any).diluentAerial}</p>
                      </div>
                    )}
                    {(job.product as any).diluentGround && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Diluent (Ground)</label>
                        <p>{(job.product as any).diluentGround}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                {((job.product as any).genericConditions || (job.product as any).ppe) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      {(job.product as any).genericConditions && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Generic Conditions</label>
                          <p className="text-sm whitespace-pre-wrap mt-1">{(job.product as any).genericConditions}</p>
                        </div>
                      )}
                      {(job.product as any).ppe && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Required PPE</label>
                          <p className="text-sm whitespace-pre-wrap mt-1">{(job.product as any).ppe}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No product linked yet</p>
                <p className="text-sm mt-2">Link a chemical product to view EPA compliance and agricultural details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Lookup Dialog - Will be added later */}
    </DashboardLayout>
  );
}

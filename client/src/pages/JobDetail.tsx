import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, User, Users, Loader2, Edit, Trash2, Clock, Download } from "lucide-react";
import { exportJobToPDF } from "@/lib/pdfExport";
import { format } from "date-fns";
import { toast } from "sonner";
import { StatusHistory } from "@/components/StatusHistory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const [, setLocation] = useLocation();
  const jobId = params?.id ? parseInt(params.id) : null;

  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery();
  const { data: customers } = trpc.customers.list.useQuery();
  const { data: personnel } = trpc.personnel.list.useQuery();
  const deleteMutation = trpc.jobs.delete.useMutation();
  const utils = trpc.useUtils();

  const job = jobs?.find((j) => j.id === jobId);
  const customer = customers?.find((c) => c.id === job?.customerId);
  const assignedPerson = personnel?.find((p) => p.id === job?.assignedPersonnelId);

  useEffect(() => {
    if (!isLoading && !job) {
      toast.error("Job not found");
      setLocation("/jobs");
    }
  }, [job, isLoading, setLocation]);

  const handleDelete = async () => {
    if (!jobId) return;

    try {
      await deleteMutation.mutateAsync({ id: jobId });
      toast.success("Job deleted successfully");
      utils.jobs.list.invalidate();
      setLocation("/jobs");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const jobTypeLabels = {
    crop_dusting: "Crop Dusting",
    pest_control: "Pest Control",
    fertilization: "Fertilization",
    herbicide: "Herbicide",
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/jobs")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="border"
                style={{
                  backgroundColor: job.statusColor ? `${job.statusColor}20` : undefined,
                  borderColor: job.statusColor || undefined,
                  color: job.statusColor || undefined,
                }}
              >
                {job.statusName}
              </Badge>
              <Badge variant="outline" className={priorityColors[job.priority]}>
                {job.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline">{jobTypeLabels[job.jobType]}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportJobToPDF(job)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation(`/jobs?edit=${job.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {job.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="text-sm">{job.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Type</h3>
                <p className="text-sm">{jobTypeLabels[job.jobType]}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                <p className="text-sm capitalize">{job.priority}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Personnel */}
        <Card>
          <CardHeader>
            <CardTitle>Customer & Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <User className="h-4 w-4" />
                  Customer
                </div>
                <p className="text-sm">{customer?.name || "Not assigned"}</p>
                {customer?.email && (
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                )}
                {customer?.phone && (
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  Assigned Personnel
                </div>
                <p className="text-sm">{assignedPerson?.name || "Not assigned"}</p>
                {assignedPerson?.role && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {assignedPerson.role.replace("_", " ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {job.locationAddress && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </div>
                <p className="text-sm">{job.locationAddress}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {job.scheduledStart && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Scheduled Start
                  </div>
                  <p className="text-sm">
                    {format(new Date(job.scheduledStart), "PPpp")}
                  </p>
                </div>
              )}

              {job.scheduledEnd && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Scheduled End
                  </div>
                  <p className="text-sm">
                    {format(new Date(job.scheduledEnd), "PPpp")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Details */}
        {(job.state || job.commodityCrop || job.targetPest || job.epaNumber || job.applicationRate || job.applicationMethod || job.chemicalProduct) && (
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {job.state && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">State</h3>
                    <p className="text-sm">{job.state}</p>
                  </div>
                )}
                {job.commodityCrop && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Commodity/Crop</h3>
                    <p className="text-sm">{job.commodityCrop}</p>
                  </div>
                )}
                {job.targetPest && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Target Pest</h3>
                    <p className="text-sm">{job.targetPest}</p>
                  </div>
                )}
                {job.epaNumber && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">EPA Registration Number</h3>
                    <p className="text-sm">{job.epaNumber}</p>
                  </div>
                )}
                {job.applicationRate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Application Rate</h3>
                    <p className="text-sm">{job.applicationRate}</p>
                  </div>
                )}
                {job.applicationMethod && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Application Method</h3>
                    <p className="text-sm capitalize">{job.applicationMethod}</p>
                  </div>
                )}
                {job.chemicalProduct && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Chemical Product</h3>
                    <p className="text-sm">{job.chemicalProduct}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crop Specifics */}
        {(job.reEntryInterval || job.preharvestInterval || job.maxApplicationsPerSeason || job.maxRatePerSeason || job.methodsAllowed || job.rate || job.diluentAerial || job.diluentGround || job.diluentChemigation) && (
          <Card>
            <CardHeader>
              <CardTitle>Crop Specifics & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {job.reEntryInterval && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Re-Entry Interval (REI)</h3>
                    <p className="text-sm">{job.reEntryInterval}</p>
                  </div>
                )}
                {job.preharvestInterval && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Pre-harvest Interval (PHI)</h3>
                    <p className="text-sm">{job.preharvestInterval}</p>
                  </div>
                )}
                {job.maxApplicationsPerSeason && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Max Applications per Season</h3>
                    <p className="text-sm">{job.maxApplicationsPerSeason}</p>
                  </div>
                )}
                {job.maxRatePerSeason && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Max Rate per Season</h3>
                    <p className="text-sm">{job.maxRatePerSeason}</p>
                  </div>
                )}
                {job.methodsAllowed && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Methods Allowed</h3>
                    <p className="text-sm">{job.methodsAllowed}</p>
                  </div>
                )}
                {job.rate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Rate</h3>
                    <p className="text-sm">{job.rate}</p>
                  </div>
                )}
              </div>

              {(job.diluentAerial || job.diluentGround || job.diluentChemigation) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Diluent Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {job.diluentAerial && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Aerial</p>
                          <p className="text-sm">{job.diluentAerial}</p>
                        </div>
                      )}
                      {job.diluentGround && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Ground</p>
                          <p className="text-sm">{job.diluentGround}</p>
                        </div>
                      )}
                      {job.diluentChemigation && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Chemigation</p>
                          <p className="text-sm">{job.diluentChemigation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generic Conditions */}
        {job.genericConditions && (
          <Card>
            <CardHeader>
              <CardTitle>Generic Conditions & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{job.genericConditions}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Status History</DialogTitle>
            <DialogDescription>
              View all status changes for this job
            </DialogDescription>
          </DialogHeader>
          <StatusHistory jobId={job.id} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

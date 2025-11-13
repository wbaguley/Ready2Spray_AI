import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BulkEditJobsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BulkEditJobs({ open, onOpenChange, onSuccess }: BulkEditJobsProps) {
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [statusId, setStatusId] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [assignedPersonnelId, setAssignedPersonnelId] = useState<string>("");

  const { data: jobs, isLoading: jobsLoading } = trpc.jobs.list.useQuery();
  const { data: statuses } = trpc.jobStatuses.list.useQuery();
  const { data: personnel } = trpc.personnel.list.useQuery();
  const bulkUpdateMutation = trpc.jobs.bulkUpdate.useMutation();

  const handleSelectAll = (checked: boolean) => {
    if (checked && jobs) {
      setSelectedJobIds(jobs.map((job) => job.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleSelectJob = (jobId: number, checked: boolean) => {
    if (checked) {
      setSelectedJobIds((prev) => [...prev, jobId]);
    } else {
      setSelectedJobIds((prev) => prev.filter((id) => id !== jobId));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedJobIds.length === 0) {
      toast.error("Please select at least one job");
      return;
    }

    if (!statusId && !priority && !assignedPersonnelId) {
      toast.error("Please select at least one field to update");
      return;
    }

    const updates: any = {};
    if (statusId) updates.statusId = parseInt(statusId);
    if (priority) updates.priority = priority;
    if (assignedPersonnelId) updates.assignedPersonnelId = parseInt(assignedPersonnelId);

    try {
      const result = await bulkUpdateMutation.mutateAsync({
        jobIds: selectedJobIds,
        updates,
      });

      if (result.success) {
        toast.success(`Successfully updated ${result.successCount} job(s)`);
        setSelectedJobIds([]);
        setStatusId("");
        setPriority("");
        setAssignedPersonnelId("");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(`Updated ${result.successCount} job(s), ${result.errorCount} failed`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update jobs");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Jobs</DialogTitle>
          <DialogDescription>
            Select jobs and update common fields for all selected jobs at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Update Fields */}
          <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="bulk-status">Status</Label>
              <Select value={statusId} onValueChange={setStatusId}>
                <SelectTrigger id="bulk-status">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  {statuses?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bulk-priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="bulk-priority">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bulk-personnel">Assigned Personnel</Label>
              <Select value={assignedPersonnelId} onValueChange={setAssignedPersonnelId}>
                <SelectTrigger id="bulk-personnel">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  {personnel?.map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Jobs Table */}
          {jobsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={jobs && selectedJobIds.length === jobs.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Personnel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedJobIds.includes(job.id)}
                            onCheckedChange={(checked) =>
                              handleSelectJob(job.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: job.statusColor
                                ? `${job.statusColor}20`
                                : "#FEF3C7",
                              color: job.statusColor || "#92400E",
                            }}
                          >
                            {job.statusName || "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-medium capitalize">
                            {job.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {job.customerName || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {job.personnelName || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            {selectedJobIds.length} job(s) selected
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkUpdate}
            disabled={bulkUpdateMutation.isPending || selectedJobIds.length === 0}
          >
            {bulkUpdateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update {selectedJobIds.length} Job(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

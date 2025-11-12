import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Jobs() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    jobType: "crop_dusting" as const,
    status: "pending" as const,
    priority: "medium" as const,
    locationAddress: "",
  });

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.jobs.create.useMutation({
    onSuccess: () => {
      utils.jobs.list.invalidate();
      toast.success("Job created successfully!");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        jobType: "crop_dusting",
        status: "pending",
        priority: "medium",
        locationAddress: "",
      });
    },
    onError: (error) => {
      toast.error(`Failed to create job: ${error.message}`);
    },
  });

  const deleteMutation = trpc.jobs.delete.useMutation({
    onSuccess: () => {
      utils.jobs.list.invalidate();
      toast.success("Job deleted successfully!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "low":
        return "text-gray-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage your agricultural spray jobs
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogDescription>
                  Add a new spray job to your schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, jobType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop_dusting">Crop Dusting</SelectItem>
                      <SelectItem value="pest_control">Pest Control</SelectItem>
                      <SelectItem value="fertilization">Fertilization</SelectItem>
                      <SelectItem value="herbicide">Herbicide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.locationAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, locationAddress: e.target.value })
                    }
                    placeholder="Field address or coordinates"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {job.jobType.replace("_", " ")}
                    </CardDescription>
                  </div>
                  <span
                    className={`text-xs font-medium ${getPriorityColor(job.priority)}`}
                  >
                    {job.priority.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}
                  >
                    {job.status.replace("_", " ")}
                  </span>
                </div>
                {job.locationAddress && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {job.locationAddress}
                  </p>
                )}
                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.info("Edit functionality coming soon")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: job.id })}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No jobs yet. Create your first job to get started!
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Personnel() {
  const { data: personnel, isLoading } = trpc.personnel.list.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel</h1>
          <p className="text-muted-foreground">
            Manage your team members
          </p>
        </div>
        <Button onClick={() => toast.info("Add personnel functionality coming soon")}>
          <Plus className="mr-2 h-4 w-4" />
          New Personnel
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : personnel && personnel.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personnel.map((person) => (
            <Card key={person.id}>
              <CardHeader>
                <CardTitle className="text-lg">{person.name}</CardTitle>
                <CardDescription>{person.role.replace("_", " ")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      person.status === "active"
                        ? "bg-green-100 text-green-800"
                        : person.status === "on_leave"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {person.status.replace("_", " ")}
                  </span>
                </div>
                {person.email && (
                  <p className="text-sm text-muted-foreground">{person.email}</p>
                )}
                {person.phone && (
                  <p className="text-sm text-muted-foreground">{person.phone}</p>
                )}
                {person.certifications && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Certifications: {person.certifications}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No personnel yet. Add your first team member to get started!
            </p>
            <Button onClick={() => toast.info("Add personnel functionality coming soon")}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Personnel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

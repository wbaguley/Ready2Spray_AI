import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Shield, UserCog } from "lucide-react";
import { toast } from "sonner";

type UserRole = "admin" | "manager" | "technician" | "pilot" | "sales";

const roleDescriptions: Record<UserRole, string> = {
  admin: "Full system access - cannot be modified",
  manager: "Manage jobs, customers, personnel, and reports",
  technician: "View and update job details, equipment maintenance",
  pilot: "View assigned jobs, update job status, log flight hours",
  sales: "Manage customers, create quotes, view reports",
};

export default function UserManagement() {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.users.list.useQuery();

  const updateRoleMutation = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    updateRoleMutation.mutate({ userId, userRole: newRole });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Assign roles to control access levels. Admin role cannot be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Role Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
                const currentRole = (user.userRole || "sales") as UserRole;
                const isAdmin = user.role === "admin";

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {currentRole}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {roleDescriptions[currentRole]}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin ? (
                        <span className="text-xs text-muted-foreground">
                          Protected
                        </span>
                      ) : (
                        <Select
                          value={currentRole}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value as UserRole)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="technician">Technician</SelectItem>
                            <SelectItem value="pilot">Pilot</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {(!users || users.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              No users found in your organization
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Overview of what each role can access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
            <div key={role} className="flex items-start gap-3 p-3 rounded-lg border">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold capitalize">{role}</h3>
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[role]}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

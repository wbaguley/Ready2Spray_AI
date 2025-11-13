import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";

const USER_ROLES = [
  {
    value: "admin",
    label: "Admin",
    description: "Full system access and user management",
  },
  {
    value: "manager",
    label: "Manager",
    description: "Manage jobs, personnel, and view reports",
  },
  {
    value: "technician",
    label: "Technician",
    description: "View and update job status, manage equipment",
  },
  {
    value: "pilot",
    label: "Pilot",
    description: "View flight board and update job status",
  },
  {
    value: "sales",
    label: "Sales",
    description: "Manage customers and create quotes",
  },
];

export default function UserManagement() {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.users.list.useQuery();
  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated successfully");
      utils.users.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole.mutate({
      userId,
      userRole: newRole as "admin" | "manager" | "technician" | "pilot" | "sales",
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-8 w-8" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Roles & Permissions
            </CardTitle>
            <CardDescription>
              Assign roles to control what users can access and manage in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                      <TableCell>{user.email || "No email"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.userRole || "No role assigned"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.userRole || undefined}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={updateRole.isPending}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Assign role" />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Descriptions</CardTitle>
            <CardDescription>Understanding each role's permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {USER_ROLES.map((role) => (
                <div key={role.value} className="flex gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

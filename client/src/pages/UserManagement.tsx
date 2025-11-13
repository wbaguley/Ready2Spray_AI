import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserPlus, Edit, Shield, Mail, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type SystemRole = "admin" | "manager" | "technician" | "sales" | "ops" | "viewer";
type PersonnelRole = "pilot" | "ground_crew" | "manager" | "technician";

const roleDescriptions: Record<SystemRole, string> = {
  admin: "Full access to all features and settings",
  manager: "Manage jobs, customers, personnel, and view reports",
  technician: "View and update jobs, access equipment information",
  sales: "Manage customers, create jobs, view reports",
  ops: "Manage jobs, equipment, and personnel operations",
  viewer: "Read-only access to jobs and customers",
};

const roleColors: Record<SystemRole, string> = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  technician: "bg-green-500",
  sales: "bg-purple-500",
  ops: "bg-orange-500",
  viewer: "bg-gray-500",
};

export default function UserManagement() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPersonnelDialog, setShowPersonnelDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<any>(null);
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    systemRole: "viewer" as SystemRole,
  });
  const [personnelFormData, setPersonnelFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "technician" as PersonnelRole,
    status: "active" as "active" | "on_leave" | "inactive",
    certifications: "",
    notes: "",
  });

  const { data: users, isLoading: usersLoading } = trpc.users.list.useQuery();
  const { data: personnel, isLoading: personnelLoading } = trpc.personnel.list.useQuery();
  const utils = trpc.useUtils();

  const updateRoleMutation = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      toast.success("User role updated successfully!");
      setShowEditDialog(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const createPersonnelMutation = trpc.personnel.create.useMutation({
    onSuccess: () => {
      utils.personnel.list.invalidate();
      setShowPersonnelDialog(false);
      resetPersonnelForm();
      toast.success("Personnel added successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to add personnel: ${error.message}`);
    },
  });

  const updatePersonnelMutation = trpc.personnel.update.useMutation({
    onSuccess: () => {
      utils.personnel.list.invalidate();
      setShowPersonnelDialog(false);
      resetPersonnelForm();
      toast.success("Personnel updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update personnel: ${error.message}`);
    },
  });

  const deletePersonnelMutation = trpc.personnel.delete.useMutation({
    onSuccess: () => {
      utils.personnel.list.invalidate();
      toast.success("Personnel deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete personnel: ${error.message}`);
    },
  });

  const resetPersonnelForm = () => {
    setPersonnelFormData({
      name: "",
      email: "",
      phone: "",
      role: "technician",
      status: "active",
      certifications: "",
      notes: "",
    });
    setEditingPersonnel(null);
  };

  const handleEditRole = (user: any) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    updateRoleMutation.mutate({
      userId: selectedUser.id,
      systemRole: selectedUser.systemRole,
    });
  };

  const handleOpenPersonnelDialog = (person?: any) => {
    if (person) {
      setEditingPersonnel(person);
      setPersonnelFormData({
        name: person.name || "",
        email: person.email || "",
        phone: person.phone || "",
        role: person.role || "technician",
        status: person.status || "active",
        certifications: person.certifications || "",
        notes: person.notes || "",
      });
    } else {
      resetPersonnelForm();
    }
    setShowPersonnelDialog(true);
  };

  const handlePersonnelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPersonnel) {
      const { certifications, ...rest } = personnelFormData;
      updatePersonnelMutation.mutate({ id: editingPersonnel.id, ...rest, pilotLicense: certifications });
    } else {
      // Map certifications to pilotLicense for backend compatibility
      const { certifications, ...rest } = personnelFormData;
      createPersonnelMutation.mutate({ ...rest, pilotLicense: certifications });
    }
  };

  if (usersLoading || personnelLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage team members, roles, and personnel profiles
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">
            <Shield className="h-4 w-4 mr-2" />
            User Accounts & Roles
          </TabsTrigger>
          <TabsTrigger value="personnel">
            <UsersIcon className="h-4 w-4 mr-2" />
            Personnel Profiles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>
                    Manage user access and system permissions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>System Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "—"}</TableCell>
                      <TableCell>{user.email || "—"}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.systemRole as SystemRole] || roleColors.viewer}>
                          {(user.systemRole || "viewer").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Active</Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastSignedIn
                          ? new Date(user.lastSignedIn).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRole(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Role Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Understanding access levels for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(roleDescriptions).map(([role, description]) => (
                  <div key={role} className="flex items-start gap-3">
                    <Badge className={roleColors[role as SystemRole]}>
                      {role.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personnel Profiles</CardTitle>
                  <CardDescription>
                    Manage team member details, certifications, and operational roles
                  </CardDescription>
                </div>
                <Button onClick={() => handleOpenPersonnelDialog()}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Personnel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personnel?.map((person: any) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.email || "—"}</TableCell>
                      <TableCell>{person.phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{person.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={person.status === "active" ? "default" : "secondary"}
                        >
                          {person.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {person.certifications || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenPersonnelDialog(person)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this personnel record?")) {
                                deletePersonnelMutation.mutate({ id: person.id });
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={inviteData.name}
                onChange={(e) =>
                  setInviteData({ ...inviteData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={inviteData.systemRole}
                onValueChange={(value) =>
                  setInviteData({ ...inviteData, systemRole: value as SystemRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {roleDescriptions[inviteData.systemRole]}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => toast.info("Invite feature coming soon!")}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the access level for {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editRole">Role</Label>
              <Select
                value={selectedUser?.systemRole || "viewer"}
                onValueChange={(value) =>
                  setSelectedUser({ ...selectedUser, systemRole: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {roleDescriptions[selectedUser?.systemRole as SystemRole || "viewer"]}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Personnel Dialog */}
      <Dialog open={showPersonnelDialog} onOpenChange={setShowPersonnelDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPersonnel ? "Edit Personnel" : "Add Personnel"}</DialogTitle>
            <DialogDescription>
              {editingPersonnel ? "Update personnel information" : "Add a new team member to your personnel roster"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePersonnelSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="personnelName">Name *</Label>
                  <Input
                    id="personnelName"
                    value={personnelFormData.name}
                    onChange={(e) =>
                      setPersonnelFormData({ ...personnelFormData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="personnelEmail">Email</Label>
                  <Input
                    id="personnelEmail"
                    type="email"
                    value={personnelFormData.email}
                    onChange={(e) =>
                      setPersonnelFormData({ ...personnelFormData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="personnelPhone">Phone</Label>
                  <Input
                    id="personnelPhone"
                    value={personnelFormData.phone}
                    onChange={(e) =>
                      setPersonnelFormData({ ...personnelFormData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="personnelRole">Operational Role *</Label>
                  <Select
                    value={personnelFormData.role}
                    onValueChange={(value) =>
                      setPersonnelFormData({ ...personnelFormData, role: value as PersonnelRole })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pilot">Pilot</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="ground_crew">Ground Crew</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personnelStatus">Status</Label>
                <Select
                  value={personnelFormData.status}
                  onValueChange={(value) =>
                    setPersonnelFormData({ ...personnelFormData, status: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personnelCertifications">Certifications</Label>
                <Input
                  id="personnelCertifications"
                  placeholder="e.g., Commercial Pilot License, Pesticide Applicator License"
                  value={personnelFormData.certifications}
                  onChange={(e) =>
                    setPersonnelFormData({ ...personnelFormData, certifications: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personnelNotes">Notes</Label>
                <Input
                  id="personnelNotes"
                  placeholder="Additional information"
                  value={personnelFormData.notes}
                  onChange={(e) =>
                    setPersonnelFormData({ ...personnelFormData, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPersonnelDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPersonnelMutation.isPending || updatePersonnelMutation.isPending}
              >
                {(createPersonnelMutation.isPending || updatePersonnelMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingPersonnel ? "Update Personnel" : "Add Personnel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

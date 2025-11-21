import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Mail, RefreshCw, X, Users, Clock } from "lucide-react";

export default function TeamManagement() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "member" | "viewer">("member");

  const utils = trpc.useUtils();

  // Queries
  const { data: invitations = [], isLoading: loadingInvitations } =
    trpc.team.getInvitations.useQuery();
  const { data: members = [], isLoading: loadingMembers } =
    trpc.team.getMembers.useQuery();

  // Mutations
  const inviteMember = trpc.team.inviteMember.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      setEmail("");
      setName("");
      setRole("member");
      utils.team.getInvitations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resendInvitation = trpc.team.resendInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation resent!");
      utils.team.getInvitations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const revokeInvitation = trpc.team.revokeInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation revoked");
      utils.team.getInvitations.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    inviteMember.mutate({ email, name, role });
  };

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending" && new Date(inv.expiresAt) > new Date()
  );

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-muted-foreground mt-2">
          Invite team members and manage access to your organization
        </p>
      </div>

      {/* Invite Member Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an invitation email to add a new member to your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                <strong>Admin:</strong> Can manage team and settings •{" "}
                <strong>Member:</strong> Can create and edit content •{" "}
                <strong>Viewer:</strong> Read-only access
              </p>
            </div>
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Invitations ({pendingInvitations.length})
          </CardTitle>
          <CardDescription>
            Invitations that haven't been accepted yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInvitations ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : pendingInvitations.length === 0 ? (
            <p className="text-muted-foreground">No pending invitations</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{invitation.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          resendInvitation.mutate({
                            invitationId: invitation.id,
                          })
                        }
                        disabled={resendInvitation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          revokeInvitation.mutate({
                            invitationId: invitation.id,
                          })
                        }
                        disabled={revokeInvitation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({members.length})
          </CardTitle>
          <CardDescription>
            Current members of your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingMembers ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-muted-foreground">No team members yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.user?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {member.user?.email || "No email"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "owner"
                            ? "default"
                            : member.role === "admin"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

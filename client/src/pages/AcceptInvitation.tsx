import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Users } from "lucide-react";

export default function AcceptInvitation() {
  const [, params] = useRoute("/invite/:token");
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const token = params?.token || "";

  // Get invitation details
  const {
    data: invitationData,
    isLoading: loadingInvitation,
    error: invitationError,
  } = trpc.team.getInvitationByToken.useQuery(
    { token },
    { enabled: !!token && !!user }
  );

  // Accept invitation mutation
  const acceptInvitation = trpc.team.acceptInvitation.useMutation({
    onSuccess: () => {
      // Redirect to dashboard after accepting
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    },
  });

  // Auto-accept if user is logged in and invitation is valid
  useEffect(() => {
    if (
      user &&
      invitationData &&
      !acceptInvitation.isSuccess &&
      !acceptInvitation.isPending
    ) {
      acceptInvitation.mutate({ token });
    }
  }, [user, invitationData, token]);

  // Loading state
  if (authLoading || loadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (invitationError || !invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
            <CardDescription>
              {invitationError?.message ||
                "This invitation link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>You're Invited!</CardTitle>
            </div>
            <CardDescription>
              You've been invited to join{" "}
              <strong>{invitationData.organization?.name}</strong> on Ready2Spray
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Organization:</strong>{" "}
                {invitationData.organization?.name}
              </p>
              <p className="text-sm">
                <strong>Role:</strong> {invitationData.invitation.role}
              </p>
              <p className="text-sm">
                <strong>Invited to:</strong> {invitationData.invitation.email}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please sign in with <strong>{invitationData.invitation.email}</strong> to
              accept this invitation.
            </p>
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="w-full"
            >
              Sign In to Accept
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accepting invitation
  if (acceptInvitation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Accepting invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (acceptInvitation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle>Welcome to the Team!</CardTitle>
            </div>
            <CardDescription>
              You've successfully joined{" "}
              <strong>{invitationData.organization?.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to dashboard...
            </p>
            <Button onClick={() => setLocation("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error accepting
  if (acceptInvitation.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Accepting Invitation</CardTitle>
            </div>
            <CardDescription>{acceptInvitation.error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

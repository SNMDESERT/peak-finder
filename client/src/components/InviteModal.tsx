import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserPlus, Copy, Check, Mail, Link } from "lucide-react";
import type { Trip, TripInvitation } from "@shared/schema";

interface InviteModalProps {
  trip: Trip;
  trigger?: React.ReactNode;
}

export function InviteModal({ trip, trigger }: InviteModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const createInvitationMutation = useMutation({
    mutationFn: async (inviteeEmail?: string) => {
      const response = await apiRequest("POST", "/api/invitations", {
        tripId: trip.id,
        inviteeEmail: inviteeEmail || null,
      });
      return response.json() as Promise<TripInvitation>;
    },
    onSuccess: (invitation) => {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/invite/${invitation.inviteCode}`;
      setInviteLink(link);
      toast({
        title: t("inviteModal.toast.createdTitle", "Invitation created"),
        description: t("inviteModal.toast.createdDescription", "Share the link with your friends to invite them to this trip"),
      });
    },
    onError: () => {
      toast({
        title: t("inviteModal.toast.failedTitle", "Failed to create invitation"),
        description: t("inviteModal.toast.failedDescription", "Please try again later"),
        variant: "destructive",
      });
    },
  });

  const handleCreateLink = () => {
    createInvitationMutation.mutate(email || undefined);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: t("inviteModal.toast.copiedTitle", "Link copied"),
        description: t("inviteModal.toast.copiedDescription", "Invite link has been copied to clipboard"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: t("inviteModal.toast.copyFailedTitle", "Failed to copy"),
        description: t("inviteModal.toast.copyFailedDescription", "Could not copy link to clipboard"),
        variant: "destructive",
      });
    }
  };

  const sendViaEmail = () => {
    const subject = encodeURIComponent(t("inviteModal.email.subject", "Join me on a trip: {{tripTitle}}", { tripTitle: trip.title }));
    const body = encodeURIComponent(
      t("inviteModal.email.body", 
        `Hey! I'd love for you to join me on this amazing mountain adventure:\n\n{{tripTitle}}\n{{tripLocation}}\n\nClick here to view the trip and join: {{inviteLink}}\n\nSee you on the trail!`,
        { tripTitle: trip.title, tripLocation: trip.location, inviteLink: inviteLink }
      )
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setInviteLink("");
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => (isOpen ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" data-testid="button-invite-friends">
            <UserPlus className="h-4 w-4 mr-1" />
            {t("inviteModal.inviteFriends", "Invite Friends")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("inviteModal.title", "Invite Friends to Trip")}</DialogTitle>
          <DialogDescription>
            {t("inviteModal.description", 'Create an invite link to share with friends for "{{tripTitle}}"', { tripTitle: trip.title })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!inviteLink ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">{t("inviteModal.emailLabel", "Friend's Email (optional)")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-invite-email"
                />
                <p className="text-sm text-muted-foreground">
                  {t("inviteModal.emailHint", "Leave empty to create a general invite link")}
                </p>
              </div>
              <Button
                onClick={handleCreateLink}
                className="w-full"
                disabled={createInvitationMutation.isPending}
                data-testid="button-create-invite"
              >
                {createInvitationMutation.isPending ? (
                  t("inviteModal.creating", "Creating...")
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    {t("inviteModal.generateLink", "Generate Invite Link")}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>{t("inviteModal.inviteLink", "Invite Link")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="flex-1 text-sm"
                    data-testid="input-invite-link"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    data-testid="button-copy-invite-link"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("inviteModal.linkExpiry", "This link expires in 7 days")}
                </p>
              </div>

              <div className="flex gap-2">
                {email && (
                  <Button
                    variant="secondary"
                    onClick={sendViaEmail}
                    className="flex-1"
                    data-testid="button-send-email-invite"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {t("inviteModal.sendViaEmail", "Send via Email")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setInviteLink("");
                    setEmail("");
                  }}
                  className={email ? "" : "w-full"}
                  data-testid="button-create-new-invite"
                >
                  {t("inviteModal.createNewLink", "Create New Link")}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, Link, Mail } from "lucide-react";
import { SiFacebook, SiX } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  type: "achievement" | "trip" | "review";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ShareButton({
  title,
  description,
  url,
  type,
  variant = "outline",
  size = "sm",
}: ShareButtonProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = url || window.location.href;
  const shareText = description
    ? `${title} - ${description}`
    : title;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this ${type}: ${title}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Share failed",
            description: "Could not share content",
            variant: "destructive",
          });
        }
      }
    } else {
      setShowLinkDialog(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            data-testid={`button-share-${type}`}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={copyToClipboard}
            data-testid="button-share-copy-link"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={shareToTwitter}
            data-testid="button-share-twitter"
          >
            <SiX className="h-4 w-4 mr-2" />
            Share on X
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={shareToFacebook}
            data-testid="button-share-facebook"
          >
            <SiFacebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={shareViaEmail}
            data-testid="button-share-email"
          >
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <DropdownMenuItem
              onClick={handleNativeShare}
              data-testid="button-share-native"
            >
              <Link className="h-4 w-4 mr-2" />
              More Options
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
            <DialogDescription>
              Copy this link to share with others
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
              data-testid="input-share-url"
            />
            <Button
              onClick={copyToClipboard}
              data-testid="button-dialog-copy-link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

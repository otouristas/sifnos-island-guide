import { Facebook, Twitter, Linkedin, Mail, Link2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SocialSharingProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialSharing({ title, url, description }: SocialSharingProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const shareText = description || title;

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(shareText);

    const shareLinks: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 border-t border-b border-gray-200 my-8">
      <span className="text-sm font-semibold text-gray-700">Share this article:</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="hover:bg-blue-50 hover:border-blue-300"
          aria-label="Share on Facebook"
        >
          <Facebook size={16} className="text-blue-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="hover:bg-blue-50 hover:border-blue-300"
          aria-label="Share on Twitter"
        >
          <Twitter size={16} className="text-blue-400" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin')}
          className="hover:bg-blue-50 hover:border-blue-300"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={16} className="text-blue-700" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('email')}
          className="hover:bg-gray-50"
          aria-label="Share via Email"
        >
          <Mail size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="hover:bg-gray-50"
          aria-label="Copy link"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
        </Button>
      </div>
    </div>
  );
}


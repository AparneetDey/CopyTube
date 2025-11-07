import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function Share({ type, title, url, description }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Check this out!",
          text: description || "",
          url: url,
        });
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    } else {
      // fallback: copy link
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      <span className="text-sm font-medium">{copied ? "Copied!" : "Share"}</span>
    </div>
  );
}

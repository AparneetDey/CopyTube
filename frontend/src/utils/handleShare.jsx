export const handleShare = async (video) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: window.location.href, // current page URL
      })
      console.log("Video shared successfully!")
    } catch (err) {
      console.error("Error sharing:", err)
    }
  } else {
    // fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }
}

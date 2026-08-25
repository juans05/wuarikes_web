export function getShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    // Instagram no soporta un share-intent web directo: se copia el enlace.
    instagram: null,
  };
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function canUseNativeShare() {
  return typeof navigator !== "undefined" && "share" in navigator;
}

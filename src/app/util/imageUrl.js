export function getImageUrl(path) {
  if (!path) return '/logo.png';
  // If path is already an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  
  // Remove any leading slashes from the path
  const cleanPath = path.replace(/^\/+/, '');
  
  // Remove any trailing slashes from the base URL
  const configuredBaseUrl = process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL || '';
  const baseUrl = configuredBaseUrl.replace(/\/+$/, '');
  
  // Combine them with a single slash
  if (!baseUrl) {
    return `/${cleanPath}`;
  }
  return `${baseUrl}/${cleanPath}`;
}

// Use this for Next.js Image component props
export function getImageProps(path, alt = 'Image', sizes = {}) {
  return {
    src: getImageUrl(path),
    alt,
    onError: ({ currentTarget }) => {
      if (!currentTarget) return;
      currentTarget.onerror = null;
      currentTarget.src = '/logo.png';
    },
    priority: false,
    ...sizes
  };
}
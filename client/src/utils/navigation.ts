export const getSafeInternalRedirect = (
  redirect: string | null,
  fallback = '/home'
) => {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return fallback;
  }

  return redirect;
};

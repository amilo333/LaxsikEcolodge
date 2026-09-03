const CLOUDINARY_HOST = 'https://res.cloudinary.com/';
const CLOUDINARY_UPLOAD_PATH = '/image/upload/';
const LOW_RES_UPSCALE_TRANSFORMATION =
  'if_iw_lt_1000/e_upscale/if_end/q_auto:best,f_auto/';

export function getUpscaledCloudinaryImageUrl(source: string) {
  if (
    !source.startsWith(CLOUDINARY_HOST) ||
    !source.includes(CLOUDINARY_UPLOAD_PATH) ||
    source.includes('/e_upscale/')
  ) {
    return source;
  }

  return source.replace(
    CLOUDINARY_UPLOAD_PATH,
    `${CLOUDINARY_UPLOAD_PATH}${LOW_RES_UPSCALE_TRANSFORMATION}`
  );
}

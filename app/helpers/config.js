// Service endpoint configurations

window.SERVER_ADDRESS = 'https://api.cognitive.microsoft.com';
window.ENDPOINT_URL = `${
  window.SERVER_ADDRESS
}/inkrecognizer/v1.0-preview/recognize`;
window.SUBSCRIPTION_KEY = 'ascascs';

// Languages for user to try
window.LANGUAGE_TAGS_TO_TRY = [
  'en-US',
  'de-DE',
  'en-GB',
  'fr-FR',
  'hi-IN',
  'ja-JP',
  'ko-KR',
  'zh-CN',
];

// Window.devicePixelRatio could change, e.g., when user drags the window to a display with different pixel density,
// however, there is no callback or event available to detect the change.
// In this sample, we assume devicePixelRatio doesn't change.
window.PIXEL_RATIO = window.devicePixelRatio;
window.MILLIMETER_PER_INCH = 25.4;
window.PIXEL_PER_INCH = 96;
window.MILLIMETER_TO_PIXELS =
  window.PIXEL_PER_INCH / (window.MILLIMETER_PER_INCH * window.PIXEL_RATIO);
window.PIXEL_TO_MILLIMETERS =
  (window.MILLIMETER_PER_INCH * window.PIXEL_RATIO) / window.PIXEL_PER_INCH;

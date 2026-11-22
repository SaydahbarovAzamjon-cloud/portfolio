import { DeviceType } from './enums/analytics.enum';

/** Simple user-agent reading (no extra package). */
export interface DeviceInfo {
  type: DeviceType;
  browser: string;
  os: string;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|axios|node-fetch/i;

export const isBot = (userAgent?: string): boolean =>
  !userAgent || BOT_PATTERN.test(userAgent);

export const readDevice = (userAgent = ''): DeviceInfo => {
  const type = /iPad|Tablet/i.test(userAgent)
    ? DeviceType.TABLET
    : /Mobi|Android|iPhone/i.test(userAgent)
      ? DeviceType.MOBILE
      : userAgent
        ? DeviceType.DESKTOP
        : DeviceType.UNKNOWN;

  const browser = /Edg\//.test(userAgent)
    ? 'Edge'
    : /SamsungBrowser/.test(userAgent)
      ? 'Samsung Internet'
      : /Whale\//.test(userAgent)
        ? 'Whale'
        : /Chrome\//.test(userAgent)
          ? 'Chrome'
          : /Firefox\//.test(userAgent)
            ? 'Firefox'
            : /Safari\//.test(userAgent)
              ? 'Safari'
              : 'Other';

  const os = /Windows/.test(userAgent)
    ? 'Windows'
    : /iPhone|iPad|iOS/.test(userAgent)
      ? 'iOS'
      : /Mac OS/.test(userAgent)
        ? 'macOS'
        : /Android/.test(userAgent)
          ? 'Android'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : 'Other';

  return { type, browser, os };
};

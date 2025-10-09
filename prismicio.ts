import {
  createClient as baseCreateClient,
  type ClientConfig,
  type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Supported locales for the application
 * These should match the locales configured in your Prismic repository
 */
export const locales = [
  { code: 'en-au', name: 'Australia', flag: '🇦🇺' },
  { code: 'en-nz', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'zh-cn', name: '中国 (China)', flag: '🇨🇳' },
  { code: 'zh-tw', name: '台灣 (Taiwan)', flag: '🇹🇼' },
  { code: 'ja', name: '日本 (Japan)', flag: '🇯🇵' },
  { code: 'ko', name: '한국 (Korea)', flag: '🇰🇷' },
  { code: 'es', name: 'España (Spain)', flag: '🇪🇸' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'de', name: 'Deutschland (Germany)', flag: '🇩🇪' },
  { code: 'vi', name: 'Việt Nam (Vietnam)', flag: '🇻🇳' },
  { code: 'th', name: 'ประเทศไทย (Thailand)', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
] as const;

export type LocaleCode = typeof locales[number]['code'];

/**
 * Default locale - Australian English
 */
export const defaultLocale: LocaleCode = 'en-au';

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 * 
 * Uses :lang? to include locale in URL, but omit it for the master locale
 * 
 * - home: Homepage with optional locale prefix (e.g., /, /es, /zh-cn)
 * - page: Dynamic pages with optional locale (e.g., /about, /es/about)
 * - solution: Solution pages with optional locale (e.g., /solutions/freight, /es/solutions/freight)
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes: Route[] = [
  { type: "home", path: "/:lang?" },
  { type: "page", path: "/:lang?/:uid" },
  { type: "solution", path: "/:lang?/solutions/:uid" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};

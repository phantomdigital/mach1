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
  { code: 'en-us', name: 'English', flag: '🇦🇺' },
  { code: 'zh-cn', name: 'Chinese - 中国人', flag: '🇨🇳' },
  { code: 'hi-in', name: 'Hindi - हिंदी', flag: '🇮🇳' },
] as const;

export type LocaleCode = typeof locales[number]['code'];

/**
 * Default locale - English (United States)
 */
export const defaultLocale: LocaleCode = 'en-us';

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 * 
 * Uses :lang? to include locale in URL, but omit it for the master locale
 * 
 * - home: Homepage with optional locale prefix (e.g., /, /es, /zh-cn)
 * - page: Dynamic pages with optional locale (e.g., /about, /es/about)
 * - solution: Solution pages with optional locale (e.g., /solutions/freight, /es/solutions/freight)
 * - specialty: Specialty pages with optional locale (e.g., /specialties/dangerous-goods, /es/specialties/dangerous-goods)
 * - news: News article pages with optional locale (e.g., /news/article-slug, /es/news/article-slug)
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes: Route[] = [
  { type: "home", path: "/:lang?" },
  // Special case for careers-vacancies page to use /careers/vacancies
  { type: "page", uid: "careers-vacancies", path: "/:lang?/careers/vacancies" },
  // Special case for contact-thank-you page to use /contact/thank-you
  { type: "page", uid: "contact-thank-you", path: "/:lang?/contact/thank-you" },
  { type: "page", path: "/:lang?/:uid" },
  { type: "solution", path: "/:lang?/solutions/:uid" },
  { type: "specialty", path: "/:lang?/specialties/:uid" },
  { type: "news", path: "/:lang?/news/:uid" },
  { type: "job", path: "/:lang?/job/:uid" },
  { type: "author", path: "/:lang?/authors/:uid" },
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

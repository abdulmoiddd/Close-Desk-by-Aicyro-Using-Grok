import Head from "next/head";

const SITE_NAME = "CloseDesk";
const DEFAULT_TITLE =
  "CloseDesk by Aicyro — 24/7 AI Booking Desk for Field-Service Businesses";
const DEFAULT_DESCRIPTION =
  "CloseDesk turns field-service website visitors into booked jobs. 24/7 AI lead capture and booking for HVAC, plumbing, restoration, roofing & more.";
// Note: OG Description is slightly different per your instructions
const DEFAULT_OG_DESCRIPTION =
  "Turn field-service website visitors into booked jobs, 24/7. Done-for-you AI lead capture, qualification, and booking — tracked in Pulse.";
const DEFAULT_OG_IMAGE = "https://aicyro.pro/og-image.jpg";
const DEFAULT_FAVICON = "/icon.png";

function resolveUrl(path, siteUrl) {
  if (!path) return `${siteUrl}/`;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ogDescription = DEFAULT_OG_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  path = "",
  type = "website",
  noindex = false,
  siteName = SITE_NAME,
  favicon = DEFAULT_FAVICON,
}) {
  const siteUrl = "https://aicyro.pro";
  const pageUrl = resolveUrl(path, siteUrl);
  // Guarantee the image is always an absolute URL
  const imageUrl = ogImage.startsWith("http")
    ? ogImage
    : resolveUrl(ogImage, siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CloseDesk",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "24/7 AI booking desk for field-service businesses. Captures website leads, qualifies urgent service requests, and books jobs.",
    provider: {
      "@type": "Organization",
      name: "Aicyro",
      url: "https://aicyro.pro",
    },
  };

  return (
    <Head>
      {/* --- Viewport --- */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* --- Primary Meta Tags --- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={siteName} />

      {/* --- Favicons --- */}
      <link rel="icon" href={favicon} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* --- Canonical Link --- */}
      <link rel="canonical" href={pageUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* --- Open Graph --- */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* --- Twitter --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* --- JSON-LD Schema --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

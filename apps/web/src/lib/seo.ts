// apps/web/src/lib/seo.ts

export function buildMeta({
  title,
  description,
  url,
  image
}: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const siteName = "SisiMove — Africa-first ridesharing";

  return {
    title: title ? `${title} | SisiMove` : siteName,
    description:
      description ??
      "Book intercity and intra-city trips across Africa. Fast, safe, affordable.",

    metadataBase: new URL("https://sisimove.com"),

    openGraph: {
      title: title ? `${title} | SisiMove` : siteName,
      description:
        description ??
        "Book intercity and intra-city trips across Africa. Fast, safe, affordable.",
      url: url ?? "/",
      siteName,
      images: [
        {
          url: image ?? "/icons/icon-512.png",
          width: 1200,
          height: 630,
          alt: "SisiMove Preview"
        }
      ],
      type: "website"
    },

    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | SisiMove` : siteName,
      description:
        description ??
        "Book intercity and intra-city trips across Africa. Fast, safe, affordable.",
      images: [image ?? "/icons/icon-512.png"]
    }
  };
}

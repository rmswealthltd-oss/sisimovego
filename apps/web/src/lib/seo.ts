// apps/web/src/lib/seo.ts
export function buildMeta({ title, description, url, image }: { title?: string; description?: string; url?: string; image?: string }) {
  const site = "SisiMove — Africa-first ridesharing";
  return {
    title: title ? `${title} | SisiMove` : site,
    description: description ?? "Book intercity and intra-city trips across Africa. Fast, safe, affordable.",
    openGraph: {
      title: title ? `${title} | SisiMove` : site,
      description: description ?? "Book intercity and intra-city trips across Africa. Fast, safe, affordable.",
      url: url ?? typeof window !== "undefined" ? window.location.href : "",
      images: image ? [{ url: image }] : [{ url: "/icons/icon-512.png" }]
    }
  };
}

export const SEO_CONFIG = {
  title: "LazyLancer - AI-Powered Freelance Dashboard | Work Smarter, Not Harder",
  description: "Automate your freelance workflow with LazyLancer's AI tools. Generate proposals, manage clients, handle invoicing, and boost productivity. Start your free trial today!",
  keywords: [
    "freelance dashboard",
    "AI freelance tools",
    "proposal generator",
    "client management",
    "invoice automation",
    "freelancer productivity",
    "AI assistant",
    "freelance automation"
  ],
  author: "LazyLancer Team",
  url: "https://lazylancer.ai",
  image: "https://lazylancer.ai/og-image.png",
  type: "website"
};

export const generateMetaTags = () => {
  return {
    title: SEO_CONFIG.title,
    description: SEO_CONFIG.description,
    keywords: SEO_CONFIG.keywords.join(", "),
    author: SEO_CONFIG.author,
    "og:title": SEO_CONFIG.title,
    "og:description": SEO_CONFIG.description,
    "og:url": SEO_CONFIG.url,
    "og:image": SEO_CONFIG.image,
    "og:type": SEO_CONFIG.type,
    "twitter:card": "summary_large_image",
    "twitter:title": SEO_CONFIG.title,
    "twitter:description": SEO_CONFIG.description,
    "twitter:image": SEO_CONFIG.image
  };
};

export const generateStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LazyLancer",
    "applicationCategory": "BusinessApplication",
    "description": SEO_CONFIG.description,
    "url": SEO_CONFIG.url,
    "author": {
      "@type": "Organization",
      "name": "LazyLancer"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Plan",
        "price": "50",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "50",
          "priceCurrency": "USD",
          "unitText": "MONTH"
        }
      },
      {
        "@type": "Offer",
        "name": "VIP Plan",
        "price": "100",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "100",
          "priceCurrency": "USD",
          "unitText": "MONTH"
        }
      }
    ]
  };
};
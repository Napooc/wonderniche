// Global SEO configurations and structured data

export const generateTravelSEO = (locale: string = 'en') => {
  const baseUrl = 'https://wonderniche.com';
  
  return {
    title: "Premium Travel Gear & Accessories 2024 | WonderNiche - Worldwide Delivery",
    description: "Discover premium travel essentials, luggage, and accessories for modern explorers. Curated collection with worldwide shipping. Shop the best travel gear from top brands.",
    keywords: "travel gear, premium luggage, travel accessories, backpacks, travel essentials, digital nomad gear, worldwide shipping, travel products 2024",
    canonicalUrl: `${baseUrl}/${locale === 'en' ? '' : locale + '/'}travel`,
    alternateUrls: {
      'en': `${baseUrl}/travel`,
      'fr': `${baseUrl}/fr/travel`,
      'de': `${baseUrl}/de/travel`,
      'es': `${baseUrl}/es/travel`,
      'pt': `${baseUrl}/pt/travel`,
      'ja': `${baseUrl}/ja/travel`,
      'ko': `${baseUrl}/ko/travel`,
      'zh-CN': `${baseUrl}/zh-cn/travel`,
      'zh-TW': `${baseUrl}/zh-tw/travel`,
      'ru': `${baseUrl}/ru/travel`
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Premium Travel Gear & Accessories",
      "description": "Curated collection of premium travel gear and accessories for modern travelers",
      "url": `${baseUrl}/travel`,
      "publisher": {
        "@type": "Organization",
        "name": "WonderNiche",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": "500+",
        "itemListElement": [
          {
            "@type": "Product",
            "name": "Premium Travel Backpacks",
            "category": "Travel Gear"
          },
          {
            "@type": "Product", 
            "name": "Smart Luggage Collection",
            "category": "Travel Accessories"
          }
        ]
      }
    }
  };
};

export const generateBeautySEO = (locale: string = 'en') => {
  const baseUrl = 'https://wonderniche.com';
  
  return {
    title: "Premium Beauty Products & Skincare 2024 | WonderNiche - Global Beauty Hub",
    description: "Shop premium beauty products, skincare, and cosmetics from top international brands. Curated collection with worldwide shipping. Discover the latest beauty trends.",
    keywords: "premium beauty products, skincare, cosmetics, makeup, beauty tools, anti-aging, organic skincare, luxury beauty, worldwide shipping, beauty 2024",
    canonicalUrl: `${baseUrl}/${locale === 'en' ? '' : locale + '/'}beauty`,
    alternateUrls: {
      'en': `${baseUrl}/beauty`,
      'fr': `${baseUrl}/fr/beauty`,
      'de': `${baseUrl}/de/beauty`,
      'es': `${baseUrl}/es/beauty`,
      'pt': `${baseUrl}/pt/beauty`,
      'ja': `${baseUrl}/ja/beauty`,
      'ko': `${baseUrl}/ko/beauty`,
      'zh-CN': `${baseUrl}/zh-cn/beauty`,
      'zh-TW': `${baseUrl}/zh-tw/beauty`,
      'ru': `${baseUrl}/ru/beauty`
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Premium Beauty Products & Skincare",
      "description": "Curated collection of premium beauty products and skincare from top international brands",
      "url": `${baseUrl}/beauty`,
      "publisher": {
        "@type": "Organization",
        "name": "WonderNiche",
        "url": baseUrl
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": "800+",
        "itemListElement": [
          {
            "@type": "Product",
            "name": "Premium Skincare Products",
            "category": "Beauty & Personal Care"
          },
          {
            "@type": "Product",
            "name": "Luxury Makeup Collection", 
            "category": "Cosmetics"
          }
        ]
      }
    }
  };
};

export const generateWellnessSEO = (locale: string = 'en') => {
  const baseUrl = 'https://wonderniche.com';
  
  return {
    title: "Wellness & Fitness Products 2024 | WonderNiche - Global Wellness Store",
    description: "Transform your health with premium wellness and fitness products. Curated collection of supplements, fitness gear, and mindfulness tools. Worldwide delivery available.",
    keywords: "wellness products, fitness equipment, health supplements, mindfulness tools, yoga accessories, meditation, fitness gear, healthy lifestyle, wellness 2024",
    canonicalUrl: `${baseUrl}/${locale === 'en' ? '' : locale + '/'}wellness`,
    alternateUrls: {
      'en': `${baseUrl}/wellness`,
      'fr': `${baseUrl}/fr/wellness`,
      'de': `${baseUrl}/de/wellness`,
      'es': `${baseUrl}/es/wellness`,
      'pt': `${baseUrl}/pt/wellness`,
      'ja': `${baseUrl}/ja/wellness`,
      'ko': `${baseUrl}/ko/wellness`,
      'zh-CN': `${baseUrl}/zh-cn/wellness`,
      'zh-TW': `${baseUrl}/zh-tw/wellness`,
      'ru': `${baseUrl}/ru/wellness`
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Wellness & Fitness Products",
      "description": "Premium wellness and fitness products for a healthier lifestyle",
      "url": `${baseUrl}/wellness`,
      "publisher": {
        "@type": "Organization",
        "name": "WonderNiche",
        "url": baseUrl
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": "400+",
        "itemListElement": [
          {
            "@type": "Product",
            "name": "Fitness Equipment",
            "category": "Health & Fitness"
          },
          {
            "@type": "Product",
            "name": "Wellness Supplements",
            "category": "Health Supplements"
          }
        ]
      }
    }
  };
};

export const generateAdviceSEO = (locale: string = 'en') => {
  const baseUrl = 'https://wonderniche.com';
  
  return {
    title: "Expert Advice & Lifestyle Tips 2024 | WonderNiche - Global Knowledge Hub",
    description: "Get expert advice on lifestyle, productivity, wellness, and personal development. Curated insights from industry leaders worldwide. Transform your life today.",
    keywords: "expert advice, lifestyle tips, personal development, productivity, self-improvement, life coaching, success strategies, wisdom, advice 2024",
    canonicalUrl: `${baseUrl}/${locale === 'en' ? '' : locale + '/'}advice`,
    alternateUrls: {
      'en': `${baseUrl}/advice`,
      'fr': `${baseUrl}/fr/advice`,
      'de': `${baseUrl}/de/advice`,
      'es': `${baseUrl}/es/advice`,
      'pt': `${baseUrl}/pt/advice`,
      'ja': `${baseUrl}/ja/advice`,
      'ko': `${baseUrl}/ko/advice`,
      'zh-CN': `${baseUrl}/zh-cn/advice`,
      'zh-TW': `${baseUrl}/zh-tw/advice`,
      'ru': `${baseUrl}/ru/advice`
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Expert Advice & Lifestyle Tips",
      "description": "Curated collection of expert advice and insights for personal and professional growth",
      "url": `${baseUrl}/advice`,
      "publisher": {
        "@type": "Organization",
        "name": "WonderNiche",
        "url": baseUrl
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": "200+",
        "itemListElement": [
          {
            "@type": "Article",
            "name": "Personal Development Resources",
            "category": "Self-Improvement"
          },
          {
            "@type": "Article",
            "name": "Productivity and Success Tips",
            "category": "Professional Development"
          }
        ]
      }
    }
  };
};

export const generateHomeSEO = (locale: string = 'en') => {
  const baseUrl = 'https://wonderniche.com';
  
  return {
    title: "WonderNiche - Premium Lifestyle Products Worldwide | Travel, Beauty, Wellness & Advice",
    description: "Discover premium lifestyle products from around the world. Curated collection of travel gear, beauty products, wellness essentials, and expert advice. Global shipping available.",
    keywords: "premium lifestyle products, travel gear, beauty products, wellness, expert advice, curated marketplace, worldwide shipping, luxury lifestyle, modern living",
    canonicalUrl: `${baseUrl}/${locale === 'en' ? '' : locale}`,
    alternateUrls: {
      'en': baseUrl,
      'fr': `${baseUrl}/fr`,
      'de': `${baseUrl}/de`,
      'es': `${baseUrl}/es`,
      'pt': `${baseUrl}/pt`,
      'ja': `${baseUrl}/ja`,
      'ko': `${baseUrl}/ko`,
      'zh-CN': `${baseUrl}/zh-cn`,
      'zh-TW': `${baseUrl}/zh-tw`,
      'ru': `${baseUrl}/ru`
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WonderNiche",
      "description": "Premium lifestyle products marketplace with worldwide delivery",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "WonderNiche",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        },
        "sameAs": [
          "https://twitter.com/wonderniche",
          "https://facebook.com/wonderniche",
          "https://instagram.com/wonderniche"
        ]
      }
    }
  };
};
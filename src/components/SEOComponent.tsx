import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: object;
  locale?: string;
  alternateUrls?: { [key: string]: string };
}

const SEOComponent = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage = "https://wonderniche.com/og-image.jpg",
  structuredData,
  locale = "en",
  alternateUrls = {}
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="VibeWonder" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content={locale} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale.replace('-', '_')} />
      <meta property="og:site_name" content="VibeWonder" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@vibewonder" />
      <meta property="twitter:creator" content="@vibewonder" />

      {/* Alternate URLs for different languages */}
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#C4923A" />
      <meta name="msapplication-TileColor" content="#C4923A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="VibeWonder" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOComponent;
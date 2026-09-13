import { useEffect } from 'react';

const APP_NAME = 'Life RPG';
const BASE_URL = 'https://liferpg.app';
const DEFAULT_IMAGE = 'https://liferpg.app/home-bg.jpg';
const DEFAULT_DESC = 'Turn everyday goals into RPG quests. Complete tasks, earn XP, build streaks, and level up your life.';

/**
 * Dynamic SEO Head Manager for SPA
 * Updates document.title, canonical link, meta descriptions, Open Graph, Twitter Cards, and Schema.org
 */
export const SEOHead = ({
  title,
  description = DEFAULT_DESC,
  canonical = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  jsonLd = null,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = title ? `${title} — ${APP_NAME}` : `${APP_NAME} — Turn Your Real Life Into A Game`;
    document.title = fullTitle;

    // Helper to set or update meta tag by name or property
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'title', fullTitle);

    // 3. Canonical Link
    const cleanCanonical = canonical.startsWith('/') ? canonical : `/${canonical}`;
    const canonicalUrl = `${BASE_URL}${cleanCanonical === '/' ? '' : cleanCanonical}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Open Graph / Facebook Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', APP_NAME);
    setMetaTag('property', 'og:image', ogImage);

    // 5. Twitter / X Meta Tags
    setMetaTag('property', 'twitter:title', fullTitle);
    setMetaTag('property', 'twitter:description', description);
    setMetaTag('property', 'twitter:url', canonicalUrl);
    setMetaTag('property', 'twitter:card', 'summary_large_image');
    setMetaTag('property', 'twitter:image', ogImage);

    // 6. Optional Page-Specific Structured Data (Schema.org)
    let schemaScript = document.getElementById('page-jsonld-schema');
    if (jsonLd) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'page-jsonld-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(jsonLd);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup when unmounting or switching pages
    return () => {
      // Intentionally keep current tags until next page mounts to avoid flash
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);

  return null;
};

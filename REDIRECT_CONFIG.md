# Redirect Configuration Guide

This document explains how to configure 301 (Permanent) and 302 (Temporary) redirects for your Next.js website.

## Overview

This website includes:

- **Custom 404 Error Page** - Located at `src/pages/404.jsx`
- **Redirect Configuration** - Configured in `next.config.js`

## 404 Error Page

The custom 404 error page (`src/pages/404.jsx`) automatically displays when a user visits a non-existent page. It matches your website's dark purple theme and includes:

- Animated 404 display
- Navigation buttons to homepage and contact page
- Links to main sections (Services, Portfolio, About)
- Consistent styling with the rest of the website

## Setting Up Redirects

### Configuration Location

All redirects are configured in `next.config.js` in the `redirects()` function.

### 301 (Permanent) Redirects

301 redirects are used when you want to permanently move a page to a new location. Search engines will update their indexes to point to the new URL.

**Example:**

```javascript
{
  source: '/old-page',
  destination: '/new-page',
  permanent: true, // This creates a 301 redirect
}
```

### 302 (Temporary) Redirects

302 redirects are used when you want to temporarily redirect users. The original URL will remain in search engine indexes.

**Example:**

```javascript
{
  source: '/temporary-page',
  destination: '/services',
  permanent: false, // This creates a 302 redirect
}
```

### Common Redirect Patterns

1. **Redirect Old Blog Posts:**

```javascript
{
  source: '/blog/:slug',
  destination: '/articles/:slug',
  permanent: true,
}
```

2. **Redirect with Query Parameters:**

```javascript
{
  source: '/old-page/:path*',
  destination: '/new-page/:path*',
  permanent: true,
}
```

3. **Redirect External URLs:**

```javascript
{
  source: '/external-link',
  destination: 'https://example.com',
  permanent: false,
}
```

## How to Add Redirects

1. Open `next.config.js`
2. Find the `redirects()` function
3. Add your redirect objects to the array
4. Set `permanent: true` for 301 redirects
5. Set `permanent: false` for 302 redirects
6. Save the file and restart your development server

## Important Notes

- Redirects are processed in order - the first matching redirect will be used
- After changing redirects, restart your Next.js development server
- For production, rebuild and redeploy your application
- Use 301 redirects for permanent moves (better for SEO)
- Use 302 redirects for temporary redirects (promotions, A/B testing, etc.)

## Testing Redirects

1. Start your development server: `npm run dev`
2. Visit the old URL in your browser
3. You should be automatically redirected to the new URL
4. Check the browser's developer tools Network tab to verify the status code (301 or 302)

## Examples for Your Website

Here are some example redirects you might want to add:

```javascript
async redirects() {
  return [
    // Redirect old service pages
    {
      source: '/services-old',
      destination: '/services',
      permanent: true,
    },

    // Temporary redirect for promotions
    {
      source: '/promo',
      destination: '/services',
      permanent: false,
    },

    // Redirect with path parameters
    {
      source: '/project/:slug',
      destination: '/portfolio/:slug',
      permanent: true,
    },
  ];
}
```

## Additional Resources

- [Next.js Redirects Documentation](https://nextjs.org/docs/api-reference/next.config.js/redirects)
- [HTTP Status Codes Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

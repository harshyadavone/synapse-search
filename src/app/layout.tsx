import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/lib/Providers";
import Script from "next/script";
import Link from "next/link";
import ErrorBoundary from "@/components/shared/common/ErrorBoundary";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  title: "Synapse - Intelligent Web Search",
  description:
    "Synapse: Redefining web search with AI-powered intelligence. Find what you need faster, smarter, and with unparalleled accuracy. Experience the next evolution of internet exploration.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "synapse",
    "search engine",
    "AI search",
    "web search",
    "intelligent search",
    "nextjs",
    "pwa",
    "fast search",
    "accurate results",
    "personalized search",
  ],
  authors: [
    {
      name: "Harsh Yadav",
      url: "https://www.github.com/harshyadavone",
    },
  ],
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/android/android-launchericon-192-192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      url: "/android/android-launchericon-512-512.png",
    },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/ios/180.png" },
    {
      rel: "msapplication-icon",
      type: "image/png",
      sizes: "270x270",
      url: "/windows11/LargeTile.scale-100.png",
    },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Synapse Search",
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://synapse-search.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://synapse-search.vercel.app",
    title: "Synapse - Intelligent Web Search",
    description:
      "Synapse: Redefining web search with AI-powered intelligence. Find what you need faster, smarter, and with unparalleled accuracy.",
    images: [
      {
        url: "/screenshots/search-screen.png",
        width: 1200,
        height: 630,
        alt: "Synapse - AI-Powered Search Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synapse - Intelligent Web Search",
    description:
      "Experience the next evolution of internet exploration. Find what you need faster and smarter with Synapse's AI-powered search.",
    images: ["/screenshots/search-screen.png"],
    creator: "@harshyadavone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://www.faviconextractor.com/favicon/"
        />
        <meta
          name="google-site-verification"
          content="twhv-FtvhTmMu8DrAZbHTaCKsoXamB_xxt-KjZVGEFU"
        />
      </head>
      <body className={`${GeistSans.className} antialiased`}>
        <Link
          href="#main-content"
          className="skip-to-content sr-only focus:not-sr-only"
        >
          Skip to content
        </Link>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ErrorBoundary>
              <main id="main-content">{children}</main>
            </ErrorBoundary>
          </ThemeProvider>
        </Providers>
        <noscript>
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              background: "#0C0A09",
              color: "#0C0A09",
            }}
          >
            Synapse requires JavaScript to function properly. Please enable
            JavaScript to continue.
          </div>
        </noscript>
        <Script
          id="schema-script"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://synapse-search.vercel.app",
              name: "Synapse - Intelligent Web Search",
              description:
                "Synapse: Redefining web search with AI-powered intelligence.",
              author: {
                "@type": "Person",
                name: "Harsh Yadav",
                url: "https://www.github.com/harshyadavone",
              },
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://synapse-search.vercel.app/results?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}

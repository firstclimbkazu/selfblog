import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Still On The Wall",
    template: "%s — Still On The Wall",
  },
  description: "都市と自然を往復する、アラフィフの知的好奇心。",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "Still On The Wall",
    locale: "ja_JP",
    type: "website",
    url: SITE_URL,
    title: "Still On The Wall",
    description: "都市と自然を往復する、アラフィフの知的好奇心。",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Still On The Wall",
    description: "都市と自然を往復する、アラフィフの知的好奇心。",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager — placed in <head> for earliest possible firing */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MTT7QG3S');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MTT7QG3S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

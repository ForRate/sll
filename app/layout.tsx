import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GouniBot - Automatically book your desired hostel",

  description:
    "With GouniBot, you don't no longer have to wait in desperation. Simply register your portal and let our bot do the work of waiting, end efficiently carrying out the process",

  metadataBase: new URL("https://gounibot.site"),

  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  openGraph: {
    title: "GouniBot - Automatically book your desired hostel",
    description:
      "With GouniBot, you don't no longer have to wait in desperation. Simply register your portal and let our bot do the work of waiting, end efficiently carrying out the process",
    url: "https://gounibot.site",
    siteName: "GouniBot",
    images: [
      {
        url: "/gouniBot.png",
        width: 1200,
        height: 630,
        alt: "GouniBot Preview Image",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GouniBot - Automatically book your desired hostel",
    description:
      "With GouniBot, you don't no longer have to wait in desperation. Simply register your portal and let our bot do the work of waiting, end efficiently carrying out the process",
    images: ["/gouniBot.png"],
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TVBPKLZMKN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TVBPKLZMKN');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        {children}
        <footer className={"text-sm text-center text-gray-400"}>
          <p>
            Need help? Email us at <a>gounibot@outlook.com</a>
          </p>
        </footer>
      </body>
    </html>
  );
}

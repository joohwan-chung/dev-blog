import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { ServiceWorkerRegistrar } from "@/components/notifications/service-worker-registrar";
import { ThemeScript } from "@/lib/theme-script";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { generateSiteMetadata } from "@/lib/metadata";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return await generateSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <ThemeScript />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="RSS Feed" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                <ServiceWorkerRegistrar />
                <ConditionalLayout>
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 dark:border-slate-400 mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">페이지를 불러오는 중...</p>
                      </div>
                    </div>
                  }>
                    {children}
                  </Suspense>
                </ConditionalLayout>
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </body>
    </html>
  );
}

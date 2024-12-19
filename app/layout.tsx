import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";

export const metadata: Metadata = {
    title: 'soundfully',
    description: 'Your music.',
};
const inter = Inter({subsets: ['latin']});

export const viewport: Viewport = {
    userScalable: false,
};

export default function RootLayout({children}: { children: React.ReactNode }) {


    return (
        <html lang="en" className={inter.className}>
        <body className="dark h-[100dvh] text-gray-200 bg-[#0A0A0A]">{children}</body>
        </html>
    )
}

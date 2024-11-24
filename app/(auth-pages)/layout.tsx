import {Account} from "@/app/account";

import '../globals.css'
import React from "react";

export default async function Layout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="dark h-[100dvh] text-gray-200 bg-[#0A0A0A]">
        {children}
        </body>
        </html>
    );
}

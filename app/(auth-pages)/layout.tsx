import {Account} from "@/app/account";

import '../globals.css'
import React from "react";

export default async function Layout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <>{children}</>
    );
}

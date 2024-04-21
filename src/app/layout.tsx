import Header from '../components/navigation/Header'
import '../styles/global.css'

import {NextUIProvider} from "@nextui-org/react";
import React from "react";
import getUserFromSession from "../UserSessionHelper";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const user = getUserFromSession();
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>TIPPSPIEL_NEXT</title>
        </head>
        <body>
        <NextUIProvider>
            <Header user={user}/>
            <div style={{margin: 10,  display: "flex", justifyContent: "center",
                alignItems: "center"}}>{children}</div>
        </NextUIProvider>
        </body>
        </html>
    )
}

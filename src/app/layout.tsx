import Header from '../components/Header'
import '../styles/global.css'

import {NextUIProvider} from "@nextui-org/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body>
      <NextUIProvider>
        <Header/>
        <div style={{padding: "0 2rem"}}>{children}</div>
      </NextUIProvider>
      </body>
      </html>
  )
}

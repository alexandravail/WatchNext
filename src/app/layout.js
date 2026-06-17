// src/app/layout.js
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "WatchNext — Find Your Next Show",
  description: "AI-powered TV show recommendations based on your streaming services and taste.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, background: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}

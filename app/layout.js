import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "The Store",
  description: "The Store for absolutely everything!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${rubik.className}`}>{children}</body>
    </html>
  );
}

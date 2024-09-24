import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Artyom Sukiasyan (devchessplayer)",
  description: "Image gallery of Artyom Sukiasyan since 2023",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

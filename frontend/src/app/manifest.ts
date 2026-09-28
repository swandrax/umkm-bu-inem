import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jajanan Ibu Inem POS",
    short_name: "Ibu Inem POS",
    description: "Sistem Kasir & POS UMKM Modern Jajanan Ibu Inem",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#f59e0b",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/profile",
          "/my-bookings/",
          "/booking/confirmation",
          "/booking/success",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/auth/",
          "/profile",
          "/my-bookings/",
          "/booking/confirmation",
          "/booking/success",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.hotelreliance.com/sitemap.xml",
    host: "https://www.hotelreliance.com",
  };
}

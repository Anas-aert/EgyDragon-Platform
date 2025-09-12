/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://egydragon-anas.vercel.app",
  generateRobotsTxt: true, // يعمل robots.txt أوتوماتيك
  sitemapSize: 7000, // يقسم لو عندك آلاف الروابط
  changefreq: "weekly",
  priority: 0.7,
};

const mongoose = require('mongoose');

const navLinkSchema = new mongoose.Schema({
  label: String,
  href: String,
  dropdown: [{ label: String, href: String }],
});

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/' },
  bgColor: { type: String, default: '#1a1a2e' },
  textColor: { type: String, default: '#ffffff' },
});

const quickLinkSchema = new mongoose.Schema({
  label: String,
  href: String,
});

const siteSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
    },
    announcement: {
      type: String,
      default: 'ORDERS PLACED AFTER 21ST MAY WILL BE DELIVERED AFTER EID',
    },
    announcementVisible: {
      type: Boolean,
      default: true,
    },
    navbar: {
      logo: { type: String, default: 'ZEPHYR' },
      links: [navLinkSchema],
    },
    hero: {
      slides: [heroSlideSchema],
      autoplay: { type: Boolean, default: true },
      interval: { type: Number, default: 4000 },
    },
    newsletter: {
      heading: { type: String, default: 'Join our mailing list' },
      subheading: { type: String, default: 'for the latest product info & more' },
      buttonText: { type: String, default: 'Subscribe' },
      bgColor: { type: String, default: '#1a1a2e' },
      textColor: { type: String, default: '#ffffff' },
    },
    seo: {
      siteTitle:          { type: String, default: 'ZEPHYR | Premium Pakistani Menswear Fabrics' },
      titleTemplate:      { type: String, default: '%s | ZEPHYR' },
      description:        { type: String, default: 'Discover premium quality menswear fabrics — blended, cotton, winter, and seasonal collections from ZEPHYR Textiles, Lahore.' },
      keywords:           { type: String, default: 'menswear fabric, Pakistani fabric, blended fabric, cotton fabric, winter fabric, Zephyr Textiles, Lahore fabric' },
      ogTitle:            { type: String, default: 'ZEPHYR | Premium Pakistani Menswear Fabrics' },
      ogDescription:      { type: String, default: 'Shop the finest menswear fabrics in Pakistan. Blended, Cotton, Winter & Eid collections available.' },
      ogImage:            { type: String, default: '' },
      twitterCard:        { type: String, default: 'summary_large_image' },
      canonical:          { type: String, default: 'https://yourdomain.com' },
      robots:             { type: String, default: 'index, follow' },
      googleVerification: { type: String, default: '' },
    },
    footer: {
      companyName: { type: String, default: 'ZEPHYR Textiles Ltd.' },
      address: { type: String, default: 'Lahore, Pakistan' },
      phone: { type: String, default: '+92-300-0000000' },
      email: { type: String, default: 'info@zephyr.com.pk' },
      quickLinks: [quickLinkSchema],
      infoLinks: [quickLinkSchema],
      social: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
      },
      copyright: { type: String, default: '© 2024 ZEPHYR Textiles Ltd. All rights reserved.' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Site', siteSchema);

const Site = require('../models/Site');

const DEFAULT_SITE = {
  key: 'main',
  seo: {
    siteTitle: 'ZEPHYR | Premium Pakistani Menswear Fabrics',
    titleTemplate: '%s | ZEPHYR',
    description: 'Discover premium quality menswear fabrics — blended, cotton, winter, and seasonal collections from ZEPHYR Textiles, Lahore.',
    keywords: 'menswear fabric, Pakistani fabric, blended fabric, cotton fabric, winter fabric, Zephyr Textiles, Lahore fabric',
    ogTitle: 'ZEPHYR | Premium Pakistani Menswear Fabrics',
    ogDescription: 'Shop the finest menswear fabrics in Pakistan. Blended, Cotton, Winter & Eid collections available.',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonical: 'https://yourdomain.com',
    robots: 'index, follow',
    googleVerification: '',
  },
  announcement: 'ORDERS PLACED AFTER 21ST MAY WILL BE DELIVERED AFTER EID',
  announcementVisible: true,
  navbar: {
    logo: 'ZEPHYR',
    links: [
      { label: 'Home', href: '/' },
      {
        label: 'Collections', href: '/collections',
        dropdown: [
          { label: 'Blended', href: '/collections/blended' },
          { label: 'Cotton', href: '/collections/cotton' },
          { label: 'Dobby Design', href: '/collections/dobby' },
          { label: 'Winter', href: '/collections/winter' },
          { label: 'Kurta', href: '/collections/kurta' },
        ],
      },
      { label: 'Summer Collection', href: '/collections/summer' },
      { label: 'Eid Collection', href: '/collections/eid' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  hero: {
    slides: [
      { title: 'Summer Collection', subtitle: 'Lightweight fabrics for the season', buttonText: 'Shop Now', buttonLink: '/collections/summer', bgColor: '#1a1a2e', textColor: '#ffffff' },
      { title: 'Eid Collection', subtitle: 'Celebrate in style', buttonText: 'Explore', buttonLink: '/collections/eid', bgColor: '#16213e', textColor: '#ffffff' },
    ],
    autoplay: true,
    interval: 4000,
  },
  newsletter: {
    heading: 'Join our mailing list',
    subheading: 'for the latest product info & more',
    buttonText: 'Subscribe',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
  },
  footer: {
    companyName: 'ZEPHYR Textiles Ltd.',
    address: 'Lahore, Pakistan',
    phone: '+92-300-0000000',
    email: 'info@zephyr.com.pk',
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'Summer Collection', href: '/collections/summer' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    infoLinks: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund' },
    ],
    social: { facebook: 'https://facebook.com/zephyr', instagram: 'https://instagram.com/zephyr' },
    copyright: '© 2024 ZEPHYR Textiles Ltd. All rights reserved.',
  },
};

// Helper: get or create the single site document
const getSiteDoc = async () => {
  let site = await Site.findOne({ key: 'main' });
  if (!site) site = await Site.create(DEFAULT_SITE);
  return site;
};

// @desc    Get full site data
// @route   GET /api/site
const getSite = async (req, res) => {
  try {
    const site = await getSiteDoc();
    res.json({ success: true, data: site });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/site/announcement
const updateAnnouncement = async (req, res) => {
  try {
    const site = await getSiteDoc();
    if (req.body.announcement !== undefined) site.announcement = req.body.announcement;
    if (req.body.announcementVisible !== undefined) site.announcementVisible = req.body.announcementVisible;
    await site.save();
    res.json({ success: true, data: { announcement: site.announcement, announcementVisible: site.announcementVisible } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update hero
// @route   PUT /api/site/hero
const updateHero = async (req, res) => {
  try {
    const site = await getSiteDoc();
    if (req.body.slides !== undefined) site.hero.slides = req.body.slides;
    if (req.body.autoplay !== undefined) site.hero.autoplay = req.body.autoplay;
    if (req.body.interval !== undefined) site.hero.interval = req.body.interval;
    site.markModified('hero');
    await site.save();
    res.json({ success: true, data: site.hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update navbar
// @route   PUT /api/site/navbar
const updateNavbar = async (req, res) => {
  try {
    const site = await getSiteDoc();
    if (req.body.logo !== undefined) site.navbar.logo = req.body.logo;
    if (req.body.links !== undefined) site.navbar.links = req.body.links;
    site.markModified('navbar');
    await site.save();
    res.json({ success: true, data: site.navbar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update newsletter
// @route   PUT /api/site/newsletter
const updateNewsletter = async (req, res) => {
  try {
    const site = await getSiteDoc();
    Object.assign(site.newsletter, req.body);
    site.markModified('newsletter');
    await site.save();
    res.json({ success: true, data: site.newsletter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update footer
// @route   PUT /api/site/footer
const updateFooter = async (req, res) => {
  try {
    const site = await getSiteDoc();
    Object.assign(site.footer, req.body);
    site.markModified('footer');
    await site.save();
    res.json({ success: true, data: site.footer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update SEO settings
// @route   PUT /api/site/seo
const updateSeo = async (req, res) => {
  try {
    const site = await getSiteDoc();
    Object.assign(site.seo, req.body);
    site.markModified('seo');
    await site.save();
    res.json({ success: true, data: site.seo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSite, updateAnnouncement, updateHero, updateNavbar, updateNewsletter, updateFooter, updateSeo };

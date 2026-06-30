const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const SITE_FILE = path.join(__dirname, '../data/site.json');

function readSite() {
  return JSON.parse(fs.readFileSync(SITE_FILE, 'utf8'));
}

function writeSite(data) {
  fs.writeFileSync(SITE_FILE, JSON.stringify(data, null, 2));
}

// GET full site data
router.get('/', (req, res) => {
  try {
    const site = readSite();
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read site data' });
  }
});

// PUT full site data
router.put('/', (req, res) => {
  try {
    writeSite(req.body);
    res.json({ success: true, data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site data' });
  }
});

// PUT announcement
router.put('/announcement', (req, res) => {
  try {
    const site = readSite();
    if (req.body.announcement !== undefined) site.announcement = req.body.announcement;
    if (req.body.announcementVisible !== undefined) site.announcementVisible = req.body.announcementVisible;
    writeSite(site);
    res.json({ success: true, data: { announcement: site.announcement, announcementVisible: site.announcementVisible } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// PUT hero
router.put('/hero', (req, res) => {
  try {
    const site = readSite();
    site.hero = { ...site.hero, ...req.body };
    writeSite(site);
    res.json({ success: true, data: site.hero });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hero' });
  }
});

// PUT navbar
router.put('/navbar', (req, res) => {
  try {
    const site = readSite();
    site.navbar = { ...site.navbar, ...req.body };
    writeSite(site);
    res.json({ success: true, data: site.navbar });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update navbar' });
  }
});

// PUT newsletter
router.put('/newsletter', (req, res) => {
  try {
    const site = readSite();
    site.newsletter = { ...site.newsletter, ...req.body };
    writeSite(site);
    res.json({ success: true, data: site.newsletter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update newsletter' });
  }
});

// PUT footer
router.put('/footer', (req, res) => {
  try {
    const site = readSite();
    site.footer = { ...site.footer, ...req.body };
    writeSite(site);
    res.json({ success: true, data: site.footer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update footer' });
  }
});

module.exports = router;

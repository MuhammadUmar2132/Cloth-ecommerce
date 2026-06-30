const express = require('express');
const router = express.Router();
const {
  getSite,
  updateAnnouncement,
  updateHero,
  updateNavbar,
  updateNewsletter,
  updateFooter,
  updateSeo,
} = require('../controllers/siteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSite);
router.put('/announcement', protect, updateAnnouncement);
router.put('/hero', protect, updateHero);
router.put('/navbar', protect, updateNavbar);
router.put('/newsletter', protect, updateNewsletter);
router.put('/footer', protect, updateFooter);
router.put('/seo', protect, updateSeo);

module.exports = router;

const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");

// සියලුම පින්තූර ලබාගැනීමට (Frontend එකේ Gallery page එකට)
router.get("/", galleryController.getGalleryImages);

// අලුත් පින්තූරයක් ඇතුළත් කිරීමට (Admin ට පමණක් අවශ්‍ය නම්)
router.post("/add", galleryController.addImage);

module.exports = router;

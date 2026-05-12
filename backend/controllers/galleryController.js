const Gallery = require("../models/galleryModel");

exports.getGalleryImages = async (req, res) => {
  try {
    const results = await Gallery.getAllImages();
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addImage = async (req, res) => {
  try {
    const { title, image_url, category } = req.body;

    // Validation
    if (!title || !image_url) {
      return res
        .status(400)
        .json({ message: "Title and image URL are required" });
    }

    const imageData = {
      title,
      image_url,
      category: category || null,
    };

    const result = await Gallery.addImage(title, image_url, category || null);
    res.status(201).json({
      message: "Image added successfully",
      id: result.insertId,
      ...imageData,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

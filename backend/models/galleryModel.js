const db = require("../Connection/db");

async function getAllImages() {
  const [images] = await db.query(
    "SELECT id, title, image_url, category, created_at FROM gallery ORDER BY created_at DESC",
  );
  return images;
}

async function addImage(title, imageUrl, category) {
  const [result] = await db.query(
    "INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)",
    [title, imageUrl, category],
  );
  return result;
}

module.exports = {
  getAllImages,
  addImage,
};

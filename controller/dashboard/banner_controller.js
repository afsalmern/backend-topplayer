const db = require("../../models");
const fs = require('fs').promises;

// Upload a banner image using Multer
exports.uploadBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const { filename } = req.file;
    const imagePath = `/uploads/${filename}`; // Assuming uploads directory is accessible publicly

    // Save banner image to the database
    const result = await db.banner.create({ image: imagePath });

    console.log(`Banner image uploaded successfully`);
    res.status(200).send({
      message: "Banner image uploaded successfully",
      banner: result,
    });
  } catch (err) {
    console.error(`Error in uploading banner image: ${err.toString()}`);

    // Delete the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error(`Error deleting uploaded file: ${unlinkErr}`);
      }
    }

    res.status(500).send({ message: "Internal server error" });
  }
};

// Retrieve all banners
exports.getAllBanners = (req, res, next) => {
  db.banner
    .findAll()
    .then((banners) => {
      console.log(`Retrieved all banners successfully`);
      res.status(200).json({ banners });
    })
    .catch((err) => {
      console.error(`Error in retrieving banners: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve a single banner by ID
exports.getBannerById = (req, res, next) => {
  const bannerId = req.params.id;
  db.banner
    .findByPk(bannerId)
    .then((banner) => {
      if (!banner) {
        return res.status(404).send({ message: "Banner not found" });
      }
      console.log(`Retrieved banner with ID ${bannerId} successfully`);
      res.status(200).send({ banner });
    })
    .catch((err) => {
      console.error(`Error in retrieving banner: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a banner
exports.deleteBanner = (req, res, next) => {
  const bannerId = req.params.id;
  db.banner
    .findByPk(bannerId)
    .then((banner) => {
      if (!banner) {
        return res.status(404).send({ message: "Banner not found" });
      }
      // Delete the associated file from the server
      fs.unlinkSync(`.${banner.image}`);

      return banner.destroy();
    })
    .then(() => {
      console.log(`Banner with ID ${bannerId} deleted successfully`);
      res.status(200).send({ message: "Banner deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting banner: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

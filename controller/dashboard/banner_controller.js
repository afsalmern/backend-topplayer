const db = require("../../models");
const fs = require("fs");

// Upload a banner image using Multer
exports.uploadBanner = async (req, res, next) => {
  try {
    const {
      heading,
      heading_ar,
      non_animate_text,
      non_animate_text_ar,
      animate_text,
      animate_text_ar,
      para,
      para_ar,
    } = req.body;
    const imageUrls = [];
    if (!req.files) {
      return res
        .status(400)
        .send({ message: "Please upload at least one image." });
    }

    for (const image of req.files) {
      const imageUrl = `${image.originalname}`;
      imageUrls.push(imageUrl);
    }
    // Save banner image to the database
    const result = await db.banner.create({
      heading,
      heading_ar,
      non_animate_text,
      non_animate_text_ar,
      animate_text,
      animate_text_ar,
      para,
      para_ar,
    });

    const bannerImages = await Promise.all(
      imageUrls.map((imageUrl) => db.bannerImages.create({ imageUrl }))
    );
    await result.setBannerImages(bannerImages);
    console.log(`Banner image uploaded successfully`);
    res.status(200).send({
      message: "Banner image uploaded successfully",
      banner: result,
    });
  } catch (err) {
    console.error(`Error in uploading banner image: ${err.toString()}`);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Retrieve all banners
exports.getAllBanners = (req, res, next) => {
  db.banner
    .findAll({
      include: [
        {
          model: db.bannerImages,
        },
      ],
    })
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

exports.updateBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    const {
      heading,
      heading_ar,
      non_animate_text,
      non_animate_text_ar,
      animate_text,
      animate_text_ar,
      para,
      para_ar,
    } = req.body;
    let imageUrls = [];

    if (req.files) {
      for (const image of req.files) {
        const imageUrl = `${image.originalname}`; // Adjust this based on your file storage setup
        imageUrls.push(imageUrl);
      }
    }

    const banner = await db.banner.findByPk(bannerId, {
      include: [{ model: db.bannerImages}], // Include associated images
    });

    if (!banner) {
      return res.status(404).send({ message: "Banner not found" });
    }

    // Update banner article details
    await banner.update({
      heading: heading || banner.heading,
      heading_ar: heading_ar || banner.heading_ar,
      non_animate_text: non_animate_text || banner.non_animate_text,
      non_animate_text_ar: non_animate_text_ar || banner.non_animate_text_ar,
      animate_text: animate_text || banner.animate_text,
      animate_text_ar: animate_text_ar || banner.animate_text_ar,
      para: para || banner.para,
      para_ar: para_ar || banner.para_ar,
    });

    // Fetch existing image URLs
    const existingImageUrls = banner.bannerImages.map((image) => image.imageUrl);

    // Filter out existing image URLs from new image URLs
    const newImageUrls = imageUrls.filter(
      (url) => !existingImageUrls.includes(url)
    );

    // Create new newsImage records and associate them with the news article
    const newImages = await db.bannerImages.bulkCreate(
      newImageUrls.map((url) => ({ imageUrl: url }))
    );
    await banner.addBannerImages(newImages);

    res.status(200).send({
      message: "Updated successfully",
      banner,
      newImages: newImages,
    });
  } catch (err) {
    console.error(`Error in updating news: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

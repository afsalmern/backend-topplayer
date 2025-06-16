const db = require("../../models");
const path = require("path");
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

    console.log("BANNER IMAGES =========> ", req.files);

    for (const image of req.files) {
      const imageUrl = `${image.filename}`;
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
  console.log(req.ip);

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
exports.deleteBanner = async (req, res, next) => {
  const bannerId = req.params.id;

  try {
    const banner = await db.banner.findByPk(bannerId);
    if (!banner) {
      return res.status(404).send({ message: "Banner not found" });
    }

    const bannerImages = await db.bannerImages.findAll({
      where: {
        bannerId: bannerId,
      },

      attributes: ["imageUrl"],
    });

    await db.banner.destroy({ where: { id: bannerId } });

    if (bannerImages && bannerImages.length > 0) {
      for (const banner of bannerImages) {
        const filepath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "bannerImages",
          banner.imageUrl
        );

        fs.unlink(filepath, (err) => {
          if (err) {
            console.log(`Error in deleting banner image ${banner.imageUrl}`);
          } else {
            console.log(`Banner image ${banner.imageUrl} deleted successfully`);
          }
        });
      }
    }
    return res.status(200).send({ message: "Banner removed successfully" });
  } catch (error) {
    console.log(`Error in deleting banner: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
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
        const imageUrl = `${image.filename}`; // Adjust this based on your file storage setup
        imageUrls.push(imageUrl);
      }
    }

    const banner = await db.banner.findByPk(bannerId, {
      include: [{ model: db.bannerImages }], // Include associated images
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
    const existingImageUrls = banner.bannerImages.map(
      (image) => image.imageUrl
    );

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

exports.deleteBannerImage = async (req, res) => {
  try {
    const { ids } = req.body;

    const bannerImages = await db.bannerImages.findAll({
      where: {
        id: {
          [db.Op.in]: ids,
        },
      },
    });

    await db.bannerImages.destroy({
      where: {
        id: {
          [db.Op.in]: ids,
        },
      },
    });

    for (const bannerImage of bannerImages) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "bannerImages",
        bannerImage.imageUrl
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(
            `Error deleting file ${bannerImage.imageUrl}: ${err.toString()}`
          );
        } else {
          console.log(`Deleted file ${bannerImage.imageUrl} successfully`);
        }
      });
    }

    res.status(200).send({ message: "Banner image deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting banner image: ${err.toString()}`);
    res.status(500).send({ message: "Error deleting banner image" });
  }
};

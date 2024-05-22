const db = require("../../models");
const fs = require("fs");
const path = require("path");
// Define messages in English
const messages_en = {
  news_added_successfully: "News added successfully",
  news_not_found: "News not found",
  server_error: "Server error",
  news_updated_successfully: "News updated successfully",
  news_deleted_successfully: "News deleted successfully",
};

exports.addNews = (req, res, next) => {
  const { title_en, title_ar, description_en, description_ar } = req.body;
  console.log("files==============>", req.files);

  const imageUrls = [];

  // Check if files are uploaded
  if (!req.files) {
    return res
      .status(400)
      .send({ message: "Please upload at least one image." });
  }
  for (const image of req.files.images) {
    const imageUrl = `${image.filename}`;
    imageUrls.push(imageUrl);
  }

  const coverimage = req.files.coverimage
    ? req.files.coverimage[0].filename
    : null;

  // First, create the news
  db.news
    .create({
      title_en,
      title_ar,
      description_en,
      description_ar,
      coverimage,
    })
    .then((createdNews) => {
      // If news creation is successful, associate the images with the news
      Promise.all(
        imageUrls.map((imageUrl) => db.newsImage.create({ imageUrl }))
      )
        .then((createdImages) => {
          // Associate the created images with the created news
          createdNews
            .addImages(createdImages)
            .then(() => {
              console.log(`A news with images added successfully`);
              res.status(200).send({
                message: messages_en.news_added_successfully,
                news: createdNews,
                images: createdImages,
              });
            })
            .catch((err) => {
              console.error(
                `Error in associating images with news: ${err.toString()}`
              );
              res.status(500).send({ message: messages_en.server_error });
            });
        })
        .catch((err) => {
          console.error(`Error in creating images: ${err.toString()}`);
          res.status(500).send({ message: messages_en.server_error });
        });
    })
    .catch((err) => {
      console.error(`Error in adding news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

exports.getAllNews = (req, res, next) => {
  db.news
    .findAll({
      include: [
        {
          model: db.newsImage,
          as: "images", // Alias defined in the association
        },
      ],
      order: [["createdAt", "DESC"]],
    })
    .then((news) => {
      console.log(`Retrieved all news successfully`);
      res.status(200).send({ news });
    })
    .catch((err) => {
      console.error(`Error in retrieving news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Retrieve a single news by ID
exports.getNewsById = (req, res, next) => {
  const newsId = req.params.id;
  db.news
    .findByPk(newsId)
    .then((news) => {
      if (!news) {
        return res.status(404).send({ message: messages_en.news_not_found });
      }
      console.log(`Retrieved news with ID ${newsId} successfully`);
      res.status(200).send({ news });
    })
    .catch((err) => {
      console.error(`Error in retrieving news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Update a news
exports.updateNews = async (req, res, next) => {
  try {
    const newsId = req.params.id;
    const { title_en, title_ar, description_en, description_ar } = req.body;
    let imageUrls = [];

    if (req.files) {
      console.log("HERE files");
    }

    if (req.files.images) {
      for (const image of req.files.images) {
        const imageUrl = `${image.filename}`; // Adjust this based on your file storage setup
        imageUrls.push(imageUrl);
      }
    }

    console.log("FILES-------------", req.files);

    const news = await db.news.findByPk(newsId, {
      include: [{ model: db.newsImage, as: "images" }], // Include associated images
    });

    const coverImageFile =
      req.files && req.files.coverimage
        ? req.files.coverimage[0].filename
        : news.coverimage;

    if (!news) {
      return res.status(404).send({ message: messages_en.news_not_found });
    }

    // Update news article details
    await news.update({
      title_en: title_en || news.title_en,
      title_ar: title_ar || news.title_ar,
      description_en: description_en || news.description_en,
      description_ar: description_ar || news.description_ar,
      coverimage: coverImageFile,
    });

    // Fetch existing image URLs
    const existingImageUrls = news.images.map((image) => image.imageUrl);

    // Filter out existing image URLs from new image URLs
    const newImageUrls = imageUrls.filter(
      (url) => !existingImageUrls.includes(url)
    );

    // Create new newsImage records and associate them with the news article
    const newImages = await db.newsImage.bulkCreate(
      newImageUrls.map((url) => ({ imageUrl: url }))
    );
    await news.addImages(newImages);

    console.log(`News with ID ${newsId} updated successfully`);
    res.status(200).send({
      message: messages_en.news_updated_successfully,
      news: news,
      newImages: newImages,
    });
  } catch (err) {
    console.error(`Error in updating news: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

// Delete a news
exports.deleteNews = async (req, res, next) => {
  const newsId = req.params.id;

  try {
    const news = await db.news.findByPk(newsId);
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }

    const newsCoverImage = news.coverimage;

    // Retrieve all associated news images
    const newsImages = await db.newsImage.findAll({
      where: { newsId },
      attributes: ["imageUrl"], // Corrected 'attributes' spelling
    });

    console.log(newsImages);

    // Delete the news record from the database
    await news.destroy();
    console.log(`News with ID ${newsId} deleted successfully`);

    // Delete all associated news images from the file system
    if (newsImages && newsImages.length > 0) {
      for (const newsImage of newsImages) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "newsImages",
          newsImage.imageUrl
        );

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(`Error in deleting news image ${newsImage.imageUrl}`);
          } else {
            console.log(
              `Deleted news image ${newsImage.imageUrl} from folder successfully`
            );
          }
        });
      }
    }

    // Delete the cover image from the file system
    if (newsCoverImage) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "newsCoverImages",
        newsCoverImage
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error in deleting news image ${newsCoverImage}`);
        } else {
          console.log(
            `Deleted news image ${newsCoverImage} from folder successfully`
          );
        }
      });
    }

    return res.status(200).send({ message: "News deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting news: ${err.toString()}`);
    return res.status(500).send({ message: "Internal server error" });
  }
};

exports.deleteNewsImage = async (req, res) => {
  try {
    const { ids } = req.body;

    const newsImages = await db.newsImage.findAll({
      where: {
        id: {
          [db.Op.in]: ids,
        },
      },
    });

    await db.newsImage.destroy({
      where: {
        id: {
          [db.Op.in]: ids,
        },
      },
    });

    for (const newsImage of newsImages) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "newsImages",
        newsImage.imageUrl
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}: ${err.toString()}`);
        } else {
          console.log(`Deleted file ${filePath} successfully`);
        }
      });
    }

    res.status(200).send({ message: "News image deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting news image: ${err.toString()}`);
    res.status(500).send({ message: "Error deleting news image" });
  }
};

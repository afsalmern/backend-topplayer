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

exports.addNews = async (req, res, next) => {
  const { title_en, title_ar, description_en, description_ar } = req.body;
  console.log("files==============>", req.files);

  const imageUrls = [];
  const mobileImageUrls = [];

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

  for (const image of req.files.mobileimages) {
    const imageUrl = `${image.filename}`;
    mobileImageUrls.push(imageUrl);
  }

  const coverimage = req.files.coverimage
    ? req.files.coverimage[0].filename
    : null;

  try {
    // First, create the news
    const createdNews = await db.news.create({
      title_en,
      title_ar,
      description_en,
      description_ar,
      coverimage,
    });

    // If news creation is successful, create the images
    const createdImages = await Promise.all(
      imageUrls.map((imageUrl) => db.newsImage.create({ imageUrl }))
    );

    const createdMobileImages = await Promise.all(
      mobileImageUrls.map((imageUrl) => db.newsMobileImage.create({ imageUrl }))
    );

    // Associate the created images with the created news
    await createdNews.addImages(createdImages);
    await createdNews.addMobile(createdMobileImages);

    console.log(`A news with images added successfully`);
    return res.status(200).send({
      message: messages_en.news_added_successfully,
      news: createdNews,
      images: createdImages,
      mobileImages: createdMobileImages,
    });
  } catch (err) {
    console.error(`Error: ${err.toString()}`);
    return res.status(500).send({ message: messages_en.server_error });
  }
};

exports.getAllNews = (req, res, next) => {
  db.news
    .findAll({
      include: [
        {
          model: db.newsImage,
          as: "images", // Alias defined in the association
        },
        {
          model: db.newsMobileImage,
          as: "mobile", // Alias defined in the association
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
    let imageUrlsMobile = [];

    if (req.files.images) {
      for (const image of req.files.images) {
        const imageUrl = `${image.filename}`; // Adjust this based on your file storage setup
        imageUrls.push(imageUrl);
      }
    }

    if (req.files.mobileimages) {
      for (const image of req.files.mobileimages) {
        const imageUrl = `${image.filename}`; // Adjust this based on your file storage setup
        imageUrlsMobile.push(imageUrl);
      }
    }

    console.log("FILES-------------", req.files);

    const news = await db.news.findByPk(newsId, {
      include: [
        { model: db.newsImage, as: "images" },
        { model: db.newsMobileImage, as: "mobile" },
      ], // Include associated images
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

    if (imageUrls.length > 0) {
      const existingImageUrls = news.images.map((image) => image.imageUrl);
      const newImageUrls = imageUrls.filter(
        (url) => !existingImageUrls.includes(url)
      );
      const newImages = await db.newsImage.bulkCreate(
        newImageUrls.map((url) => ({ imageUrl: url }))
      );
      await news.addImages(newImages);
    }

    if (imageUrlsMobile.length > 0) {
      const existingImageUrlsMobile = news.mobile.map(
        (image) => image.imageUrl
      );

      const newImageUrlsMobile = imageUrlsMobile.filter(
        (url) => !existingImageUrlsMobile.includes(url)
      );

      const newImagesMobile = await db.newsMobileImage.bulkCreate(
        newImageUrlsMobile.map((url) => ({ imageUrl: url }))
      );
      await news.addMobile(newImagesMobile);
    }
    console.log(`News with ID ${newsId} updated successfully`);
    res.status(200).send({
      message: messages_en.news_updated_successfully,
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

    const newsImagesMobile = await db.newsMobileImage.findAll({
      where: { newsId },
      attributes: ["imageUrl"], // Corrected 'attributes' spelling
    });

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

    if (newsImagesMobile && newsImagesMobile.length > 0) {
      for (const newsImageMobile of newsImagesMobile) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "newsMobileImages",
          newsImageMobile.imageUrl
        );

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(
              `Error in deleting news image ${newsImageMobile.imageUrl}`
            );
          } else {
            console.log(
              `Deleted news image ${newsImageMobile.imageUrl} from folder successfully`
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
    const { ids, idsMobileImgs } = req.body;

    console.log(ids);
    console.log(idsMobileImgs);

    if (ids && ids.length > 0) {
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
    }
    if (idsMobileImgs && idsMobileImgs.length > 0) {
      const newsMobileImages = await db.newsMobileImage.findAll({
        where: {
          id: {
            [db.Op.in]: idsMobileImgs,
          },
        },
      });

      await db.newsMobileImage.destroy({
        where: {
          id: {
            [db.Op.in]: idsMobileImgs,
          },
        },
      });

      for (const newsImage of newsMobileImages) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "newsMobileImages",
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
    }

    res.status(200).send({ message: "News image deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting news image: ${err.toString()}`);
    res.status(500).send({ message: "Error deleting news image" });
  }
};
exports.addNewsCvrImage = async (req, res) => {
  try {
    const { banner_text, banner_text_ar } = req.body;
    let imgPath;
    if (req.file) {
      imgPath = req.file.filename;
    }

    const newsBanner = await db.newsBannerImages.create({
      banner_text,
      banner_text_ar,
      imageUrl: imgPath,
    });

    res.status(200).send({
      message: "News cover image added successfully",
      data: newsBanner,
    });
  } catch (err) {
    console.error(`Error in adding news cover image: ${err.toString()}`);
    res.status(500).send({ message: "Error adding news cover image" });
  }
};
exports.getNewsCvrImage = async (req, res) => {
  try {
    const newsBanner = await db.newsBannerImages.findAll();

    res.status(200).send({
      message: "News cover image fetched successfully",
      data: newsBanner,
    });
  } catch (err) {
    console.error(`Error in fetching news cover image: ${err.toString()}`);
    res.status(500).send({ message: "Error fetching news cover image" });
  }
};

exports.updateNewsCvrImage = async (req, res) => {
  try {

    console.log("HEREEE");

    const id = req.params.id;
    const { banner_text, banner_text_ar } = req.body;

    if (req.file && req.file.filename) {
      const newFile = req.file.filename;
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "news-banner-images"
      );

      fs.readdir(filePath, (err, files) => {
        if (err) {
          console.log(`Error reading directory: ${err}`);
          return;
        }

        files.forEach((file) => {
          if (file !== newFile) {
            fs.unlink(path.join(filePath, file), (err) => {
              if (err) {
                console.log(`Error deleting file: ${err}`);
                return;
              }
              console.log(`Deleted file: ${file}`);
            });
          }
        });
      });
    }

    const newsBanner = await db.newsBannerImages.findByPk(id);
    if (!newsBanner) {
      return res.status(404).send({ message: "Banner not found" });
    }
    const updatedData = await newsBanner.update({
      imageUrl: req.file ? req.file.filename : newsBanner.imageUrl,
      banner_text: banner_text || newsBanner.banner_text,
      banner_text_ar: banner_text_ar || newsBanner.banner_text_ar,
    });
    console.log(`News banner with ID ${id} updated successfully`);
    res.status(200).send({
      message: "Updated news banner successfully",
      data: updatedData,
    });
  } catch (err) {
    console.error(`Error in updating news cover image: ${err.toString()}`);
    res.status(500).send({ message: "Error updating news cover image" });
  }
};

exports.deleteNewsCvrImage = async (req, res) => {
  const id = req.params.id;
  try {
    const newsBanner = await db.newsBannerImages.findByPk(id);
    if (!newsBanner) {
      return res.status(404).send({ message: "News banner not found" });
    }

    const imgPath = newsBanner.imageUrl;

    if (imgPath) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "news-banner-images",
        imgPath
      );
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.log(`Banner image ${imgPath} removing failed`);
        } else {
          await newsBanner.destroy();
          console.log(
            `Banner image ${imgPath} removed from folder successfully`
          );
        }
      });
    }

    console.log(`News banner with ID ${id} deleted successfully`);
    res.status(200).send({ message: "News banner deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting newsBanner: ${err.toString()}`);
    res.status(500).send({ message: "Internal server error" });
  }
};

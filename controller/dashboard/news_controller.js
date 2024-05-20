const db = require("../../models");

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

  const imageUrls = [];

  console.log("files==============>", req.files);

  // Check if files are uploaded
  if (!req.files) {
    return res
      .status(400)
      .send({ message: "Please upload at least one image." });
  }

  // Extract image URLs from the uploaded files
  for (const image of req.files.images) {
    // Assuming each image object has a `buffer` property containing the image data
    const imageUrl = `${image.originalname}`; // Adjust this based on your file storage setup
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
      console.log("HERE");
    }

    if (req.files.images) {
      for (const image of req.files.images) {
        const imageUrl = `${image.originalname}`; // Adjust this based on your file storage setup
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
      return res.status(404).send({ message: messages_en.news_not_found });
    }

    await news.destroy();
    console.log(`News with ID ${newsId} deleted successfully`);
    return res
      .status(200)
      .send({ message: messages_en.news_deleted_successfully });
  } catch (err) {
    console.error(`Error in deleting news: ${err.toString()}`);
    return res.status(500).send({ message: messages_en.server_error });
  }
};

exports.deleteNewsImage = async (req, res) => {
  try {
    const { ids } = req.body;
    await db.newsImage.destroy({
      where: {
        id: {
          [db.Op.in]: ids,
        },
      },
    }); // Pass an object with options
    res.status(200).send({ message: "News image deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting news image: ${err.toString()}`);
    res.status(500).send({ message: "Error deleting news image" });
  }
};

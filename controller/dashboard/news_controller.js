const db = require("../../models");

// Define messages in English
const messages_en = {
  news_added_successfully: "News added successfully",
  news_not_found: "News not found",
  server_error: "Server error",
  news_updated_successfully: "News updated successfully",
  news_deleted_successfully: "News deleted successfully",
};

// exports.addNews = (req, res, next) => {
//   db.news
//     .create({
//       title_en: req.body.title_en,
//       title_ar: req.body.title_ar,
//       description_en: req.body.description_en,
//       description_ar: req.body.description_ar
//     })
//     .then((result) => {
//       console.log(`A news added successfully`);
//       res.status(200).send({ message: messages_en.news_added_successfully, news: result });
//     })
//     .catch((err) => {
//       console.error(`Error in adding news: ${err.toString()}`);
//       res.status(500).send({ message: messages_en.server_error });
//     });
// };

exports.addNews = (req, res, next) => {
  const { title_en, title_ar, description_en, description_ar } = req.body;
  const imageUrls = [];

  console.log("req.files===>", req.body);

  // Check if files are uploaded
  if (!req.files) {
    return res.status(400).send({ message: "Please upload at least one image." });
  }

  // Extract image URLs from the uploaded files
  for (const image of req.files) {
    // Assuming each image object has a `buffer` property containing the image data
    const imageUrl = `${image.originalname}`; // Adjust this based on your file storage setup
    imageUrls.push(imageUrl);
  }

  // First, create the news
  db.news
    .create({
      title_en,
      title_ar,
      description_en,
      description_ar,
    })
    .then((createdNews) => {
      // If news creation is successful, associate the images with the news
      Promise.all(imageUrls.map((imageUrl) => db.newsImage.create({ imageUrl })))
        .then((createdImages) => {
          // Associate the created images with the created news
          createdNews
            .addImages(createdImages)
            .then(() => {
              console.log(`A news with images added successfully`);
              res
                .status(200)
                .send({ message: messages_en.news_added_successfully, news: createdNews, images: createdImages });
            })
            .catch((err) => {
              console.error(`Error in associating images with news: ${err.toString()}`);
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
exports.updateNews = (req, res, next) => {
  const newsId = req.params.id;
  db.news
    .findByPk(newsId)
    .then((news) => {
      if (!news) {
        return res.status(404).send({ message: messages_en.news_not_found });
      }
      return news.update({
        title_en: req.body.title_en || news.title_en,
        title_ar: req.body.title_ar || news.title_ar,
        description_en: req.body.description_en || news.description_en,
        description_ar: req.body.description_ar || news.description_ar,
      });
    })
    .then((updatedNews) => {
      console.log(`News with ID ${newsId} updated successfully`);
      res.status(200).send({ message: messages_en.news_updated_successfully, news: updatedNews });
    })
    .catch((err) => {
      console.error(`Error in updating news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Delete a news
exports.deleteNews = (req, res, next) => {
  const newsId = req.params.id;
  db.news
    .findByPk(newsId)
    .then((news) => {
      if (!news) {
        return res.status(404).send({ message: messages_en.news_not_found });
      }
      return news.destroy();
    })
    .then(() => {
      console.log(`News with ID ${newsId} deleted successfully`);
      res.status(200).send({ message: messages_en.news_deleted_successfully });
    })
    .catch((err) => {
      console.error(`Error in deleting news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

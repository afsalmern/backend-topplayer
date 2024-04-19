const db = require("../../models");

// Define messages in English
const messages_en = {
  news_added_successfully: "News added successfully",
  news_not_found: "News not found",
  server_error: "Server error",
  news_updated_successfully: "News updated successfully",
  news_deleted_successfully: "News deleted successfully"
};

// // Define messages in Arabic
// const messages_ar = {
//   news_added_successfully: "تم إضافة الخبر بنجاح",
//   news_not_found: "الخبر غير موجود",
//   server_error: "خطأ في الخادم",
//   news_updated_successfully: "تم تحديث الخبر بنجاح",
//   news_deleted_successfully: "تم حذف الخبر بنجاح"
// };

// Create a new news
exports.addNews = (req, res, next) => {
  db.news
    .create({
      title_en: req.body.title_en,
      title_ar: req.body.title_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar
    })
    .then((result) => {
      console.log(`A news added successfully`);
      res.status(200).send({ message: messages_en.news_added_successfully, news: result });
    })
    .catch((err) => {
      console.error(`Error in adding news: ${err.toString()}`);
      res.status(500).send({ message: messages_en.server_error });
    });
};

// Retrieve all news
exports.getAllNews = (req, res, next) => {
  db.news
    .findAll()
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

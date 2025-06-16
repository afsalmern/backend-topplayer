const db = require("../../models");
const FAQ = db.faq;

// Add a new FAQ
exports.addFAQ = (req, res, next) => {
  FAQ.create({
    question_en: req.body.question_en,
    question_ar: req.body.question_ar,
    answer_en: req.body.answer_en,
    answer_ar: req.body.answer_ar,
  })
    .then((result) => {
      console.log(`A FAQ added successfully`);
      res.status(200).send({ message: "FAQ added successfully", faq: result });
    })
    .catch((err) => {
      console.error(`Error in adding FAQ: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all FAQs
exports.getAllFAQs = (req, res, next) => {
  FAQ.findAll({ order: [["createdAt", "DESC"]] })
    .then((faqs) => {
      console.log(`Retrieved all FAQs successfully`);
      res.status(200).send({ faqs });
    })
    .catch((err) => {
      console.error(`Error in retrieving FAQs: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve a single FAQ by ID
exports.getFAQById = (req, res, next) => {
  const faqId = req.params.id;
  FAQ.findByPk(faqId)
    .then((faq) => {
      if (!faq) {
        return res.status(404).send({ message: "FAQ not found" });
      }
      console.log(`Retrieved FAQ with ID ${faqId} successfully`);
      res.status(200).send({ faq });
    })
    .catch((err) => {
      console.error(`Error in retrieving FAQ: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Update a FAQ
exports.updateFAQ = (req, res, next) => {
  const faqId = req.params.id;
  FAQ.findByPk(faqId)
    .then((faq) => {
      if (!faq) {
        return res.status(404).send({ message: "FAQ not found" });
      }
      return faq.update({
        question_en: req.body.question_en || faq.question_en,
        question_ar: req.body.question_ar || faq.question_ar,
        answer_en: req.body.answer_en || faq.answer_en,
        answer_ar: req.body.answer_ar || faq.answer_ar,
      });
    })
    .then((updatedFAQ) => {
      console.log(`FAQ with ID ${faqId} updated successfully`);
      res
        .status(200)
        .send({ message: "FAQ updated successfully", faq: updatedFAQ });
    })
    .catch((err) => {
      console.error(`Error in updating FAQ: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a FAQ
exports.deleteFAQ = (req, res, next) => {
  const faqId = req.params.id;
  FAQ.findByPk(faqId)
    .then((faq) => {
      if (!faq) {
        return res.status(404).send({ message: "FAQ not found" });
      }
      return faq.destroy();
    })
    .then(() => {
      console.log(`FAQ with ID ${faqId} deleted successfully`);
      res.status(200).send({ message: "FAQ deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting FAQ: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

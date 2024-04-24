const db = require("../../models");

// exports.addCategory = (req, res, next) => {
//   db.category
//     .create({
//       name: req.body.name,
//     })
//     .then((result) => {
//       console.log(`a category added successfully`);
//       res.status(200).send({ message: "category added successfully" });
//     })
//     .catch((err) => {
//       console.error(`error in adding category ${err.toString()}`);
//       res.status(500).send({ message: err.toString() });
//     });
// };

exports.addCategory = (req, res, next) => {
  const { name, description } = req.body; // Extracting name and description from request body

  db.category
    .create({
      name: name,
      description: description, // Adding description to the create method
    })
    .then((result) => {
      console.log(`A category added successfully`);
      res.status(200).send({ message: "Category added successfully" });
    })
    .catch((err) => {
      console.error(`Error in adding category: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// exports.getAllCategories = (req, res, next) => {
//   db.category
//     .findAll()
//     .then((categories) => {
//       console.log(`Retrieved all categories successfully`);
//       res.status(200).send({ categories });
//     })
//     .catch((err) => {
//       console.error(`Error in retrieving categories: ${err.toString()}`);
//       res.status(500).send({ message: err.toString() });
//     });
// };

exports.getAllCategories = (req, res) => {
  db.category
    .findAll()
    .then((categories) => {
      const categoriesWithDescriptions = categories.map((category) => {
        // Splitting the description into separate lines
        const descriptionLines = category?.description?.split("\n");

        // Generating HTML markup for each line
        const descriptionHTML = descriptionLines
          ?.map((line) => {
            return `<li><p>${line}</p></li>`;
          })
          ?.join("");

        // Wrapping the generated HTML in a <ul> element with the specified class
        const html = `<ul class="Home_leftText__p8Kdc">${descriptionHTML}</ul>`;

        return {
          id: category.id,
          name: category.name,
          descriptionHTML: descriptionHTML ? html : null,
        };
      });
      res.json(categoriesWithDescriptions);
    })
    .catch((err) => {
      console.log("Error while fetching categories:", err);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.getCategoryById = (req, res, next) => {
  const categoryId = req.params.id;
  db.category
    .findByPk(categoryId)
    .then((category) => {
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }
      console.log(`Retrieved category with ID ${categoryId} successfully`);
      res.status(200).send({ category });
    })
    .catch((err) => {
      console.error(`Error in retrieving category: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.updateCategory = (req, res, next) => {
  const categoryId = req.params.id;
  db.category
    .findByPk(categoryId)
    .then((category) => {
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }
      return category.update({
        name: req.body.name || category.name,
      });
    })
    .then((updatedCategory) => {
      console.log(`Category with ID ${categoryId} updated successfully`);
      res.status(200).send({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    })
    .catch((err) => {
      console.error(`Error in updating category: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.id;
  db.category
    .findByPk(categoryId)
    .then((category) => {
      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }
      return category.destroy();
    })
    .then(() => {
      console.log(`Category with ID ${categoryId} deleted successfully`);
      res.status(200).send({ message: "Category deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting category: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

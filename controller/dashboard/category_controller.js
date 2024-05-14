const { where } = require("sequelize");
const db = require("../../models");

exports.addCategory = (req, res, next) => {
  db.category
    .create({
      name: req.body.name,
    })
    .then((result) => {
      console.log(`a category added successfully`);
      res.status(200).send({ message: "category added successfully" });
    })
    .catch((err) => {
      console.error(`error in adding category ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

exports.getAllCategories = (req, res, next) => {
  db.category
    .findAll({
      where: { isDeleted: false }, // Condition to retrieve only non-deleted categories
      order: [["createdAt", "DESC"]],
    })
    .then((categories) => {
      console.log(`Retrieved all categories successfully`);
      res.status(200).send({ categories });
    })
    .catch((err) => {
      console.error(`Error in retrieving categories: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
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
        active: req.body.active || category.active,
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

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    // Find the category by ID
    const category = await db.category.findByPk(categoryId);

    // If category not found, return 404
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Soft delete the category by setting isDeleted to true and save the changes
    category.isDeleted = true;
    await category.save();

    console.log(`Category with ID ${categoryId} soft deleted successfully`);
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting category: ${err.toString()}`);
    res.status(500).send({ message: err.toString() });
  }
};

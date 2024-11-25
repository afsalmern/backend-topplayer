const fs = require("fs/promises"); // Use fs/promises for async operations
const path = require("path");
const db = require("../models");

exports.addCongrats = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload an image." });
  }
  const { heading, heading_ar, sub_text, sub_text_ar } = req.body;

  try {
    const isItemExistInDB = await db.congrats.findOne({ attributes: ["id"] }); // Only fetch 'id' to improve performance
    if (isItemExistInDB) {
      const { filename } = req.file;
      const filePath = path.join(__dirname, "..", "public", "congrats_images", filename);

      try {
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the old file
        console.log(`Deleted old file: ${filename}`);
      } catch (err) {
        console.error(`Error deleting old file: ${err}`); // File might not exist or permission error
      }

      return res.status(400).send({
        message: "An item already exists. Please remove the existing item and try again.",
      });
    }

    const image = req.file.filename;
    const result = await db.congrats.create({
      heading,
      heading_ar,
      sub_text,
      sub_text_ar,
      imageUrl: image,
    });
    res.status(200).send({
      message: "Congrats added successfully",
      data: result,
    });
  } catch (error) {
    console.log(`error in adding congrats ${error.toString()}`);
    res.status(500).send({ message: `error in adding congrats ${error.toString()}` });
  }
};

exports.getCongrats = async (req, res, next) => {
  try {
    const result = await db.congrats.findAll();
    res.status(200).send({
      message: "Congrats fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(`error in fetching congrats ${error.toString()}`);
    res.status(500).send({ message: `error in fetching congrats ${error.toString()}` });
  }
};

exports.deleteCongrats = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await db.congrats.findByPk(id);
    if (!result) {
      return res.status(404).send({ message: "Congrats not found" });
    }

    const image = result.imageUrl; // Existing file

    if (image) {
      const filePath = path.join(__dirname, "..", "public", "congrats_images", image);
      try {
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the old file
        console.log(`Deleted old file: ${image}`);
      } catch (err) {
        console.error(`Error deleting old file: ${err}`); // File might not exist or permission error
      }
    }

    await result.destroy();
    res.status(200).send({ message: "Congrats deleted successfully" });
  } catch (error) {
    console.log(`error in deleting congrats ${error.toString()}`);
    res.status(500).send({ message: `error in deleting congrats ${error.toString()}` });
  }
};

exports.updateCongrats = async (req, res, next) => {
  try {
    const { heading, heading_ar, sub_text, sub_text_ar } = req.body;
    const {id} = req.params
    const result = await db.congrats.findByPk(id);
    if (!result) {
      return res.status(404).send({ message: "Congrats not found" });
    }

    let oldFileName = result.imageUrl; // Existing file
    let newFileName = req.file?.filename;

    // Update congrats data
    await result.update({
      heading: heading || result.heading,
      heading_ar: heading_ar || result.heading_ar,
      sub_text: sub_text || result.sub_text,
      sub_text_ar: sub_text_ar || result.sub_text_ar,
      imageUrl: newFileName || result.imageUrl,
    });

    // If a new file is uploaded, remove the old file (if it exists)
    if (newFileName && oldFileName) {
      const filePath = path.join(__dirname, "..", "public", "congrats_images", oldFileName);
      console.log(filePath);

      try {
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the old file
        console.log(`Deleted old file: ${oldFileName}`);
      } catch (err) {
        console.error(`Error deleting old file: ${err}`); // File might not exist or permission error
      }
    }

    res.status(200).send({ message: "Congrats updated successfully" });
  } catch (error) {
    console.error(`Error in updating congrats: ${error.toString()}`);
    res.status(500).send({ message: `Error in updating congrats: ${error.message}` });
  }
};

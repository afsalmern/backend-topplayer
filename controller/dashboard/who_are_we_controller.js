const db = require("../../models");
const path = require("path");
const fs = require("fs");

// Define messages in English
const messages_en = {
  who_are_we_added_successfully: "Who are we data added successfully",
  who_are_we_not_found: "Who are we data not found",
  server_error: "Server error",
  who_are_we_updated_successfully: "Who are we data updated successfully",
  who_are_we_deleted_successfully: "Who are we data deleted successfully",
};

// Create new who are we data
exports.addWhoAreWeData = async (req, res, next) => {
  let videoPath;
  if (req.file) {
    videoPath = req.file.filename;
  }
  try {
    const result = await db.whoAreWe.create({
      experience: req.body.experience,
      users: req.body.users,
      courses: req.body.courses,
      videoUrl: videoPath,
      head: req.body.head,
      subhead: req.body.subhead,
      head_ar: req.body.head_ar,
      subhead_ar: req.body.subhead_ar,
    });
    console.log(`Who are we data added successfully`);
    res.status(200).send({
      message: messages_en.who_are_we_added_successfully,
      data: result,
    });
  } catch (err) {
    console.error(`Error in adding who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

// Retrieve all who are we data
exports.getAllWhoAreWeData = async (req, res, next) => {
  try {
    const data = await db.whoAreWe.findAll();
    console.log(`Retrieved all who are we data successfully`);
    res.status(200).send({ data });
  } catch (err) {
    console.error(`Error in retrieving who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

// Retrieve a single who are we data by ID
exports.getWhoAreWeDataById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await db.whoAreWe.findByPk(id);
    if (!data) {
      return res
        .status(404)
        .send({ message: messages_en.who_are_we_not_found });
    }
    console.log(`Retrieved who are we data with ID ${id} successfully`);
    res.status(200).send({ data });
  } catch (err) {
    console.error(`Error in retrieving who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

// Update who are we data
exports.updateWhoAreWeData = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.file && req.file.filename) {
      const newFile = req.file.filename;
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "who_we_videos"
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

    const data = await db.whoAreWe.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }
    const updatedData = await data.update({
      experience: req.body.experience || data.experience,
      users: req.body.users || data.users,
      courses: req.body.courses || data.courses,
      videoUrl: req.file ? req.file.filename : data.videoUrl,
      head: req.body.head || data.head,
      subhead: req.body.subhead || data.subhead,
      head_ar: req.body.head_ar || data.head_ar,
      subhead_ar: req.body.subhead_ar || data.subhead_ar,
    });
    console.log(`Who are we data with ID ${id} updated successfully`);
    res.status(200).send({
      message: messages_en.who_are_we_updated_successfully,
      data: updatedData,
    });
  } catch (err) {
    console.error(`Error in updating who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

// Delete who are we data
exports.deleteWhoAreWeData = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await db.whoAreWe.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Data not found" });
    }

    const videoPath = data.videoUrl;

    if (videoPath) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "who_we_videos",
        videoPath
      );
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.log(`Who are we video ${videoPath} removing failed`);
        } else {
          await data.destroy();
          console.log(
            `Who are we video ${videoPath} removed from folder successfully`
          );
        }
      });
    }
    console.log(`Who are we data with ID ${id} deleted successfully`);
    res.status(200).send({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting who are we data: ${err.toString()}`);
    res.status(500).send({ message: "Internal server error" });
  }
};

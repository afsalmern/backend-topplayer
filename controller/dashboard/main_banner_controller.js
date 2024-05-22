const db = require("../../models");
const path = require("path");
const fs = require("fs");

exports.addMainBanner = async (req, res, next) => {
  console.log("BANNER VIDEO ======== >", req.file);

  let videoPath;
  if (req.file) {
    videoPath = req.file.filename;
  }
  try {
    const result = await db.mainBanner.create({
      videoUrl: videoPath,
      head: req.body.head,
      subhead: req.body.subhead,
      head_ar: req.body.head_ar,
      title_text: req.body.title_text,
      title_text_Ar: req.body.title_text_ar,
      subhead_ar: req.body.subhead_ar,
    });
    console.log(`Main banner added successfully`);
    res.status(200).send({
      message: "Banner added successfully",
      data: result,
    });
  } catch (err) {
    console.error(`Error in adding who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

exports.getAllMainBanner = async (req, res, next) => {
  try {
    const data = await db.mainBanner.findAll();
    console.log(`Retrieved all banners successfully`);
    res.status(200).send({ data });
  } catch (err) {
    console.error(`Error in retrieving who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

exports.getMainBannerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await db.mainBanner.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Banner not found" });
    }
    console.log(`Retrieved banner with ID ${id} successfully`);
    res.status(200).send({ data });
  } catch (err) {
    console.error(`Error in retrieving who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

exports.updateMainBanner = async (req, res, next) => {
  const id = req.params.id;

  if (req.file && req.file.filename) {
    const newFile = req.file.filename;
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "banner_videos"
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

  try {
    const data = await db.mainBanner.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Banner not found" });
    }
    const updatedData = await data.update({
      videoUrl: req.file ? req.file.filename : data.videoUrl,
      head: req.body.head || data.head,
      subhead: req.body.subhead || data.subhead,
      head_ar: req.body.head_ar || data.head_ar,
      title_text: req.body.title_text || data.title_text,
      title_text_Ar: req.body.title_text_ar || data.title_text_ar,
      subhead_ar: req.body.subhead_ar || data.subhead_ar,
    });
    console.log(`Banner with ID ${id} updated successfully`);
    res.status(200).send({
      message: "Updated banner successfully",
      data: updatedData,
    });
  } catch (err) {
    console.error(`Error in updating who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

exports.deleteMainBanner = async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await db.mainBanner.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Banner not found" });
    }

    const videoPath = data.videoUrl;

    if (videoPath) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "banner_videos",
        videoPath
      );
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.log(`Video ${videoPath} removing failed`);
        } else {
          await data.destroy();
          console.log(`Video ${videoPath} removed from folder successfully`);
        }
      });
    }

    console.log(`Banner with ID ${id} deleted successfully`);
    res.status(200).send({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting who are we data: ${err.toString()}`);
    res.status(500).send({ message: messages_en.server_error });
  }
};

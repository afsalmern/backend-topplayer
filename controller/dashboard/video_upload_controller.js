const db = require("../../models");
const extractFrames = require("ffmpeg-extract-frames");
const path = require("path");
const fs = require("fs").promises; // Import the filesystem module

exports.addVideo = async (req, res, next) => {
  const videoUrl = req.file?.filename; // Assuming multer has already been set up to handle file uploads
  const thumbnailFilename = `${videoUrl.replace(/\.[^.]+$/, "")}.jpg`; // Generate thumbnail filename

  const videoPath = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "trojanTTt",
    "videos",
    "new",
    videoUrl
  );
  const thumbnailPath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    thumbnailFilename
  );

  try {
    // Create the directory if it doesn't exist
    await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

    // Extract a frame from the video at 1 second
    await extractFrames({
      input: videoPath,
      output: thumbnailPath,
      offsets: [1000],
    });

    console.log("thumbnail added");

    // Save video details including the thumbnail path to the database
    const result = await db.video.create({
      name: req.body.name,
      day: req.body.day,
      url: videoUrl,
      frameURL: thumbnailFilename,
      subCourseId: req.body.subCourseId,
    });

    console.log("A video added successfully");
    res
      .status(200)
      .send({ message: "Video added successfully", video: result });
  } catch (error) {
    console.error("Error:", error.toString());
    res.status(500).send({ message: error.toString() });
  }
};

// Retrieve all videos
exports.getAllVideos = (req, res, next) => {
  db.video
    .findAll({ order: [["createdAt", "DESC"]] })
    .then((videos) => {
      console.log(`Retrieved all videos successfully`);
      res.status(200).send({ videos });
    })
    .catch((err) => {
      console.error(`Error in retrieving videos: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve a single video by ID
exports.getVideoById = (req, res, next) => {
  const videoId = req.params.id;
  db.video
    .findByPk(videoId)
    .then((video) => {
      if (!video) {
        return res.status(404).send({ message: "Video not found" });
      }
      console.log(`Retrieved video with ID ${videoId} successfully`);
      res.status(200).send({ video });
    })
    .catch((err) => {
      console.error(`Error in retrieving video: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Update a video
exports.updateVideo = (req, res, next) => {
  const videoId = req.params.id;
  db.video
    .findByPk(videoId)
    .then((video) => {
      if (!video) {
        return res.status(404).send({ message: "Video not found" });
      }
      // Delete old file
      fs.unlink(video.url, (err) => {
        if (err) {
          console.error(`Error deleting old file: ${err.toString()}`);
        }
        // Upload new file (assuming multer middleware is used)
        const newVideoUrl = req.file.filename;
        // Update record with new file URL
        video
          .update({
            name: req.body.name || video.name,
            day: req.body.day || video.day,
            url: newVideoUrl || video.url,
            subCourseId: req.body.subcourseId || video.subCourseId,
          })
          .then((updatedVideo) => {
            console.log(`Video with ID ${videoId} updated successfully`);
            res.status(200).send({
              message: "Video updated successfully",
              video: updatedVideo,
            });
          })
          .catch((err) => {
            console.error(`Error in updating video: ${err.toString()}`);
            res.status(500).send({ message: err.toString() });
          });
      });
    })
    .catch((err) => {
      console.error(`Error in retrieving video: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a video
exports.deleteVideo = (req, res, next) => {
  const videoId = req.params.id;
  db.video
    .findByPk(videoId)
    .then((video) => {
      if (!video) {
        return res.status(404).send({ message: "Video not found" });
      }
      // Delete associated file
      fs.unlink(video.url, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.toString()}`);
        }
        // Proceed to delete record from database
        video
          .destroy()
          .then(() => {
            console.log(`Video with ID ${videoId} deleted successfully`);
            res.status(200).send({ message: "Video deleted successfully" });
          })
          .catch((err) => {
            console.error(`Error in deleting video: ${err.toString()}`);
            res.status(500).send({ message: err.toString() });
          });
      });
    })
    .catch((err) => {
      console.error(`Error in retrieving video: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

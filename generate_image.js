const extractFrames = require("ffmpeg-extract-frames");
const path = require("path");
const db = require("./models");

async function generate() {
  try {
    let videos = await db.video.findAll();

    for (let index = 0; index < videos.length; index++) {
      const video = videos[index];
      const videoPath = path.join(
        __dirname,
        "assets",
        "trojanTTt",
        "videos",
        "new",
        video.url
      );
      const filename = video.url.replace(/\.m4v$/i, "") + ".jpg";
      const otputfile = path.join(__dirname, "public", "images", filename);
      await extractFrames({
        input: videoPath,
        output: otputfile,
        offsets: [1000],
      });

      video.frameURL = filename;
      await video.save();
      console.log("video saved");
    }
  } catch (error) {
    console.log(error.toString());
  }
}

generate();

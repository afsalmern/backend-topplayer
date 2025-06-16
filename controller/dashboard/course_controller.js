const db = require("../../models");
const fs = require("fs");
const path = require("path");
const { where } = require("sequelize");

// Create a new course

exports.addCourse = async (req, res, next) => {
  try {
    let imageUrl = "1.png";
    let bannerUrl = "banner-program.jpg";
    let videoUrl = "who-1.mp4";

    // Check and handle uploaded files (image, banner, video)
    if (req.files) {
      imageUrl = req.files.image ? req.files.image[0].filename : null; // Get image URL if uploaded
      bannerUrl = req.files.banner ? req.files.banner[0].filename : null; // Get banner URL if uploaded
      videoUrl = req.files.video ? req.files.video[0].filename : null; // Get video URL if uploaded
    }

    console.log(req.body);

    // Create course with uploaded file URLs (or null if not uploaded)
    const course = await db.course.create({
      name: req.body.name,
      name_arabic: req.body.name_arabic,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
      offerAmount: req.body.offerAmount,
      description: req.body.description,
      description_ar: req.body.description_ar,
      enroll_text: req.body.enroll_text,
      enroll_text_ar: req.body.enroll_text_ar,
      duration: req.body.duration,
      enr_count: req.body.enr_count == "" ? 0 : req.body.enr_count,
      course_type: req.body.course_type == "" ? null : req.body.course_type,
      imageUrl,
      bannerUrl,
      videoUrl,
    });
    console.log(`A course added successfully`);
    res.status(200).send({ message: "Course added successfully", course });
  } catch (error) {
    console.error(`Error in adding course: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const { filter, status } = req.params;

    let whereClauseCtegory = {};
    let whereClause = {};

    if (status === "enabled") {
      whereClause = { isDeleted: false };
    } else if (status === "disabled") {
      whereClause = { isDeleted: true };
    }

    if (filter === "course") {
      whereClauseCtegory = { iscamp: false };
    } else if (filter === "camp") {
      whereClauseCtegory = { iscamp: true };
    }

    const courses = await db.course.findAll({
      include: {
        model: db.category, // Include the Category model
        attributes: ["name", "isCamp"],
        where: whereClauseCtegory, // Only retrieve the 'name' attribute from the Category model
      },
      attributes: [
        "id",
        "name",
        "amount",
        "description",
        "categoryId",
        "description_ar",
        "name_arabic",
        "imageUrl",
        "offerAmount",
        "enroll_text",
        "enroll_text_ar",
        "bannerUrl",
        "videoUrl",
        "duration",
        "isDeleted",
        "isFull",
        "enr_count",
        "course_type"
      ],
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    console.log(`Retrieved all courses successfully`);

    const courseOnlyData = courses;

    // Manipulating the response to have category_name instead of category object
    const modifiedCourses = courses?.map((course) => {
      // Splitting the description into checklist items
      const checklistItems = course?.description?.split("\n");
      // Generating HTML markup for the checklist
      const checklistHTML = checklistItems?.map((item) => `<li><p>${item}</p></li>`).join("");

      const offerPercentage = Math.round(((course.amount - course.offerAmount) / course.amount) * 100);

      const checklistItems2 = course?.description_ar?.split("\n");
      // Generating HTML markup for the checklist
      const checklistHTML2 = checklistItems2?.map((item) => `<li><p>${item}</p></li>`).join("");

      return {
        ...course.toJSON(),
        isCamp: course.category.isCamp,
        category_name: course.category ? course.category?.name : null,
        descriptionHTML: checklistHTML ? `${checklistHTML}` : null, // Wrap checklist items in <ul> element
        descriptionHTMLAr: checklistHTML2 ? `${checklistHTML2}` : null, // Wrap checklist items in <ul> element
        description: course?.description || null,
        description_ar: course?.description_ar || null,
        offerPercentage,
      };
    });

    // Remove the nested category object and original description field
    modifiedCourses.forEach((course) => {
      delete course.category;
    });

    res.status(200).json({ courses: modifiedCourses, courseOnlyData });
  } catch (error) {
    console.error(`Error in retrieving courses: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.updateCampEnrollments = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { checked } = req.body;
    const getUserCountInCamp = await db.payment.count({
      where: {
        courseId: courseId,
      },
      distinct: true,
      col: "userId",
    });

    const course = await db.course.findByPk(courseId);
    if (course.isFull && getUserCountInCamp >= course.enr_count) {
      res.status(400).send({
        success: false,
        message: "Please increase the enrollment count",
      });
      return;
    }

    if (!course.isFull && getUserCountInCamp < course.enr_count) {
      course.isFull = checked;
      await course.save();

      res.status(200).send({
        success: true,
        message: "Updated successfully",
      });
      return;
    }

    if (course.isFull && getUserCountInCamp < course.enr_count) {
      console.log("HERE");
      course.isFull = checked;
      await course.save();

      res.status(200).send({
        success: true,
        message: "Updated successfully",
      });
      return;
    }
  } catch (error) {
    console.error(`Error in updating enrollments in camp: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

// Retrieve a single course by ID
exports.getCourseById = (req, res, next) => {
  const courseId = req.params.id;
  db.course
    .findByPk(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({ message: "Course not found" });
      }
      console.log(`Retrieved course with ID ${courseId} successfully`);
      res.status(200).send({ course });
    })
    .catch((err) => {
      console.error(`Error in retrieving course: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};


exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id; // Get course ID from request params
    console.log("courseId=====>", courseId);
    console.log("body", req.body);
    console.log("files", req.files);

    let imageUrl;
    let bannerUrl;
    let videoUrl;

    if (req.files) {
      imageUrl = req.files.image ? req.files.image[0].filename : null; // Get image URL if uploaded
      bannerUrl = req.files.banner ? req.files.banner[0].filename : null; // Get banner URL if uploaded
      videoUrl = req.files.video ? req.files.video[0].filename : null; // Get video URL if uploaded
    }

    // Find course by ID
    const course = await db.course.findByPk(courseId);




    const courseType = req.body.course_type == "" ? null : req.body.course_type;
    const enrollmentCount = req.body.enr_count == "" ? 0 : req.body.enr_count;

    console.log("courseType====>", courseType);
    

    // Update course object with uploaded file URLs (or null if not uploaded)
    const updatedCourse = {
      name: req.body.name || course.name,
      name_arabic: req.body.name_arabic || course.name_arabic,
      categoryId: req.body.categoryId || course.categoryId,
      amount: req.body.amount || course.amount,
      offerAmount: req.body.offerAmount || course.offerAmount,
      description: req.body.description || course.description,
      description_ar: req.body.description_ar || course.description_ar,
      enroll_text: req.body.enroll_text || course.enroll_text,
      enroll_text_ar: req.body.enroll_text_ar || course.enroll_text_ar,
      duration: req.body.duration || course.duration,
      enr_count: enrollmentCount,
      course_type: courseType,
      imageUrl: imageUrl || course.imageUrl,
      bannerUrl: bannerUrl || course.bannerUrl,
      videoUrl: videoUrl || course.videoUrl,
    };


    if (!course) {
      // Handle case where course not found
      return res.status(404).send({ message: "Course not found" });
    }

    // Update course data
    await course.update(updatedCourse);

    console.log(`Course with ID ${courseId} updated successfully`);
    res.status(200).send({ message: "Course updated successfully", course });
  } catch (error) {
    console.error(`Error in updating course: ${error.toString()}`);
    res.status(500).send({ message: "Internal server error" }); // Avoid exposing specific error details
  }
};

// Delete a course
exports.deleteCourse = async (req, res, next) => {
  const courseId = req.params.id;
  const checked = req.params.checked === "false";

  try {
    const course = await db.course.findByPk(courseId);

    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    // if (course.imageUrl) {
    //   const img = path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "public",
    //     "courseImages",
    //     course.imageUrl
    //   );
    //   fs.unlink(img);
    // }

    // if (course.videoUrl) {
    //   const video = path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "public",
    //     "courseImages",
    //     course.videoUrl
    //   );
    //   fs.unlink(video);
    // }

    // if (course.bannerUrl) {
    //   const banner = path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "public",
    //     "courseImages",
    //     course.bannerUrl
    //   );
    //   fs.unlink(banner);
    // }

    // const mediaUrls = ["imageUrl", "videoUrl", "bannerUrl"];
    // const mediaDir = path.join(__dirname, "..", "..", "public", "courseImages");

    // mediaUrls.forEach((urlProperty) => {
    //   const filePath = path.join(mediaDir, course[urlProperty]);
    //   if (course[urlProperty] && fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    //   }
    // });

    course.isDeleted = checked ? 1 : 0;
    await course.save();

    console.log(`Course with ID ${courseId} deleted successfully`);
    res.status(200).send({ message: "Course updated successfully" });
  } catch (err) {
    console.error(`Error in deleting course: ${err.toString()}`);
    res.status(500).send({ message: err.toString() });
  }
};

// Delete a course

exports.deleteMedia = async (req, res, next) => {
  const { id, filename, type } = req.params;
  console.log(filename);
  try {
    const course = await db.course.findByPk(id);

    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    // Delete media according to type
    switch (type) {
      case "image":
        // Remove imageUrl from course
        course.imageUrl = null;
        // Unlink image file from public/courseImages
        fs.unlinkSync(path.join(__dirname, "..", "..", "public", "courseImages", filename));
        break;
      case "video":
        // Remove videoUrl from course
        course.videoUrl = null;
        // Unlink video file from public/courseVideos
        fs.unlinkSync(path.join(__dirname, "..", "..", "public", "courseImages", filename));
        break;
      case "banner":
        // Remove bannerUrl from course
        course.bannerUrl = null;
        // Unlink banner file from public/courseBanners
        fs.unlinkSync(path.join(__dirname, "..", "..", "public", "courseImages", filename));
        break;
      default:
        return res.status(400).send({ message: "Invalid media type" });
    }

    // Save the updated course
    await course.save();

    console.log(`Media of ${type} deleted successfully`);
    res.status(200).send({ message: "Media deleted successfully" });
  } catch (err) {
    console.error(`Error in deleting course media: ${err.toString()}`);
    res.status(500).send({ message: err.toString() });
  }
};


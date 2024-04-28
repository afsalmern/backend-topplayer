const db = require("../../models");

// Create a new course
exports.addCourse = async (req, res, next) => {
  try {
    let imageUrl; // Initialize imageUrl variable

    // Check if file is uploaded
    if (req.file) {
      imageUrl = `${req.file.filename}`; // Construct image URL
    }

    // Create course
    const course = await db.course.create({
      name: req.body.name,
      name_arabic: req.body.name_arabic,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
      offerAmount: req.body.offerAmount,
      description: req.body.description,
      description_ar: req.body.description_ar,
      imageUrl: imageUrl,
    });
    console.log(`A course added successfully`);
    res.status(200).send({ message: "Course added successfully" });
  } catch (error) {
    console.error(`Error in adding course: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

// exports.getAllCourses = (req, res, next) => {
//   db.course
//     .findAll({
//       include: {
//         model: db.category, // Assuming your Category model is named 'category' in your Sequelize instance
//         attributes: ["name"], // Only retrieve the 'name' attribute from the Category model
//       },
//     })
//     .then((courses) => {
//       console.log(`Retrieved all courses successfully`);

//       // Manipulating the response to have category_name instead of category object
//       const modifiedCourses = courses.map((course) => ({
//         ...course.toJSON(),
//         category_name: course.category ? course.category.name : null,
//       }));

//       // Remove the nested category object
//       modifiedCourses.forEach((course) => {
//         delete course.category;
//       });

//       res.status(200).json({ courses: modifiedCourses });
//     })
//     .catch((err) => {
//       console.error(`Error in retrieving courses: ${err.toString()}`);
//       res.status(500).send({ message: err.toString() });
//     });
// };

exports.getAllCourses = async (req, res, next) => {
  db.course
    .findAll({
      include: {
        model: db.category, // Include the Category model
        attributes: ["name"], // Only retrieve the 'name' attribute from the Category model
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
      ], // Include the necessary attributes from the Course model
    })
    .then((courses) => {
      console.log(`Retrieved all courses successfully`);

      // Manipulating the response to have category_name instead of category object
      const modifiedCourses = courses?.map((course) => {
        // Splitting the description into checklist items
        const checklistItems = course?.description?.split("\n");
        // Generating HTML markup for the checklist
        const checklistHTML = checklistItems
          ?.map((item) => `<li><p>${item}</p></li>`)
          .join("");

        const offerPercentage = Math.round(
          ((course.amount - course.offerAmount) / course.amount) * 100
        );

        const checklistItems2 = course?.description_ar?.split("\n");
        // Generating HTML markup for the checklist
        const checklistHTML2 = checklistItems2
          ?.map((item) => `<li><p>${item}</p></li>`)
          .join("");

        return {
          ...course.toJSON(),
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

      res.status(200).json({ courses: modifiedCourses });
    })
    .catch((err) => {
      console.error(`Error in retrieving courses: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
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

// Update a course
exports.updateCourse = (req, res, next) => {
  const courseId = req.params.id;

  console.log(req.body);

  db.course
    .findByPk(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({ message: "Course not found" });
      }
      return course.update({
        name: req.body.name || course.name,
        name_arabic: req.body.name_arabic || course.name_arabic,
        categoryId: req.body.categoryId || course.categoryId,
        amount: req.body.amount || course.amount,
        offerAmount: req.body.offerAmount || course.offerAmount,
        description: req.body.description || course.description,
        description_ar: req.body.description_ar || course.description_ar,
        imageUrl: req.file ? `${req.file.filename}` : course.imageUrl,
      });
    })
    .then((updatedCourse) => {
      console.log(`Course with ID ${courseId} updated successfully`);
      res.status(200).send({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    })
    .catch((err) => {
      console.error(`Error in updating course: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a course
exports.deleteCourse = (req, res, next) => {
  const courseId = req.params.id;
  db.course
    .findByPk(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({ message: "Course not found" });
      }
      return course.destroy();
    })
    .then(() => {
      console.log(`Course with ID ${courseId} deleted successfully`);
      res.status(200).send({ message: "Course deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting course: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

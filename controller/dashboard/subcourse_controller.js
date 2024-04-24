const db = require("../../models");

// Create a new subcourse
exports.addSubCourse = (req, res, next) => {
  db.subcourse
    .create({
      name: req.body.name,
      courseId: req.body.courseId,
    })
    .then((result) => {
      console.log(`A subcourse added successfully`);
      res.status(200).send({ message: "Subcourse added successfully", subcourse: result });
    })
    .catch((err) => {
      console.error(`Error in adding subcourse: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all subcourses
// exports.getAllSubCourses = (req, res, next) => {
//   db.subcourse
//     .findAll()
//     .then((subcourses) => {
//       console.log(`Retrieved all subcourses successfully`);
//       res.status(200).send({ subcourses });
//     })
//     .catch((err) => {
//       console.error(`Error in retrieving subcourses: ${err.toString()}`);
//       res.status(500).send({ message: err.toString() });
//     });
// };

exports.getAllSubCourses = (req, res, next) => {
  db.subcourse
    .findAll({
      include: {
        model: db.course, // Assuming your Course model is named 'course' in your Sequelize instance
        attributes: ['name'], // Only retrieve the 'name' attribute from the Course model
      },
    })
    .then((subcourses) => {
      console.log(`Retrieved all subcourses successfully`);

      // Manipulating the response to have course_name instead of course object
      const modifiedSubcourses = subcourses.map(subcourse => ({
        ...subcourse.toJSON(),
        course_name: subcourse.course ? subcourse.course.name : null,
      }));

      // Remove the nested course object
      modifiedSubcourses.forEach(subcourse => {
        delete subcourse.course;
      });

      res.status(200).json({ subcourses: modifiedSubcourses });
    })
    .catch((err) => {
      console.error(`Error in retrieving subcourses: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};


// Retrieve a single subcourse by ID
exports.getSubCourseById = (req, res, next) => {
  const subCourseId = req.params.id;
  db.subcourse
    .findByPk(subCourseId)
    .then((subcourse) => {
      if (!subcourse) {
        return res.status(404).send({ message: "Subcourse not found" });
      }
      console.log(`Retrieved subcourse with ID ${subCourseId} successfully`);
      res.status(200).send({ subcourse });
    })
    .catch((err) => {
      console.error(`Error in retrieving subcourse: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Update a subcourse
exports.updateSubCourse = (req, res, next) => {
  const subCourseId = req.params.id;
  db.subcourse
    .findByPk(subCourseId)
    .then((subcourse) => {
      if (!subcourse) {
        return res.status(404).send({ message: "Subcourse not found" });
      }
      return subcourse.update({
        name: req.body.name || subcourse.name,
        courseId: req.body.courseId || subcourse.courseId,
      });
    })
    .then((updatedSubCourse) => {
      console.log(`Subcourse with ID ${subCourseId} updated successfully`);
      res.status(200).send({ message: "Subcourse updated successfully", subcourse: updatedSubCourse });
    })
    .catch((err) => {
      console.error(`Error in updating subcourse: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a subcourse
exports.deleteSubCourse = (req, res, next) => {
  const subCourseId = req.params.id;
  db.subcourse
    .findByPk(subCourseId)
    .then((subcourse) => {
      if (!subcourse) {
        return res.status(404).send({ message: "Subcourse not found" });
      }
      return subcourse.destroy();
    })
    .then(() => {
      console.log(`Subcourse with ID ${subCourseId} deleted successfully`);
      res.status(200).send({ message: "Subcourse deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting subcourse: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};
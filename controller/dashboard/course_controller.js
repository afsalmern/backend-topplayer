const db = require("../../models");

// Create a new course
exports.addCourse = (req, res, next) => {
  db.course
    .create({
      name: req.body.name,
      categoryId: req.body.categoryId,
      amount: req.body.amount,
    })
    .then((result) => {
      console.log(`A course added successfully`);
      res.status(200).send({ message: "Course added successfully", course: result });
    })
    .catch((err) => {
      console.error(`Error in adding course: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all courses
exports.getAllCourses = (req, res, next) => {
  db.course
    .findAll()
    .then((courses) => {
      console.log(`Retrieved all courses successfully`);
      res.status(200).json({ courses });
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
  db.course
    .findByPk(courseId)
    .then((course) => {
      if (!course) {
        return res.status(404).send({ message: "Course not found" });
      }
      return course.update({
        name: req.body.name || course.name,
        categoryId: req.body.categoryId || course.categoryId,
        amount: req.body.amount || course.amount,
      });
    })
    .then((updatedCourse) => {
      console.log(`Course with ID ${courseId} updated successfully`);
      res.status(200).send({ message: "Course updated successfully", course: updatedCourse });
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

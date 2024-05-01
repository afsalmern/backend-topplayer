const db = require("../../models");
const Testimonial = db.testimonial;

// Add a new Testimonial
exports.addTestimonial = (req, res, next) => {
  Testimonial.create({
    rating: req.body.rating,
    comment_en: req.body.comment_en,
    comment_ar: req.body.comment_ar,
    user_name: req.body.user_name,
    user_role: req.body.user_role,
    courseId: req.body.courseId,
  })
    .then((result) => {
      console.log(`A testimonial added successfully`);
      res.status(200).send({
        message: "Testimonial added successfully",
        testimonial: result,
      });
    })
    .catch((err) => {
      console.error(`Error in adding testimonial: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve all Testimonials
exports.getAllTestimonials = (req, res, next) => {
  Testimonial.findAll()
    .then((testimonials) => {
      console.log(`Retrieved all testimonials successfully`);
      res.status(200).send({ testimonials });
    })
    .catch((err) => {
      console.error(`Error in retrieving testimonials: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Retrieve a single Testimonial by ID
// exports.getTestimonialById = (req, res, next) => {
//   const testimonialId = req.params.id;
//   Testimonial.findByPk(testimonialId)
//     .then((testimonial) => {
//       if (!testimonial) {
//         return res.status(404).send({ message: "Testimonial not found" });
//       }
//       console.log(
//         `Retrieved testimonial with ID ${testimonialId} successfully`
//       );
//       res.status(200).send({ testimonial });
//     })
//     .catch((err) => {
//       console.error(`Error in retrieving testimonial: ${err.toString()}`);
//       res.status(500).send({ message: err.toString() });
//     });
// };

exports.getTestimonialById = (req, res, next) => {
  const testimonialId = req.params.id;
  Testimonial.findByPk(testimonialId)
    .then((testimonial) => {
      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial not found" });
      }

      let role;
      // Manipulate the course name string to set the role
      const courseName = testimonial.courseName.replace(" program", "");

      // Append "student" to the modified course name
      role = `${courseName} student`;

      console.log(`Retrieved testimonial with ID ${testimonialId} successfully`);
      // Append the role to the testimonial object
      testimonial.role = role;
      
      res.status(200).send({ testimonial });
    })
    .catch((err) => {
      console.error(`Error in retrieving testimonial: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};


// Update a Testimonial
exports.updateTestimonial = (req, res, next) => {
  const testimonialId = req.params.id;
  Testimonial.findByPk(testimonialId)
    .then((testimonial) => {
      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial not found" });
      }
      return testimonial.update({
        rating: req.body.rating || testimonial.rating,
        comment_en: req.body.comment_en || testimonial.comment_en,
        comment_ar: req.body.comment_ar || testimonial.comment_ar,
        user_name: req.body.user_name || testimonial.user_name,
        user_role: req.body.user_role || testimonial.user_role,
        courseId: req.body.user_role || testimonial.courseId,
      });
    })
    .then((updatedTestimonial) => {
      console.log(`Testimonial with ID ${testimonialId} updated successfully`);
      res.status(200).send({
        message: "Testimonial updated successfully",
        testimonial: updatedTestimonial,
      });
    })
    .catch((err) => {
      console.error(`Error in updating testimonial: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

// Delete a Testimonial
exports.deleteTestimonial = (req, res, next) => {
  const testimonialId = req.params.id;
  Testimonial.findByPk(testimonialId)
    .then((testimonial) => {
      if (!testimonial) {
        return res.status(404).send({ message: "Testimonial not found" });
      }
      return testimonial.destroy();
    })
    .then(() => {
      console.log(`Testimonial with ID ${testimonialId} deleted successfully`);
      res.status(200).send({ message: "Testimonial deleted successfully" });
    })
    .catch((err) => {
      console.error(`Error in deleting testimonial: ${err.toString()}`);
      res.status(500).send({ message: err.toString() });
    });
};

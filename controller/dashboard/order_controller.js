const db = require("../../models");
const { Op } = require("sequelize");

// exports.getAllorders = async (req, res) => {
//   try {
//     let orders = await db.registeredCourse.findAll({
//       include: [
//         { model: db.user, as: "user", attributes: ["id", "username", "email"] },
//         {
//           model: db.course,
//           as: "course",
//           attributes: ["id", "name", "amount", "offerAmount", "duration"], // Include 'duration' attribute
//           include: [
//             {
//               model: db.payment,
//               as: "payments",
//               attributes: ["amount", "stripeId"],
//             },
//             {
//               model: db.category,
//               attributes: ["id", "name"],
//             },
//           ],
//         },
//       ],
//       order: [["createdAt", "DESC"]],
//     });

//     // Calculate subscription end date for each order based on course duration
//     orders = orders.map((order) => {
//       const startDate = new Date(order.createdAt);
//       const endDate = new Date(startDate);
//       endDate.setMonth(endDate.getMonth() + order.course.duration); // Add course duration in months
//       const currentDate = new Date();
//       const remainingTime = endDate - currentDate;
//       const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
//       order.subscriptionEndDate = endDate;
//       order.remainingDays = remainingDays;
//       return order;
//     });

//     // Extracting only necessary data for response
//     const formattedOrders = orders.map((order) => ({
//       course_registration_id: order.id,
//       user: order.user,
//       course: order.course,
//       subscriptionStartDate: order.createdAt,
//       subscriptionEndDate: order.subscriptionEndDate,
//       remainingDays: order.remainingDays,
//     }));

//     res.status(200).json({ orders: formattedOrders });
//   } catch (error) {
//     console.error(`Error in getting orders: ${error.toString()}`);
//     res.status(500).send({ message: error.toString() });
//   }
// };

exports.getAllorders = async (req, res) => {
  try {
    // Fetch all registered courses
    const registeredCourses = await db.registeredCourse.findAll({
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: db.course,
          as: "course",
          attributes: ["id", "name", "amount", "offerAmount", "duration"],
        },
        {
          model: db.payment,
          as: "payments",
          attributes: ["id", "amount", "stripeId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format the response
    const formattedData = registeredCourses.map((registeredCourse) => ({
      course_registration_id: registeredCourse.id,
      user: {
        id: registeredCourse.user.id,
        username: registeredCourse.user.username,
        email: registeredCourse.user.email,
      },
      course: {
        id: registeredCourse.course.id,
        name: registeredCourse.course.name,
        amount: registeredCourse.course.amount,
        offerAmount: registeredCourse.course.offerAmount,
        duration: registeredCourse.course.duration,
      },
      payments: registeredCourse.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        stripeId: payment.stripeId,
      })),
      subscriptionStartDate: registeredCourse.createdAt,
    }));

    res.status(200).json({ orders: formattedData });
  } catch (error) {
    console.error(`Error in getting orders: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.updateOrderSubscription = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // Update the record in the registered_course table with the given courseId
    await db.registeredCourse.update(
      { createdAt: new Date() }, // Set the createdAt field to the current time
      { where: { id: courseId } } // Specify the condition to match the record with the courseId
    );

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating createdAt field:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

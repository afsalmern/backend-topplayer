const db = require("../../models");
const { Op, Sequelize, where } = require("sequelize");

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

exports.getAllOrders = async (req, res) => {
  try {
    let whereClause = {};
    let { filter, status } = req.params;
    let courseWhereClause = { isDeleted: false };

    if (filter === "course") {
      whereClause = { iscamp: false };
    } else if (filter === "camp") {
      whereClause = { iscamp: true };
    }

    courseWhereClause = {
      ...courseWhereClause,
      id: { [db.Sequelize.Op.ne]: null }, // Ensures courseId is not null
    };

    let orders = await db.registeredCourse.findAll({
      include: [
        {
          model: db.course,
          as: "course",
          attributes: [
            "id",
            "name",
            "amount",
            "offerAmount",
            "duration",
            "isDeleted",
          ], // Include 'duration' attribute
          include: [
            {
              model: db.category,
              attributes: ["id", "name", "iscamp"],
              where: whereClause,
            },
          ],
          where: courseWhereClause,
        },
        {
          model: db.user,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Iterate through each order and fetch payments for the associated user
    for (let order of orders) {
      // Retrieve payments for the user associated with the order
      const payments = await db.payment.findAll({
        where: { userId: order.userId }, // Filter payments by userId
      });
      // Assign payments to the order
      order.payments = payments;
    }

    // Calculate subscription end date for each order based on course duration
    orders = orders.map((order) => {
      const startDate = new Date(order.createdAt);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + order.course.duration); // Add course duration in months
      const currentDate = new Date();
      const remainingTime = endDate - currentDate;
      const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      order.subscriptionEndDate = endDate;
      order.remainingDays = remainingDays;
      return order;
    });

    // Filter orders based on status
    if (status === "expired") {
      orders = orders.filter((order) => order.remainingDays <= 0);
    } else if (status === "active") {
      orders = orders.filter((order) => order.remainingDays > 0);
    }

    // Extracting only necessary data for response
    const formattedOrders = orders.map((order) => ({
      course_registration_id: order.id,
      user: order.user,
      course: order.course,
      payments: order.payments,
      subscriptionStartDate: order.createdAt,
      subscriptionEndDate: order.subscriptionEndDate,
      remainingDays: order.remainingDays,
    }));

    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error(`Error in getting orders: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.getAllRevenues = async (req, res) => {
  try {
    console.log("THIS");
    const { filter, from, to } = req.params;
    let maxFromDate = "2024-06-15";
    const where = {
      userId: {
        [db.Sequelize.Op.ne]: null, // Ensures userId is not null
      },
    };

    if (from !== undefined) {
      if (from < maxFromDate) {
        return res.status(500).json({ message: "Invalid date provided" });
      }
    }

    if (from === undefined) {
      where.createdAt = {
        [Sequelize.Op.gte]: new Date(maxFromDate).toISOString(),
      };
    } else if (from >= maxFromDate) {
      where.createdAt = {
        [Sequelize.Op.gte]: new Date(from).toISOString(),
      };
    }

    if (to !== undefined) {
      console.log("HERE");
      where.createdAt = {
        [Sequelize.Op.between]: [
          new Date(from).toISOString(),
          new Date(
            new Date(to).setDate(new Date(to).getDate() + 1)
          ).toISOString(),
        ],
      };
    }

    let whereClause = {
      isDeleted: false,
    };

    if (filter == "camp") {
      whereClause = { isCamp: true, isDeleted: false };
    } else if (filter == "course") {
      whereClause = { isCamp: false, isDeleted: false };
    }

    let orders = await db.payment.findAll({
      include: [
        {
          model: db.course,
          as: "course",
          attributes: [
            "id",
            "name",
            "amount",
            "offerAmount",
            "duration",
            "isDeleted",
          ],
          include: [
            {
              model: db.category,
              attributes: ["id", "name", "isCamp"],
              where: whereClause,
            },
          ],
          where: {
            id: { [Sequelize.Op.not]: null },
          },
        },
        {
          model: db.user,
          as: "users",
          attributes: ["id", "username", "email"],
        },
      ],
      where: where,

      order: [["createdAt", "DESC"]],
    });

    console.log(where);
    console.log(whereClause);

    const formattedOrders = orders.map((order) => ({
      amount: order.amount,
      net_amount: order.net_amount,
      created_at: order.createdAt,
      stripe_fee: order.stripe_fee,
      stripeId: order.stripeId,
      course_name: order.course.name,
      course_amount: order.course.offerAmount,
      course_duration: order.course.duration,
      course_category: order.course.category.name,
      user_id: order.users.id,
      user_username: order.users.username,
      user_email: order.users.email,
    }));

    res.status(200).json({ formattedOrders });
  } catch (error) {
    console.error(`Error in getting orders: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.getAllRevenuesOld = async (req, res) => {
  try {
    let orders = await db.payment.findAll({
      include: [
        {
          model: db.course,
          as: "course",
          attributes: [
            "id",
            "name",
            "amount",
            "offerAmount",
            "duration",
            "isDeleted",
          ], // Include 'duration' attribute
          include: [
            {
              model: db.category,
              attributes: ["id", "name", "iscamp"],
            },
          ],
        },
        {
          model: db.user,
          as: "users",
          attributes: ["id", "username", "email"],
        },
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.lt]: new Date("2024-06-15"), // Filter by createdAt date
        },
        userId: {
          [db.Sequelize.Op.ne]: null, // Ensures userId is not null
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const formattedOrders = orders.map((order) => ({
      amount: order.amount,
      net_amount: order.net_amount,
      stripe_fee: order.stripe_fee,
      stripeId: order.stripeId,
      course_name: order.course.name,
      course_amount: order.course.offerAmount,
      course_duration: order.course.duration,
      course_category: order.course.category.name,
      user_username: order.users.username,
      user_email: order.users.email,
    }));

    res.status(200).json({ formattedOrders });
  } catch (error) {
    console.error(`Error in getting orders: ${error}`);
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

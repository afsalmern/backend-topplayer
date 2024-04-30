const { Sequelize } = require("sequelize");
const db = require("../../models");

exports.getDashboardDetails = async (req, res) => {
  try {
    // Count the total number of registered users
    const registeredUsersCount = await db.user.count();

    // Count the number of unique user IDs from the Course model (active users)
    const activeUsersCount = await db.payment.count({
      distinct: true,
      col: "userId", // Count unique user IDs
    });

    const enrolledUsersPerCourse = await db.payment.findAll({
      attributes: [
        "courseId",
        [
          Sequelize.fn("COUNT", Sequelize.literal('DISTINCT "userId"')),
          "enrolled_users",
        ],
      ],
      include: [
        {
          model: db.course,
          attributes: ["name"],
        },
      ],
      group: ["courseId"],
    });

    const monthlyPaymentCounts = await db.payment.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", "*"), "payment_count"],
      ],
      group: [
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
      ],
    });

    const paymentCounts = await db.payment.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("COUNT", "*"), "payment_count"],
      ],
      group: [Sequelize.fn("YEAR", Sequelize.col("createdAt"))],
    });

    // Send the counts in the response
    res.status(200).json({
      activeUsersCount,
      paymentCounts,
      registeredUsersCount,
      monthlyPaymentCounts,
      enrolledUsersPerCourse,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

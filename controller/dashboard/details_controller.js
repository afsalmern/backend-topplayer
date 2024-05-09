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

    const enrolledUsersPerCourse = await db.registeredCourse.findAll({
      attributes: [
        "courseId",
        [
          Sequelize.fn("COUNT", Sequelize.literal(' "userId"')),
          "enrolled_users",
        ],
      ],
      include: [
        {
          model: db.course,
          attributes: ["name"],
          as: "course",
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

    const recentUsers = await db.user.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      attributes: ["username", "email", "mobile", "createdAt"],
      include: [
        {
          model: db.payment,
          attributes: ["id"],
        },
        {
          model: db.registeredCourse,
          attributes: ["id"],
          include: [
            {
              model: db.course,
              as: "course",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const paymentCounts = await db.payment.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("COUNT", "*"), "payment_count"],
      ],
      group: [Sequelize.fn("YEAR", Sequelize.col("createdAt"))],
    });

    const visitors = await db.visitors.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", "*"), "visitors"],
      ],
      group: [
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
      ],
    });

    const totatlVisitors = await db.visitors.count();

    // Send the counts in the response
    res.status(200).json({
      activeUsersCount,
      paymentCounts,
      registeredUsersCount,
      monthlyPaymentCounts,
      enrolledUsersPerCourse,
      recentUsers,
      visitors,
      totatlVisitors,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

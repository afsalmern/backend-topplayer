const { Sequelize, course } = require("../models");

const getOrders = async (where, whereClause) => {
  const orders = await db.payment.findAll({
    where: where,
    attributes: ["stripe_fee", "net_amount", "createdAt", "amount","fromTamara"],
    include: [
      {
        model: db.course,
        attributes: ["name", "offerAmount"],
        include: {
          model: db.category,
          where: whereClause,
          attributes: ["name"],
        },
        required: true, // Allow courses that have no associated category
      },
      {
        model: db.user,
        as: "users",
        attributes: ["username", "email", "mobile"],
        required: true, // Allow payments that have no associated user
      },
    ],
  });

  const formattedOrders = orders.map((order) => ({
    amount_paid: order.amount,
    net_amount: order.net_amount,
    stripe_fee: order.stripe_fee,
    stripeId: order.stripeId,
    createdAt: order.createdAt,
    isTamara: order.fromTamara,
    course: order.course.name,
    amount: order.course.offerAmount,
    category: order.course.category.name,
    user_name: order.users.username,
    email: order.users.email,
    mobile: order?.users?.mobile,
  }));

  return formattedOrders;
};

const getPayments = async (where, whereClause) => {
  const payments = await db.payment.findAll({
    where: where,
    include: [
      {
        model: db.course,
        attributes: ["name"],
        include: [
          {
            model: db.category,
            where: whereClause,
            attributes: [],
          },
        ],
        where: {
          id: { [Sequelize.Op.not]: null },
          isDeleted: false, // Ensure the course is not null
        },
        required: true, // This ensures that only payments with a course are included
      },
    ],
    attributes: [
      "courseId",
      [
        Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.net_amount)"), 2),
        "totalIncome",
      ],
      [
        Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.amount)"), 2),
        "totalRevenue",
      ],
      [Sequelize.fn("COUNT", Sequelize.col("payment.id")), "numberOfOrders"],
    ],
    group: ["courseId"],
  });

  const formattedItems = payments.map((payment) => ({
    courseName: payment.course.name,
    totalIncome: payment.getDataValue("totalIncome"),
    totalRevenue: payment.getDataValue("totalRevenue"),
    numberOfOrders: payment.getDataValue("numberOfOrders"),
  }));

  return formattedItems;
};

const getEnrolledUsersPerCourse = async (where, whereClause) => {
  const enrolledUsersPerCourse = await db.payment.findAll({
    where: where,
    attributes: [
      "courseId",
      [
        Sequelize.fn("ROUND", Sequelize.literal("SUM(payment.net_amount)"), 2),
        "revenue",
      ],
      [Sequelize.fn("COUNT", Sequelize.literal("payment.id")), "orders"],
    ],
    include: [
      {
        model: db.course,
        attributes: ["name"],
        as: "course",
        include: [
          {
            model: db.category,
            where: whereClause,
            attributes: [],
          },
        ],
        where: {
          id: { [Sequelize.Op.not]: null },
          isDeleted: false, // Ensure the course is not null
        },
        required: true, // This ensures that only payments with a course are included
      },
    ],
    group: ["courseId"],
  });

  return enrolledUsersPerCourse;
};

module.exports = {
  getOrders,
  getPayments,
  getEnrolledUsersPerCourse,
};

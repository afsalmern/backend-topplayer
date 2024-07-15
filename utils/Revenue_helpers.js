const { Sequelize } = require("../models");

const combinePaymentData = async (payments, paymentsTamara) => {
  const combined = {};

  // Combine payments data
  payments.forEach((payment) => {
    const { name } = payment.course;
    if (!combined[name]) {
      combined[name] = {
        courseName: name,
        totalIncome: 0,
        totalRevenue: 0,
        numberOfOrders: 0,
      };
    }
    combined[name].totalIncome += payment.getDataValue("totalIncome");
    combined[name].totalRevenue += payment.getDataValue("totalRevenue");
    combined[name].numberOfOrders += payment.getDataValue("numberOfOrders");
  });

  // Combine paymentsTamara data
  paymentsTamara.forEach((payment) => {
    const { name } = payment.course;
    if (!combined[name]) {
      combined[name] = {
        courseName: name,
        totalIncome: 0,
        totalRevenue: 0,
        numberOfOrders: 0,
      };
    }
    combined[name].totalIncome += payment.getDataValue("totalIncome");
    combined[name].totalRevenue += payment.getDataValue("totalRevenue");
    combined[name].numberOfOrders += payment.getDataValue("numberOfOrders");
  });

  // Convert the combined object to an array
  return Object.values(combined);
};

const getOrders = async (where, whereClause) => {
  const orders = await db.payment.findAll({
    where: where,
    attributes: ["stripe_fee", "net_amount", "createdAt", "amount"],
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
  return orders;
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

  return payments;
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

const getTamaraPayments = async (where, whereClause) => {
  const paymentsTamara = await db.tamaraPayment.findAll({
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
        Sequelize.fn(
          "ROUND",
          Sequelize.literal("SUM(tamara_payment.amount)"),
          2
        ),
        "totalRevenue",
      ],
      [
        Sequelize.fn(
          "ROUND",
          Sequelize.literal("SUM(tamara_payment.amount)"),
          2
        ),
        "totalIncome",
      ],
      [
        Sequelize.fn("COUNT", Sequelize.col("tamara_payment.id")),
        "numberOfOrders",
      ],
    ],
    group: ["courseId"],
  });

  return paymentsTamara;
};

const getTamaraOrders = async (where, whereClause) => {
  const tamraOrders = await db.tamaraPayment.findAll({
    where: where,
    include: [
      {
        model: db.course,
        attributes: ["name", "offerAmount"],
        include: {
          model: db.category,
          where: whereClause,
          attributes: ["name"],
        },
        where: {
          id: { [Sequelize.Op.not]: null },
          isDeleted: false, // Ensure the course is not null
        },
        required: true, // This ensures that only payments with a course are included
      },
      {
        model: db.user,
        attributes: ["username", "email", "mobile"],
        required: true, // Allow payments that have no associated user
      },
    ],
  });

  return tamraOrders;
};

module.exports = {
  combinePaymentData,
  getOrders,
  getPayments,
  getEnrolledUsersPerCourse,
  getTamaraPayments,
  getTamaraOrders,
};

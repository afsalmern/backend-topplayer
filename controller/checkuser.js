const db = require("../models");

exports.checkUsersWhoDontHavePurchase = async () => {
  try {
    const today = new Date();
    const previous7Days = new Date(today.setDate(today.getDate() - 7)); // 7 days ago from today

    const startDate = previous7Days.toISOString().split("T")[0]; // Start date in ISO format (YYYY-MM-DD)
    const endDate = today.toISOString().split("T")[0]; // End date in ISO format (YYYY-MM-DD)

    const users = await db.user.findAll({
      include: [
        {
          model: db.payment,
          required: false,
          where: { userId: null, createdAt: { [db.Op.between]: [startDate, endDate] } },
        },
      ],
    });

    console.log("Users who don't have a purchase in the last 7 days:", JSON.stringify(users, null, 2));
    

  } catch (err) {
    console.error(`Error in fetching users: ${err.toString()}`);
  }
};

const db = require("../models");
const { SendNotPurchaseMails } = require("../services/emailService");

exports.checkUsersWhoDontHavePurchase = async () => {
  try {
    const today = new Date();
    const previous7Days = new Date();
    previous7Days.setDate(today.getDate() - 7); // Adjusted for clarity

    const users = await db.user.findAll({
      attributes: ["username", "email"],
      include: [
        {
          model: db.payment,
          required: false,
          attributes: [],
          where: {
            createdAt: { [db.Op.between]: [previous7Days, today] },
          },
        },
      ],
      raw: true,
    });

    if (!users || users.length === 0) {
      console.log("No users found without purchases in the last 7 days.");
      return;
    }

    console.log("Users who don't have a purchase in the last 7 days:", JSON.stringify(users, null, 2));
    SendNotPurchaseMails(users);
  } catch (err) {
    console.error(`Error in fetching users: ${err.message}`, err.stack);
  }
};

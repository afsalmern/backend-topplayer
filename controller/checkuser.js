const db = require("../models");
const { SendNotPurchaseMails } = require("../services/emailService");

exports.checkUsersWhoDontHavePurchase = async () => {
  try {
    const today = new Date();
    const previous7Days = new Date();
    previous7Days.setDate(today.getDate() - 7); // Adjusted for clarity

    const users = await db.user.findAll({
      attributes: ["username", "email"],
      where: {
        createdAt: { [db.Op.between]: [previous7Days, today] }, // Users created in the date range
        verified: true, // Only verified users
      },
      include: [
        {
          model: db.payment,
          required: false, // Left join to include users even if they have no payments
          attributes: [], // Do not select any fields from payments, as we only need the count
        },
      ],
      group: ["user.id"], // Group by user.id to aggregate payments
      having: db.Sequelize.literal("COUNT(`payments`.`id`) = 0"), // Filter users without any payments
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

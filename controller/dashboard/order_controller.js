const db = require("../../models");
exports.getAllorders = async (req, res) => {
  try {
    let orders = await db.registeredCourse.findAll({
      include: [
        { model: db.user, as: "user", attributes: ["id", "username", "email"] },
        {
          model: db.course,
          as: "course",
          attributes: ["id", "name", "amount", "offerAmount", "imageUrl"],
          include: [
            {
              model: db.payment,
              as: "payments",
              attributes: ["amount", "stripeId"],
            },
            {
              model: db.category,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(`Error in adding course: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

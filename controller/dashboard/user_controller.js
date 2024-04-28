const db = require("../../models");

const UserDb = db.user;

exports.getAllusers = async (req, res) => {
  try {
    const users = await UserDb.findAll({
      attributes: {
        exclude: ["updatedAt", "password", "bio", "verification_code"],
      },
      include: [
        {
          model: db.course,
        },
        {
          model: db.payment,
        },
      ],
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error(`Error in retrieving users: ${error.toString()}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id, value } = req.body;

    const user = await UserDb.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verified = value;
    await user.save();

    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    console.error(`Error in updating user status: ${error.toString()}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

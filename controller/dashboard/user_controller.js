const { where, Sequelize, literal } = require("sequelize");

const db = require("../../models");

const UserDb = db.user;

exports.getAllusers = async (req, res) => {
  try {
    let users;

    const { filter } = req.params;
    const Allusers = await UserDb.findAll({
      attributes: {
        exclude: ["updatedAt", "password", "bio", "verification_code"],
      },
      include: [
        {
          model: db.course,
          attributes: ["id", "name", "categoryId"],
        },
        {
          model: db.device,
          attributes: ["id", "deviceID", "userId"],
        },
        {
          model: db.payment,
          attributes: ["id"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (filter == "paid") {
      users = Allusers.filter((user) => user.payments.length > 0);
    } else if (filter == "notpaid") {
      users = Allusers.filter((user) => user.payments.length === 0);
    } else {
      users = Allusers;
    }

    const maxDeviceCountinDb = await db.user.findOne({
      attributes: [
        "deviceCount",
        [Sequelize.fn("COUNT", Sequelize.col("deviceCount")), "count"],
      ],
      group: ["deviceCount"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: 1,
    });

    res.status(200).json({ users, maxDeviceCountinDb });
  } catch (error) {
    console.error(`Error in retrieving users: ${error.toString()}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDeviceCountGlobally = async (req, res) => {
  try {
    const { value } = req.body;

    if (value < 2) {
      return res.status(400).json({ message: "Invalid operation" });
    }
    const result = await db.user.update(
      { deviceCount: value }, // Set deviceCount to the provided count
      { where: {} } // Empty where clause updates all records
    );

    // Check if any records were updated
    if (result[0] > 0) {
      return res.status(200).json({ message: "Updated successfully" });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.log(error);
    console.error(`Error in updating user status: ${error.toString()}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateDeviceCount = async (req, res) => {
  try {
    const { userId, count } = req.body;

    console.log(typeof count);

    if (count < 2) {
      return res.status(400).json({ message: "Invalid operation" });
    }
    const user = await UserDb.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const maxDeviceCount = user.deviceCount;

    if (maxDeviceCount === count) {
      return res.status(400).json({ message: "Updation successfully" });
    }

    user.deviceCount = parseInt(count);
    await user.save();
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    console.error(`Error in updating user status: ${error.toString()}`);
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

exports.manageUser = async (req, res) => {
  try {
    const { type, id } = req.body;

    // Define actions for each type of request
    const actions = {
      enable: async () => {
        const { active } = req.body;
        await db.user.update({ verified: active }, { where: { id: id } });
        return { message: "User status changed successfully" };
      },
      active: async () => {
        const { status } = req.body;
        await db.user.update({ status }, { where: { id: id } });
        return { message: "User status changed successfully" };
      },
      devices: async () => {
        const { filteredDeviceIds } = req.body;
        const deviceIds = filteredDeviceIds.map((item) => item.id);
        console.log(deviceIds);
        await db.device.destroy({ where: { id: deviceIds } });
        return { message: "Devices removed successfully" };
      },
      "new courses added": async () => {
        const { course } = req.body;
        const courseIds = course.map((item) => item.id);
        await db.registeredCourse.create({ courseId: courseIds, userId: id });
        return { message: "New course added successfully" };
      },
      "courses removed": async () => {
        const { course } = req.body;
        const courseIds = course.map((item) => item.id);
        await db.registeredCourse.destroy({
          where: { courseId: courseIds, userId: id },
        });
        return { message: "Course removed successfully" };
      },
    };

    // Execute the action based on the type of request
    const action = actions[type];
    if (!action) {
      throw new Error("Invalid request type");
    }
    const result = await action();

    // Send response
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error in updating user status: ${error.toString()}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

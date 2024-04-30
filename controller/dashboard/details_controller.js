const db = require("../../models");

exports.getDashboardDetails = async (req, res) => {
  try {
    // Count the total number of registered users
    const registeredUsersCount = await db.user.count();

    // Count the number of unique user IDs from the Course model (active users)
    const activeUsersCount = await db.course.count({
      distinct: true,
      col: "userId", // Count unique user IDs
    });

    const data = [
      {
        label: "Registered Users",
        color: "#4fc6e1",
        count: registeredUsersCount,
      },
      { label: "Active Users", color: "#ebeff2", count: activeUsersCount },
    ];

    // Send the counts in the response
    res.status(200).json({ data });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

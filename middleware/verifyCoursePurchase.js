const db = require("../models");

exports.checkIsPurchased = async (req, res, next) => {
  const { week, courseId, day } = req.params;

  // Parse week and day only once
  const weekNum = parseInt(week);
  const dayNum = parseInt(day);

  // Helper function to check if the subscription is expired
  const isSubscriptionExpired = (createdAt, duration) => {
    const subscriptionEndDate = new Date(createdAt);
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + duration);
    return new Date() > subscriptionEndDate;
  };

  try {
    // Check if the course is free and allow first day of first week
    // if (courseId == process.env.FREE_COURSE_ID && weekNum === 1 && dayNum === 1) {
    //   return next();
    // }

    if (weekNum === 1 && dayNum === 1) {
      return next();
    }

    // Fetch registered course with course and user info
    const registeredCourse = await db.registeredCourse.findOne({
      where: { courseId, userId: req.userDecodeId },
      include: { model: db.course, as: "course" },
    });

    // Handle free course access when user is not registered
    // if (!registeredCourse) {
    //   if (courseId == process.env.FREE_COURSE_ID && (weekNum > 1 || dayNum > 1)) {
    //     return res.status(403).json({ message: "You have not purchased this course" });
    //   } else if (courseId != process.env.FREE_COURSE_ID) {
    //     return res.status(403).json({ message: "You have not purchased this course" });
    //   }
    // }

    if (!registeredCourse) {
      if (weekNum > 1 || dayNum > 1) {
        return res.status(403).json({ message: "You have not purchased this course" });
      }
    }

    // Check if subscription has expired
    if (registeredCourse && isSubscriptionExpired(registeredCourse.createdAt, registeredCourse.course.duration)) {
      return res.status(403).json({ message: "Your subscription has expired" });
    }

    // All checks passed, proceed
    return next();
  } catch (error) {
    console.error("checkIsPurchased error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

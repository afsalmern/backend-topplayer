const db = require("../models");

const getCommissionBreakdowns = async (userDecodeId) => {
  try {
    const commisionsData = await db.InfluencerCommisions.findAll({
      attributes: ["id", "commision_amount", "influencer_id", "coupon_id", "createdAt"],
      required: true,
      where: {
        influencer_id: userDecodeId,
      },
      include: [
        {
          model: db.influencer,
          attributes: ["id", "coupon_code"],
          as: "influencer",
          required: true,
          include: [
            {
              model: db.influencerPersons,
              attributes: ["id", "name"],
              required: true,
              through: {
                attributes: [],
              },
            },
          ],
        },
        {
          model: db.payment,
          as: "payment",
          attributes: ["id", "courseId"],
          required: true,
          include: [
            {
              model: db.course,
              attributes: ["name"],
              required: true,
            },
            {
              model: db.user,
              attributes: ["username"],
              as: "users",
              required: true,
            },
          ],
        },
      ],
      group: ["influencer_commisions.id", "influencer.id", "influencer->influencer_persons.id", "payment.id", "payment->course.id"], // Grouping to avoid duplication
      limit: 6,
      subQuery: false,
      order: [["createdAt", "DESC"]],
    });

    return commisionsData;
  } catch (error) {
    console.log("Error in getting commission breakdowns data");
    throw error;
  }
};

const getCouponStats = async (userDecodeId) => {
  try {
    const couponStats = await db.sequelize.query(
      `
    SELECT 
    c.coupon_id,
    i.coupon_code,
    COUNT(c.id) AS total_uses
FROM influencer_commisions c
JOIN influencers i ON c.coupon_id = i.id
WHERE c.influencer_id = :influencerId
GROUP BY c.coupon_id, i.coupon_code
ORDER BY total_uses DESC;

      `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    return couponStats;
  } catch (error) {
    console.log("Error in getting coupon stats data");
    throw error;
  }
};

const getCouponSales = async (userDecodeId) => {
  try {
    const couponSales = await db.sequelize.query(
      `
         SELECT 
        c.coupon_id,
        i.coupon_code,
        SUM(c.commision_amount) AS total_sales
    FROM influencer_commisions c
    JOIN influencers i ON c.coupon_id = i.id
    WHERE c.influencer_id = :influencerId
    GROUP BY c.coupon_id, i.coupon_code
    ORDER BY total_sales DESC;
    
    
          `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    return couponSales;
  } catch (error) {
    console.log("Error in getting coupon stats data");
    throw error;
  }
};

const getOrderCounts = async (userDecodeId) => {
  try {
    const orderCounts = await db.sequelize.query(
      `SELECT 
      c.id AS coupon_id,
      c.coupon_code AS coupon_name,
      COUNT(ic.payment_id) AS total_uses,  -- Number of times the coupon was used
      SUM(ic.total_amount) AS total_sales, -- Total sales generated using this coupon
      SUM(ic.commision_amount) AS total_commission, -- Total commission given for this coupon
      SUM(ic.net_amount) AS total_net_amount -- Total net amount after deductions
  FROM influencer_commisions ic
  JOIN influencers c ON ic.coupon_id = c.id
  WHERE ic.influencer_id = :influencerId
  GROUP BY c.id, c.coupon_code;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    return orderCounts;
  } catch (error) {
    console.log("Error in getting order counts data");
    throw error;
  }
};

const getSalesDataMonthly = async (userDecodeId) => {
  try {
    const monthlyData = await db.sequelize.query(
      `
-- Query for all months with zeros for months without data
WITH months AS (
    SELECT 1 as month_num, 'January' as month_name UNION ALL
    SELECT 2, 'February' UNION ALL
    SELECT 3, 'March' UNION ALL
    SELECT 4, 'April' UNION ALL
    SELECT 5, 'May' UNION ALL
    SELECT 6, 'June' UNION ALL
    SELECT 7, 'July' UNION ALL
    SELECT 8, 'August' UNION ALL
    SELECT 9, 'September' UNION ALL
    SELECT 10, 'October' UNION ALL
    SELECT 11, 'November' UNION ALL
    SELECT 12, 'December'
)
SELECT 
    m.month_num,
    m.month_name,
    COALESCE(SUM(ic.commision_amount), 0) as total_commission,
    COALESCE(COUNT(ic.id), 0) as order_count
FROM 
    months m
LEFT JOIN 
    influencer_commisions ic ON MONTH(ic.createdAt) = m.month_num 
                             AND YEAR(ic.createdAt) = YEAR(CURDATE())
                             AND ic.influencer_id = :influencerId
GROUP BY 
    m.month_num, m.month_name
ORDER BY 
    m.month_num;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    const labels = monthlyData?.map((data) => data.month_name.slice(0, 3));
    const revenue = monthlyData?.map((data) => data.total_commission);
    const sales = monthlyData?.map((data) => data.order_count);

    const result = {
      labels,
      revenue,
      sales,
    };

    return result;
  } catch (error) {
    console.log("Error getting daily data");
    throw error;
  }
};

const getSalesDataWeekly = async (userDecodeId) => {
  try {
    const weeklyData = await db.sequelize.query(
      `
            WITH weeks AS (
    SELECT 1 AS week_num UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5
),
week_data AS (
    SELECT 
        CASE 
            WHEN DAY(ic.createdAt) BETWEEN 1 AND 7 THEN 1
            WHEN DAY(ic.createdAt) BETWEEN 8 AND 14 THEN 2
            WHEN DAY(ic.createdAt) BETWEEN 15 AND 21 THEN 3
            WHEN DAY(ic.createdAt) BETWEEN 22 AND 28 THEN 4
            ELSE 5
        END AS week_num,
        SUM(ic.commision_amount) AS revenue,
        COUNT(ic.id) AS sales
    FROM influencer_commisions ic
    WHERE 
        influencer_id = :influencerId
        AND MONTH(ic.createdAt) = MONTH(CURDATE())
        AND YEAR(ic.createdAt) = YEAR(CURDATE())
    GROUP BY week_num
),
max_week AS (
    SELECT 
        CASE 
            WHEN DAY(LAST_DAY(CURDATE())) <= 28 THEN 4
            ELSE 5
        END AS week_count
),
combined AS (
    SELECT 
        w.week_num,
        COALESCE(wd.revenue, 0) AS revenue,
        COALESCE(wd.sales, 0) AS sales
    FROM weeks w
    JOIN max_week mw ON w.week_num <= mw.week_count
    LEFT JOIN week_data wd ON w.week_num = wd.week_num
    ORDER BY w.week_num
)
SELECT JSON_OBJECT(
    'labels', JSON_ARRAYAGG(CONCAT('week', week_num)),
    'revenue', JSON_ARRAYAGG(revenue),
    'sales', JSON_ARRAYAGG(sales)
) AS weekly
FROM combined;

            `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    return weeklyData;
  } catch (error) {
    console.log("Error getting daily data");
    throw error;
  }
};

const getSalesDataToday = async (userDecodeId) => {
  try {
    const dailyData = await db.sequelize.query(
      `
     WITH hours AS (
  SELECT 0 AS hour_start UNION ALL
  SELECT 2 UNION ALL
  SELECT 4 UNION ALL
  SELECT 6 UNION ALL
  SELECT 8 UNION ALL
  SELECT 10 UNION ALL
  SELECT 12 UNION ALL
  SELECT 14 UNION ALL
  SELECT 16 UNION ALL
  SELECT 18 UNION ALL
  SELECT 20 UNION ALL
  SELECT 22
),
today_data AS (
  SELECT 
    FLOOR(HOUR(createdAt) / 2) * 2 AS hour_slot,
    SUM(commision_amount) AS revenue,
    COUNT(id) AS sales
  FROM influencer_commisions
  WHERE 
    influencer_id = :influencerId
    AND DATE(createdAt) = CURDATE()
  GROUP BY hour_slot
),
combined AS (
  SELECT 
    h.hour_start,
    COALESCE(td.revenue, 0) AS revenue,
    COALESCE(td.sales, 0) AS sales
  FROM hours h
  LEFT JOIN today_data td ON h.hour_start = td.hour_slot
  ORDER BY h.hour_start
)
SELECT JSON_OBJECT(
  'labels', JSON_ARRAYAGG(DATE_FORMAT(STR_TO_DATE(hour_start, '%H'), '%l:%i %p')),
  'revenue', JSON_ARRAYAGG(revenue),
  'sales', JSON_ARRAYAGG(sales)
) AS today
FROM combined;

     `,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: userDecodeId },
      }
    );

    return dailyData;
  } catch (error) {
    console.log("Error getting daily data");
    throw error;
  }
};

module.exports = {
  getCommissionBreakdowns,
  getCouponStats,
  getCouponSales,
  getOrderCounts,
  getSalesDataMonthly,
  getSalesDataWeekly,
  getSalesDataToday,
};

// const filterData: any = {
//   today: {
//     labels: ["12.00 AM",.........],
//     revenue: [28,......],
//     sales: [4, ..........],
//   },
//   monthly: {
//     labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
//     revenue: [340, 290, 360, 320, 470, 510, 390],
//     sales: [15, 12, 17, 14, 21, 25, 19],
//   },
//   weekly: {
//     labels: ["week1","week2","week3","week4"],
//     revenue: [440, 505, 414, 671],
//     sales: [23, 42, 35, 27],
//   },
// };

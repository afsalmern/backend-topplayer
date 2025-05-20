const {
  getCardData,
  getUserPieData,
  getOrdersPieData,
  getEnrollDataPie,
  getSalesDataCountyWise,
  getInfluencerSales,
  getRecentOrders,
  getCouponUses,
  getPaymentWiseData,
  getVisitorsData,
  getMonthlyRevenuesAndOrders,
  getWeeklyRevenuesAndOrders,
  getDailyRevenuesAndOrders,
} = require("../../helpers/admin_dashboard_helper");

exports.dashboardDetails = async (req, res) => {
  try {
    const [
      cardDatas,
      usersPieData,
      ordersPieData,
      enrollDataPie,
      salesDataCountyWise,
      influencerSales,
      recentOrders,
      couponUses,
      paymentMethodWiseData,
      visitorData,
    ] = await Promise.all([
      getCardData(),
      getUserPieData(),
      getOrdersPieData(),
      getEnrollDataPie(),
      getSalesDataCountyWise(),
      getInfluencerSales(),
      getRecentOrders(),
      getCouponUses(),
      getPaymentWiseData(),
      getVisitorsData(),
    ]);

    console.log(cardDatas)

    res.status(200).json({
      cardData: cardDatas,
      usersPieData: { ...usersPieData, total: cardDatas.totalUsers || 0 },
      ordersPieData: { ...ordersPieData, total: cardDatas.totalOrders || 0 },
      enrollDataPie: { ...enrollDataPie, total: cardDatas.totalOrders || 0 },
      salesDataCountyWise,
      influencerSales,
      recentOrders,
      couponUses,
      paymentMethodWiseData,
      visitorData,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRevenues = async (req, res) => {
  const { filter_type } = req.query;

  let salesData = [];

  const dummmyData = {
    today: {
      labels: ["12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"],
      orders: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
      orders: [10, 0, 15, 8, 3],
      revenue: [500.0, 0, 2500.75, 1200.5, 300.25],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      orders: [5, 10, 0, 3, 15, 7, 0, 2, 8, 4, 1, 0],
      revenues: [1000.0, 2000.5, 0, 600.75, 3000.25, 1500.0, 0, 400.5, 1800.75, 900.25, 200.0, 0],
    },
  };

  try {
    switch (filter_type) {
      case "today":
        const dailyData = await getDailyRevenuesAndOrders();
        salesData = dailyData[0]?.today;
        // salesData = dummmyData.today;
        break;
      case "weekly":
        const weeklyData = await getWeeklyRevenuesAndOrders();
        salesData = weeklyData[0]?.weekly;
        // salesData = dummmyData.weekly;
        break;
      case "monthly":
        const monthlyData = await getMonthlyRevenuesAndOrders();
        salesData = monthlyData[0]?.monthly;
        // salesData = dummmyData.monthly;
        break;
      default:
        return [];
    }

    return res.status(200).json({
      salesData,
    });
  } catch (error) {
    console.error("Error getting dashboard data for influencers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const { getCardData, getUserPieData, getOrdersPieData, getEnrollDataPie, getSalesDataCountyWise } = require("../../helpers/admin_dashboard_helper");

exports.dashboardDetails = async (req, res) => {
  try {
    const cardDatas = await getCardData();
    const usersPieData = await getUserPieData();
    const ordersPieData = await getOrdersPieData();
    const enrollDataPie = await getEnrollDataPie();
    const salesDataCountyWise = await getSalesDataCountyWise();

    res.status(200).json({
      cardData: cardDatas,
      usersPieData: { ...usersPieData, total: cardDatas?.totalUsers },
      ordersPieData: { ...ordersPieData, total: cardDatas?.totalOrders },
      enrollDataPie: { ...enrollDataPie, total: cardDatas?.totalOrders },
      salesDataCountyWise,
    });
  } catch (error) {
    console.error(`Error in getting dashboard details: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

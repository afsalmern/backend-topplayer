exports.getPayoutDetailsForInfluencer = async (req, res) => {
  const { id: influencer_id } = req.params;
  try {
    const influencer = await db.influencerPersons.findByPk(influencer_id, {
      attributes: ["id", "name", "email", "phone"],
    });

    if (!influencer) return res.status(404).json({ message: "Influencer person not found" });

    const influencerWhere = {
      influencer_id: influencer_id,
    };

    const payoutDetails = await db.Payouts.findAll({
      attributes: ["id", "remarks", "amount", "status"],
      where: influencerWhere,
      include: [
        {
          model: db.InfluencerCommisions,
          as: "commisions",
          attributes: ["id", "coupon_id"],
          include: [
            {
              model: db.influencer,
              as: "influencer",
              attributes: ["id", "coupon_code"],
            },
          ],
        },
      ],
    });

    const totalCommisions = await db.Payouts.sum("amount", {
      where: influencerWhere,
    });

    res.status(200).json({ payoutDetails, totalCommisions, influencer });
  } catch (error) {
    console.log("error in getting payout details", error);
    res.status(500).send({ message: error.toString() });
  }
};

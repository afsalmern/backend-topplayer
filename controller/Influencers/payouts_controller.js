const { Op } = require("../../models");

exports.getPayoutDetailsForInfluencer = async (req, res) => {
  const { from, to, id: influencer_id, type = "all" } = req.query;

  console.log(req.query);

  const payoutWhere = {
    influencer_id: influencer_id,
  };

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const today = new Date();

    // Check if both dates are the same (YYYY-MM-DD)
    const isSameDay = fromDate.toDateString() === toDate.toDateString();
    const isToToday = toDate.toDateString() === today.toDateString();

    if (isSameDay || isToToday) {
      // Extend toDate to end of day
      toDate.setHours(23, 59, 59, 999);
    }

    payoutWhere.createdAt = {
      [Op.between]: [fromDate, toDate],
    };
  }

  if (type != "all") {
    payoutWhere.type = type;
  }

  console.log("PAYOUT WHERE", payoutWhere);

  try {
    const influencer = await db.influencerPersons.findByPk(influencer_id, {
      attributes: ["id", "name", "email", "phone"],
    });

    if (!influencer) return res.status(404).json({ message: "Influencer person not found" });

    const payoutDetails = await db.Payouts.findAll({
      attributes: ["id", "remarks", "amount", "status", "type", "createdAt"],
      where: payoutWhere,
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
            {
              model: db.influencerPersons,
              as: "influencerPerson",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const payDetails = await db.sequelize.query(
      `SELECT 
    i.name AS influencer_name,
        SUM(CASE WHEN p.type = 'Settlement pending' THEN p.amount ELSE 0 END) AS commission_total,
        SUM(CASE WHEN p.type = 'Settlement pending' THEN p.amount ELSE 0 END) AS commission_to_receive,
        SUM(CASE WHEN p.type = 'Settled' THEN p.amount ELSE 0 END) AS commission_received
FROM payouts p
JOIN influencer_persons i ON p.influencer_id = i.id
WHERE p.influencer_id = :influencerId
GROUP BY i.name
ORDER BY i.name;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: { influencerId: influencer_id },
      }
    );

    if (payDetails.length === 0) {
      return res.status(200).send({
        payoutDetails,
        influencer,
        payDetails: {
          total: 0,
          to_receive: 0,
          received: 0,
        },
      });
    }

    const { commission_received, commission_total } = payDetails[0];

    const total = Math.round(Number(commission_total) * 100) / 100;
    const received = Math.round(Number(commission_received) * 100) / 100;
    const to_receive = Math.round((Number(commission_total) - Number(commission_received)) * 100) / 100;

    res.status(200).json({
      payoutDetails,
      influencer,
      payDetails: {
        total,
        to_receive,
        received,
      },
    });
  } catch (error) {
    console.log("error in getting payout details", error);
    res.status(500).send({ message: error.toString() });
  }
};

exports.settleAmount = async (req, res) => {
  const { amount } = req.body;
  const { id: influencer_id } = req.params;
  try {
    const payDetails = await db.sequelize.query(
      `SELECT 
    i.name AS influencer_name,
        SUM(CASE WHEN p.type = 'Settlement pending' THEN p.amount ELSE 0 END) AS commission_total,
        SUM(CASE WHEN p.type = 'Settlement pending' THEN p.amount ELSE 0 END) AS commission_to_receive,
        SUM(CASE WHEN p.type = 'Settled' THEN p.amount ELSE 0 END) AS commission_received
FROM payouts p
JOIN influencer_persons i ON p.influencer_id = i.id
GROUP BY i.name
ORDER BY i.name;`,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    const { commission_received, commission_total } = payDetails[0];

    const to_receive = Math.round((Number(commission_total) - Number(commission_received)) * 100) / 100;

    if (amount > to_receive) {
      return res.status(400).json({ message: "Please enter a valid amount, you have to settle only " + to_receive + " amount" });
    }

    await db.Payouts.create({
      influencer_id: influencer_id,
      amount: amount,
      type: "Settled",
    });

    res.status(200).json({ status: true, message: "Payout settled successfully", payDetails });
  } catch (error) {
    console.log("error in settling payout", error);
    res.status(500).send({ message: error.toString() });
  }
};

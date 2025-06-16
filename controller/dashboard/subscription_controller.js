const db = require("../../models");

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await db.subscriber.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(subs);
  } catch (error) {
    console.error(`Error in retrieving subscriptions: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const subscriber = await db.subscriber.findByPk(subscriptionId);
    if (!subscriber) {
      res.status(404).send({ message: "Subscription not found" });
    } else {
      await subscriber.destroy();
      res.status(200).send({ message: "Subscription deleted successfully" });
    }
  } catch (error) {
    console.error(`Error in deleting subscription: ${error.toString()}`);
    res.status(500).send({ message: error.toString() });
  }
};

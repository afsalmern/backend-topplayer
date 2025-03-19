const bcrypt = require("bcryptjs");
const db = require("../../models");
const generateRandomPassword = require("../../utils/generate_password");
const { passwordResetMailInfluencer } = require("../../utils/mail_content");
const sendMail = require("../../utils/mailer");
exports.addInfluencerPerson = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if email or phone already exists in parallel
    const [existingEmail, existingPhone] = await Promise.all([
      db.influencerPersons.findOne({ where: { email } }),
      db.influencerPersons.findOne({ where: { phone } }),
    ]);

    if (existingEmail) return res.status(400).json({ message: "Email already in use" });
    if (existingPhone) return res.status(400).json({ message: "Phone number already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInfluencerPerson = await db.influencerPersons.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newInfluencerPerson);
  } catch (error) {
    console.error("Error creating influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfluencerPerson = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from URL
    const { name, phone, email, password } = req.body;

    // Check if influencer exists
    const influencerPerson = await db.influencerPersons.findByPk(id);
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    // Check if email or phone is already taken (excluding current record)
    const [existingEmail, existingPhone] = await Promise.all([
      db.influencerPersons.findOne({ where: { email, id: { [db.Sequelize.Op.ne]: id } } }),
      db.influencerPersons.findOne({ where: { phone, id: { [db.Sequelize.Op.ne]: id } } }),
    ]);

    if (existingEmail) return res.status(400).json({ message: "Email already in use" });
    if (existingPhone) return res.status(400).json({ message: "Phone number already in use" });

    // Hash password if updated
    let hashedPassword = influencerPerson.password;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    // Update influencer person
    await influencerPerson.update({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "Influencer person updated successfully" });
  } catch (error) {
    console.error("Error updating influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInfluencerPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const influencerPerson = await db.influencerPersons.findByPk(id, {
      attributes: ["id", "name", "phone", "email"], // Exclude password for security
    });

    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    res.status(200).json(influencerPerson);
  } catch (error) {
    console.error("Error fetching influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllInfluencerPersons = async (req, res) => {
  try {
    const influencerPersons = await db.influencerPersons.findAll({
      attributes: ["id", "name", "phone", "email","status"],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(influencerPersons);
  } catch (error) {
    console.error("Error fetching influencer persons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteInfluencerPerson = async (req, res) => {
  try {
    const { id } = req.params;

    const influencerPerson = await db.influencerPersons.findByPk(id);
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    await influencerPerson.destroy();

    res.status(200).json({ message: "Influencer person deleted successfully" });
  } catch (error) {
    console.error("Error deleting influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInfluencerPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const influencerPerson = await db.influencerPersons.findOne({
      email,
    });
    if (!influencerPerson) return res.status(404).json({ message: "Influencer person not found" });

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(password)
    console.log(hashedPassword)
    
    const updateResult = await influencerPerson.update({
      password: hashedPassword,
    });
    console.log(updateResult)

    if (!updateResult) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    const subject = "TheTopPlayer Influencer Password Reset";
    const text = "Password Reset"; // plain text body
    const html = passwordResetMailInfluencer(influencerPerson.name, password);

    const isMailsend = await sendMail(email, subject, text, html);
    if (isMailsend) {
      console.log("Email sent:");
      res.status(200).send({
        message: "Please check your email to Reset your pass",
      });
    } else {
      console.error("Error sending email:", error);
      res.status(500).send({
        message: "Your email address couldn't be found or is unable to receive email. please check your email and try again.",
      });
    }
  } catch (error) {
    console.error("Error deleting influencer person:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

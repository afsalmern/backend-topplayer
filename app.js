const https = require("https");
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const app = express();
const helmet = require("helmet");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

const adminRoute = require("./routes/admin");
const dashRoute = require("./routes/dashboard");
const websiteRoute = require("./routes/website");
const db = require("./models");

const websiteController = require("./controller/website");
const scheduleTasks = require("./scheduleTasks/reminderMail");
const { handleStripeWebhook } = require("./controller/stripe_controller");

const port = process.env.PORT;

// app.use("/webhook", express.raw({ type: "application/json" }), websiteController.stripeWebhook);
app.use("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, x-access-token, , X-localization");
  next();
});
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/admin", adminRoute);
app.use("/dashboard", dashRoute);
app.use("/", websiteRoute);

// scheduleTasks();

db.sequelize
  // .sync({ alter: true })
  .authenticate()
  .then(async (result) => {
    // app.listen(port, () => {
    //   console.log(`TP Backend listens to ${port}`);
    // });
    https.createServer(options, app).listen(7707, () => {
      console.log(`TP Backend listens to https://localhost:7707`);
    });
  })
  .catch((err) => {
    console.log(err.toString());
  });

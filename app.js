const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");

const app = express();

const adminRoute = require("./routes/admin");
const dashRoute = require("./routes/dashboard");
const websiteRoute = require("./routes/website");
const db = require("./models");
const websiteController = require("./controller/website");
const { handleStripeWebhook } = require("./controller/stripe_controller");

const port = process.env.PORT || 7707;

app.set("trust proxy", 1); 
// Secure headers with helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://backend.thetopplayer.com"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrcAttr: ["'none'"],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xFrameOptions: { action: "DENY" },
    xContentTypeOptions: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    permissionsPolicy: {
      features: {
        geolocation: ["'self'"], // ✅ allow geolocation
        camera: [],
        microphone: [],
        fullscreen: [],
        magnetometer: [],
        usb: [],
        vr: [],
        payment: [],
        accelerometer: [],
        ambientLightSensor: [],
        autoplay: [],
        clipboardRead: [],
        clipboardWrite: [],
        displayCapture: [],
        documentDomain: [],
        encryptedMedia: [],
        executionWhileNotRendered: [],
        executionWhileOutOfViewport: [],
        gyroscope: [],
        pictureInPicture: [],
        publickeyCredentialsGet: [],
        screenWakeLock: [],
        syncXHR: [],
        webShare: [],
        xrSpatialTracking: [],
      },
    },
  })
);

app.disable("x-powered-by");

// Rate limiting
const rateLimit = require("express-rate-limit");
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

// CORS with trusted origins
app.use(
  cors({
    origin: ["http://localhost:3000", "https://thetopplayer.com"], // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token", "X-localization"],
  })
);

// HTTPS redirect only in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.protocol !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/check-headers", (req, res) => {
  res.json({ headers: res.getHeaders() });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/admin", adminRoute);
app.use("/dashboard", dashRoute);
app.use("/", websiteRoute);

// HTTPS server
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

db.sequelize
  // .sync({ alter: true })
  .authenticate()
  .then(async (result) => {
    app.listen(port, () => {
      console.log(`TP Backend listens to ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.toString());
  });

// const https = require("https");
// const fs = require('fs');
// const express = require("express");
// const path = require("path");
// const rateLimit = require("express-rate-limit");
// const app = express();
// const helmet = require("helmet");
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   message: "Too many requests, please try again later.",
// });

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// const adminRoute = require("./routes/admin");
// const dashRoute = require("./routes/dashboard");
// const websiteRoute = require("./routes/website");
// const db = require("./models");

// const websiteController = require("./controller/website");
// const scheduleTasks = require("./scheduleTasks/reminderMail");
// const { handleStripeWebhook } = require("./controller/stripe_controller");

// const port = process.env.PORT;

// // app.use("/webhook", express.raw({ type: "application/json" }), websiteController.stripeWebhook);
// app.use("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(limiter);

// app.use(express.static(path.join(__dirname, "public")));

// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, x-access-token, , X-localization");
//   next();
// });
// app.use((req, res, next) => {
//   if (req.headers["x-forwarded-proto"] !== "https") {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

// app.get("/health", (req, res) => {
//   res.status(200).send("OK");
// });

// app.use("/admin", adminRoute);
// app.use("/dashboard", dashRoute);
// app.use("/", websiteRoute);

// // scheduleTasks();

// db.sequelize
//   // .sync({ alter: true })
//   .authenticate()
//   .then(async (result) => {
//     // app.listen(port, () => {
//     //   console.log(`TP Backend listens to ${port}`);
//     // });
//     https.createServer(options, app).listen(7707, () => {
//       console.log(`TP Backend listens to https://localhost:7707`);
//     });
//   })
//   .catch((err) => {
//     console.log(err.toString());
//   });

const { Worker } = require("worker_threads");
const path = require("path");

const sendEmails = (newsId, title_en, title_ar, description_en, description_ar, coverimage) => {
  const worker = new Worker(path.join(__dirname, "../workers/emailWorker.js"));

  worker.on("message", (msg) => {
    console.log(msg); // Log any status or success message
    // worker.terminate();
  });
  worker.on("error", (err) => {
    console.error("Error in worker:", err);
  });
  worker.on("exit", (code) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });

  // Send task to worker (newsId to send emails)
  worker.postMessage({ newsId, title_en, title_ar, description_en, description_ar, coverimage });
};

const SendNotPurchaseMails = (users) => {
  const notPurchaseWorker = new Worker(path.join(__dirname, "../workers/notPurchaseWorker.js"));

  notPurchaseWorker.on("message", (msg) => {
    console.log(msg); // Log any status or success message
    // notPurchaseWorker.terminate();
  });
  notPurchaseWorker.on("error", (err) => {
    console.error("Error in notPurchaseWorker:", err);
  });
  notPurchaseWorker.on("exit", (code) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });

  // Send task to notPurchaseWorker (newsId to send emails)
  notPurchaseWorker.postMessage({ users });
};

module.exports = { sendEmails, SendNotPurchaseMails };

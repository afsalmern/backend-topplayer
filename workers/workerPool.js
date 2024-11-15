const { Worker } = require("worker_threads");
const path = require("path");

class WorkerPool {
  constructor(workerFile, poolSize) {
    this.workerFile = workerFile; // Path to the worker script
    this.poolSize = poolSize; // Number of workers in the pool
    this.workers = [];
    this.taskQueue = [];
    this.availableWorkers = [];

    this.init();
  }

  // Initialize the worker pool
  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.addWorkerToPool();
    }
  }

  // Add a worker to the pool and set up event handling
  addWorkerToPool() {
    const worker = new Worker(this.workerFile);

    // Worker finishes a task
    worker.on("message", (msg) => {
      console.log("Worker message:", msg);
      this.releaseWorker(worker); // Release the worker back to the pool
    });

    // Worker encounters an error
    worker.on("error", (err) => {
      console.error("Worker error:", err);
      this.removeWorker(worker);
      this.addWorkerToPool();
    });

    // Worker exits unexpectedly
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker exited with code ${code}`);
        this.removeWorker(worker);
        this.addWorkerToPool();
      }
    });

    // Add to available workers and pool list
    this.workers.push(worker);
    this.availableWorkers.push(worker);
  }

  // Process tasks in the queue if a worker is available
  processQueue() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const worker = this.availableWorkers.pop();
      const { task, resolve, reject } = this.taskQueue.shift();

      // Run the task on the worker and handle response
      worker.once("message", resolve);
      worker.once("error", reject);
      worker.postMessage(task);
    }
  }

  // Execute a task with a promise
  runTask(task) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      this.processQueue(); // Try to process the task immediately if possible
    });
  }

  // Release worker back to available pool and process queue
  releaseWorker(worker) {
    this.availableWorkers.push(worker);
    this.processQueue();
  }

  // Remove a worker from the pool
  removeWorker(worker) {
    this.workers = this.workers.filter((w) => w !== worker);
    this.availableWorkers = this.availableWorkers.filter((w) => w !== worker);
  }

  // Terminate all workers when done
  terminate() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
  }
}

module.exports = WorkerPool;

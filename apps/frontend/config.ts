export const BACKEND_URL = "http://localhost:8080"; // primary backend, fixed ip
export const WORKER_ORCHESTRATOR_URL = "http://localhost:9093"; // orchestrator, fixed ip

// these both will have dynamic ip addreses
// const workerIp = localStorage.getItem("workerIp") || "localhost";
const workerIp = "localhost";
export const WORKER_BACKEND_URL = `http://${workerIp}:9092`; // worker backend
export const WORKER_URL = `http://${workerIp}:9090`; // vs code url for browser

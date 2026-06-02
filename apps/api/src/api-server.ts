import { randomUUID } from "node:crypto";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { appInfo, listCapabilities, manifest } from "@uniframe/core";

const app = express();
const port = Number(process.env.PORT ?? 4100);

const requestContext: RequestHandler = (req, res, next) => {
  const requestId = req.headers["x-request-id"] ?? randomUUID();
  res.setHeader("x-request-id", requestId);
  next();
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "internal_error" });
};

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(requestContext);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "api",
    framework: appInfo.product,
    timestamp: new Date().toISOString()
  });
});

app.get("/manifest", (_req, res) => {
  res.json(manifest);
});

app.get("/capabilities", (_req, res) => {
  res.json({ items: listCapabilities() });
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body, from: "uniframe-api" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Uniframe API http://localhost:${port}`);
});

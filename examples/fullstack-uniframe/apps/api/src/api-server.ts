import { randomUUID } from "node:crypto";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import { appInfo, manifest } from "@uniframe/core";

const app = express();
const port = Number(process.env.PORT ?? 4300);

const requestContext: RequestHandler = (req, res, next) => {
  const requestId = req.headers["x-request-id"] ?? randomUUID();
  res.setHeader("x-request-id", requestId);
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,x-request-id");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
};

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "internal_error" });
};

const tasks = [
  { id: "api", title: "API runtime hazir", done: true },
  { id: "web", title: "Web hedefi core library kullaniyor", done: true },
  { id: "desktop", title: "Desktop wrapper web hedefini aciyor", done: true },
  { id: "android", title: "Android hedefi Capacitor ile sync edilir", done: false }
];

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(requestContext);

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "fullstack-api",
    framework: appInfo.product,
    timestamp: new Date().toISOString()
  });
});

app.get("/manifest", (_req, res) => {
  res.json(manifest);
});

app.get("/tasks", (_req, res) => {
  res.json({ items: tasks });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Fullstack example API http://localhost:${port}`);
});

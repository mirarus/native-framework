import express from "express";
import { appInfo, listCapabilities } from "../../shared/contracts.js";

const app = express();
const port = Number(process.env.PORT ?? 4100);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "api",
    framework: appInfo.product,
    timestamp: new Date().toISOString()
  });
});

app.get("/capabilities", (_req, res) => {
  res.json({ items: listCapabilities() });
});

app.post("/echo", (req, res) => {
  res.json({ received: req.body, from: "uniframe-api" });
});

app.listen(port, () => {
  console.log(`Uniframe API http://localhost:${port}`);
});

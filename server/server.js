import "dotenv/config";
import express from "express";
import { authRoutes } from "./routes/authRoutes.js";

const app = express();

app.use("/api/v1", authRoutes);

const port = process.env.port || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

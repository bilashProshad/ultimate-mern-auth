import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { authRoutes } from "./routes/authRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { userRoutes } from "./routes/userRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";

const app = express();

connectDatabase();

app.use(morgan("dev"));
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `http://localhost:3000` }));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

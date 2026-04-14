import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";
import { envVars } from "./config/env";

const app: Application = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
     cors({
          origin: function (origin, callback) {
               const allowedOrigins = [
                    envVars.FRONTEND_URL,
                    "http://localhost:3000",
                    "http://localhost:3001",
               ];
               if (!origin) return callback(null, true);
               if (allowedOrigins.includes(origin)) {
                    callback(null, true);
               } else {
                    callback(null, true);
               }
          },
          credentials: true,
     })
);

app.use(cookieParser());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
     res.send("🍽️ DineWise API is running!");
});

app.use(notFound);
app.use(errorHandler);

export default app;

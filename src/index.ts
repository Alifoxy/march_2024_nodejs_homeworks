// @ts-ignore
import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./config/configs";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";
import {cronRunner} from "./crons";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/users", userRouter);

app.use(
    "*",
    (error: ApiError, req: Request, res: Response, next: NextFunction) => {
        res.status(error.status || 500).send(error.message);
    },
);

process.on("uncaughtException", (error) => {
    console.error("uncaughtException", error.message, error.stack);
    process.exit(1);
});

app.listen(configs.APP_PORT, async () => {
    await mongoose.connect(configs.MONGO_URI);
    cronRunner();
    console.log(
        `Server is running on https://${configs.APP_HOST}:${configs.APP_PORT}`,
    );
});
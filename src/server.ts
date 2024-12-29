import express from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/main";

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter);

server.listen(process.env.PORT || 3000);
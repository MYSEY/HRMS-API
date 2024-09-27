import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initializeDb from "./db";
import middleware from "./middleware";
import routes from "./routes";
import { AttachResponder, ErrorHandler } from "./services/errorConfig";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger_output.json";

let app = express();
app.server = http.createServer(app);

require("dotenv").config();

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: process.env.CORSHEADERS,
  })
);

app.use(
  bodyParser.json({
    limit: process.env.BODYLIMIT,
  })
);

// connect to db
initializeDb((db) => {
  // internal middleware
  app.use(middleware({ process, db }));

  app.use(AttachResponder);

  // router
  app.use("/api", routes({ process, db }));
  app.use(ErrorHandler);

  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

  app.server.listen(process.env.PORT,() => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
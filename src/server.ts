import express from "express";
import cors from "cors";
import { adminRoutes, shoppingRoutes, vendorRoutes } from "./routes";
import { database } from "./utils";
import swaggerUi from "swagger-ui-express";
import { swagger } from "./configs";
import path from "path";

export const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

database.connect();

app.use("/", shoppingRoutes);
app.use("/admin/", adminRoutes);
app.use("/vendor/", vendorRoutes);

app.use(
  "/api/docs/",
  swaggerUi.serve,
  swaggerUi.setup(swagger.swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none",
    },
    customSiteTitle: "FreeAPI docs",
  })
);

module.exports = app;

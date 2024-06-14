import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { adminRoutes, shoppingRoutes, vendorRoutes } from "./routes";
import { database } from "./utils";
import swaggerUi from "swagger-ui-express";

const swaggerPath = path.resolve(__dirname, "swagger.yaml");

const file = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = YAML.parse(
  file?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.FOOD_FUSION_HOST_URL}`
  )
);

const app = express();
app.use(express.json());
app.use(cors());

database.connect();

app.use("/", shoppingRoutes);
app.use("/admin/", adminRoutes);
app.use("/vendor/", vendorRoutes);

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none",
    },
    customSiteTitle: "Food Fusion Api Documentation",
  })
);

export default app;

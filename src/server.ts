import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import YAML from "yaml";
import { adminRoutes, shoppingRoutes, vendorRoutes } from "./routes";
import { database } from "./utils";
import swaggerUi from "swagger-ui-express";

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
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
  "/api/docs/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none",
    },
    customSiteTitle: "FreeAPI docs",
  })
);

export default app;

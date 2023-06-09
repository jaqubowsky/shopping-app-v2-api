import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "local";
let envConfig;

if (stage === "production") {
  envConfig = require("./prod").default;
} else {
  envConfig = require("./local").default;
}

const defaultConfig = {
  stage,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  gcloudProjectId: process.env.GCLOUD_PROJECT_ID,
  gcloudApplicationCredentials: process.env.GCLOUD_APPLICATION_CREDENTIALS,
  gcloudStorageBucket: process.env.GCLOUD_STORAGE_BUCKET,
  port: 3001,
  logging: false,
};

export default merge(defaultConfig, envConfig);

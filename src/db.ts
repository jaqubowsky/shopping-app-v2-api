import { PrismaClient } from "@prisma/client";
import { Storage } from "@google-cloud/storage";
import path from "path";

const prisma = new PrismaClient();
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename: path.join(
    __dirname,
    `../${process.env.GCLOUD_APPLICATION_CREDENTIALS}`
  ),
});

export const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

export default prisma;

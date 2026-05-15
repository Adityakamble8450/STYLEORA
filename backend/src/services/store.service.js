import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
  timeout: 120000,
  maxRetries: 0,
});

export const uploadFiles = async ({
  buffer,
  filename,
  folder = "Styleora/products",
}) => {
  if (!client.files?.upload) {
    throw new Error("ImageKit client is not configured for file uploads");
  }

  const uploadableFile = await toFile(buffer, filename);

  const result = await client.files.upload({
    file: uploadableFile,
    fileName: filename,
    folder,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
  };
};

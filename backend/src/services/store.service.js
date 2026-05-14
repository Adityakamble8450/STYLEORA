import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFiles = async ({
  buffer,
  filename,
  folder = "Styleora/products",
}) => {
  const result = await client.upload({
    file: buffer,
    fileName: filename,
    folder,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
  };
};

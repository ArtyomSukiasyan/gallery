import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const publicDirectory = path.join(process.cwd(), "public", "gallery");

  if (req.method === "GET") {
    const folderName = req.query.folderName as string;
    const folderPath = path.join(publicDirectory, folderName);
    const images = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(png|jpg|jpeg|gif)$/.test(file));

    res.status(200).json({ images });
  }
}

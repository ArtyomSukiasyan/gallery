import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const publicDirectory = path.join(process.cwd(), "public", "gallery");

  if (req.method === "GET") {
    const folders = fs
      .readdirSync(publicDirectory)
      .filter((file) =>
        fs.statSync(path.join(publicDirectory, file)).isDirectory()
      );
    res.status(200).json({ folders });
  }

  if (req.method === "POST") {
    const { folderName } = req.body;
    const newFolderPath = path.join(publicDirectory, folderName);

    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath);
      res.status(201).json({ message: "Folder created" });
    } else {
      res.status(400).json({ message: "Folder already exists" });
    }
  }
}

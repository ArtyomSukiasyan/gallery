import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface IParsedPart {
  filename: string | null;
  data: Buffer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const publicDirectory = path.join(process.cwd(), "public", "gallery");

  if (req.method === "POST") {
    const folder = req.query.folder as string;
    const folderPath = path.join(publicDirectory, folder);

    if (!fs.existsSync(folderPath)) {
      return res.status(400).json({ error: "Folder does not exist" });
    }

    const boundary = extractBoundary(req.headers["content-type"] as string);
    if (!boundary) {
      return res
        .status(400)
        .json({ error: "Boundary not found in content-type header" });
    }

    const chunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const parts = parseMultipartData(body, boundary);

      if (parts.length === 0) {
        return res.status(400).json({ error: "No files found in upload." });
      }

      parts.forEach((part) => {
        if (!part.filename) {
          return res
            .status(400)
            .json({ error: "Invalid file upload. Missing filename." });
        }

        const filePath = path.join(folderPath, part.filename);
        fs.writeFileSync(filePath, part.data);
      });

      res.status(200).json({ message: "Images uploaded successfully" });
    });

    req.on("error", () => {
      res.status(500).json({ error: "Failed to upload images" });
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

function extractBoundary(contentType: string): string | null {
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  return boundaryMatch ? boundaryMatch[1] : null;
}

function parseMultipartData(buffer: Buffer, boundary: string): IParsedPart[] {
  const parts: IParsedPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);

  let lastIndex = 0;
  while ((lastIndex = buffer.indexOf(boundaryBuffer, lastIndex)) !== -1) {
    const nextIndex = buffer.indexOf(
      boundaryBuffer,
      lastIndex + boundaryBuffer.length
    );

    if (nextIndex === -1) {
      break;
    }

    const idxToRemoveCRLF = 4;
    const partBuffer = buffer.slice(
      lastIndex + boundaryBuffer.length,
      nextIndex - idxToRemoveCRLF
    );

    if (partBuffer.length > 0) {
      const part = parsePart(partBuffer);
      if (part.filename) parts.push(part);
    }

    lastIndex = nextIndex;
  }

  return parts;
}

function parsePart(partBuffer: Buffer): IParsedPart {
  const delimiter = Buffer.from("\r\n\r\n");
  const headerEndIndex = partBuffer.indexOf(delimiter);

  if (headerEndIndex === -1) {
    return { filename: null, data: Buffer.alloc(0) };
  }

  const headerPart = partBuffer.slice(0, headerEndIndex).toString();
  const dataPart = partBuffer.slice(headerEndIndex + delimiter.length);

  const headers = headerPart.split("\r\n");
  const contentDisposition = headers.find((header) =>
    header.startsWith("Content-Disposition")
  );

  if (!contentDisposition) {
    console.log("Content-Disposition not found");
    return { filename: null, data: dataPart };
  }

  const fileNameMatch = contentDisposition.match(/filename="(.+?)"/);
  const filename = fileNameMatch ? fileNameMatch[1] : null;

  if (!filename) {
    console.log("Filename not found in Content-Disposition");
  }

  return { filename, data: dataPart };
}

import fs from "fs";
import path from "path";
import Image from "next/image";
import "./global.css";
import "./page.css";

export default async function Home() {
  const folders = getFolderNames();

  return (
    <div className="container">
      {folders.map((folder, folderIndex) => (
        <div key={folderIndex}>
          <h2>{folder}</h2>
          <div className="folder_container">
            {getImagesByFolder(folder).map((image, imageIndex) => (
              <div className="image_container" key={imageIndex}>
                <Image
                  src={`/${folder}/${image}`}
                  alt={`Image ${imageIndex + 1}`}
                  fill
                />
              </div>
            ))}
          </div>
          <div className="folder_container"></div>
        </div>
      ))}
    </div>
  );
}

const publicDirectory = path.join(process.cwd(), "public");

function getFolderNames() {
  const folderNames = fs
    .readdirSync(publicDirectory)
    .filter((file) =>
      fs.statSync(path.join(publicDirectory, file)).isDirectory()
    );

  return folderNames;
}

function getImagesByFolder(folderName: string) {
  const folderPath = path.join(publicDirectory, folderName);
  const images = fs
    .readdirSync(folderPath)
    .filter((file) => /\.(png|jpg|jpeg|gif)$/.test(file));

  return images;
}

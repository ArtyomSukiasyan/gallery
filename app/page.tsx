import fs from "fs";
import path from "path";
import Image from "next/image";
import "./global.css";
import "./page.css";

export default async function Home() {
  const folders = await getFolders();

  return (
    <div className="container">
      {folders.map((folder, folderIndex) => (
        <div key={folderIndex}>
          <h2>{folder.folderName}</h2>

          <div className="folder_container">
            {folder.images.map((image, imageIndex) => (
              <div className="image_container" key={imageIndex}>
                <Image
                  src={`/${folder.folderName}/${image}`}
                  alt={`Image ${imageIndex + 1}`}
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export async function getFolders() {
  const publicDirectory = path.join(process.cwd(), "public");
  const folderNames = fs
    .readdirSync(publicDirectory)
    .filter((file) =>
      fs.statSync(path.join(publicDirectory, file)).isDirectory()
    );

  const folders = folderNames.map((folderName) => {
    const folderPath = path.join(publicDirectory, folderName);
    const images = fs
      .readdirSync(folderPath)
      .filter((file) => /\.(png|jpg|jpeg|gif)$/.test(file));

    return {
      folderName,
      images,
    };
  });

  return folders;
}

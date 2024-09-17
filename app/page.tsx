import fs from "fs";
import path from "path";
import Image from "next/image";

export default async function Home() {
  const folders = await getFolders();

  return (
    <div>
      {folders.map((folder, folderIndex) => (
        <div key={folderIndex}>
          <h1>{folder.folderName}</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {folder.images.map((image, imageIndex) => (
              <div
                key={imageIndex}
                style={{
                  width: "200px",
                  height: "200px",
                  position: "relative",
                }}
              >
                <Image
                  src={`/${folder.folderName}/${image}`}
                  alt={`Image ${imageIndex + 1}`}
                  width={100}
                  height={100}
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

"use client";
import Image from "next/image";
import "./global.css";
import "./page.css";
import getFolders from "../helpers/getFolders";
import { ChangeEvent, useEffect, useState } from "react";
import getImagesByFolderName from "../helpers/getImages";

export default function Home() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFolders();
      setFolders(folders);
    };

    fetchFolders();
  }, []);

  const handleFolderChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
    const images = await getImagesByFolderName(e.target.value);

    setImages(images);
  };

  return (
    <div className="container">
      <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="">Select a folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>
            {folder}
          </option>
        ))}
      </select>
      <div className="folder_container">
        {images.map((image, imageIndex) => (
          <div className="image_container" key={imageIndex}>
            <Image
              src={`/${selectedFolder}/${image}`}
              alt={`Image ${imageIndex + 1}`}
              fill
            />
          </div>
        ))}
      </div>
    </div>
  );
}

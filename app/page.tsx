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
  const [clickedIndex, setClickedIndex] = useState<number | null>(null); // Track clicked image index

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
    setClickedIndex(null);
  };

  const handleImageClick = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
      return;
    }
    
    setClickedIndex(index);
  };

  return (
    <div className={`container ${clickedIndex !== null ? "no-scroll" : ""}`}>
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
          <div
            className={`image_container ${
              clickedIndex === imageIndex ? "full-screen" : ""
            }`}
            key={imageIndex}
            onClick={() => handleImageClick(imageIndex)}
          >
            <Image
              src={`/gallery/${selectedFolder}/${image}`}
              alt={`Image ${imageIndex + 1}`}
              fill
              sizes="max-width: 768px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

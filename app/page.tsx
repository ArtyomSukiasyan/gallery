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
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFolders();
      setFolders(folders);
    };

    fetchFolders();
  }, []);

  const handleFolderChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
    const mediaFiles = await getImagesByFolderName(e.target.value);
    setMediaFiles(mediaFiles);
    setClickedIndex(null);
  };

  const handleMediaClick = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
      return;
    }
    setClickedIndex(index);
  };

  const isVideo = (file: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => file.endsWith(ext));
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
        {mediaFiles.map((file, index) => (
          <div
            className={`media_container ${
              clickedIndex === index ? "full-screen" : ""
            }`}
            key={index}
            onClick={() => handleMediaClick(index)}
          >
            {isVideo(file) ? (
              <video
                src={`/gallery/${selectedFolder}/${file}`}
                controls
                preload="none"
                className="video"
              />
            ) : (
              <Image
                src={`/gallery/${selectedFolder}/${file}`}
                alt={`Media ${index + 1}`}
                fill
                sizes="max-width: 768px"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

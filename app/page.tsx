"use client";
import Image from "next/image";
import "./global.css";
import "./page.css";
import getFolders from "../helpers/getFolders";
import { ChangeEvent, useEffect, useState } from "react";
import getImagesByFolderName from "../helpers/getImages";
import { useRouter } from "next/navigation";

export default function Home() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFolders();
      setFolders(folders);
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const folderFromQuery = urlParams.get("folder");
    if (folderFromQuery) {
      setSelectedFolder(folderFromQuery);
      loadImages(folderFromQuery);
    }
  }, []);

  const handleFolderChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedFolderName = e.target.value;
    setSelectedFolder(selectedFolderName);
    router.push(`/?folder=${selectedFolderName}`);
    loadImages(selectedFolderName);
    setClickedIndex(null);
  };

  const loadImages = async (folder: string) => {
    const mediaFiles = await getImagesByFolderName(folder);
    setMediaFiles(mediaFiles);
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import getAlbums from "../helpers/getAlbums";
import getPhotosByAlbum from "../helpers/getPhotosByAlbum";
import "./global.css";
import "./page.css";

export default function Home() {
  const [albums, setAlbums] = useState<{ id: string; title: string }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<
    { id: string; baseUrl: string; filename: string; mimeType: string }[]
  >([]);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getAlbums();
      setAlbums(folders);
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

  const loadImages = async (albumId: string) => {
    const mediaFiles = await getPhotosByAlbum(albumId);
    setMediaFiles(mediaFiles);
  };

  const handleMediaClick = (index: number) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
      return;
    }
    setClickedIndex(index);
  };

  const isVideo = (file: { mimeType: string }) => {
    return file.mimeType.startsWith("video/");
  };

  return (
    <div className={`container ${clickedIndex !== null ? "no-scroll" : ""}`}>
      <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="">Select an album</option>
        {albums.map((album) => (
          <option key={album.id} value={album.id}>
            {album.title}
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
                src={`${file.baseUrl}=dv`}
                controls
                preload="none"
                className="video"
                width={320}
                height={320}
              />
            ) : (
              <Image
                key={file.id}
                src={file.baseUrl}
                alt={file.filename}
                width={320}
                height={320}
                style={{ margin: "10px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

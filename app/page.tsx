"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import getAlbums from "../helpers/getAlbums";
import getPhotosByAlbum from "../helpers/getPhotosByAlbum";
import "./global.css";
import "./page.css";
import { IAlbum } from "../models/album";
import { IPhoto } from "../models/photo";

export default function Home() {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<IPhoto[]>([]);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumsInGoogle = await getAlbums();
      setAlbums(albumsInGoogle);
    };

    fetchAlbums();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const albumFromQuery = urlParams.get("album");
    if (albumFromQuery) {
      setSelectedAlbum(albumFromQuery);
      loadImages(albumFromQuery);
    }
  }, []);

  const handleAlbumChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedAlbum = e.target.value;
    setSelectedAlbum(selectedAlbum);
    router.push(`/?album=${selectedAlbum}`);
    loadImages(selectedAlbum);
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
      <select value={selectedAlbum} onChange={handleAlbumChange}>
        <option value="">Select an album</option>
        {albums.map(({ id, title }) => (
          <option key={id} value={id}>
            {title}
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

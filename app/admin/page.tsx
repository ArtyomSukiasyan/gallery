"use client";

import { useState, useEffect, ChangeEvent } from "react";

export default function Admin() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    fetch("/api/folders")
      .then((res) => res.json())
      .then((data) => setFolders(data.folders))
      .catch((err) => console.error("Failed to fetch folders", err));
  }, []);

  const handleFolderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
  };

  const handleFolderCreation = () => {
    if (!newFolderName) {
      return;
    }

    fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: newFolderName }),
    })
      .then((res) => res.json())
      .then(() => {
        setFolders([...folders, newFolderName]);
        setNewFolderName("");
      })
      .catch((err) => console.error("Failed to create folder", err));
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();

    Array.from(e.target.files as FileList).forEach((file) =>
      formData.append("images", file)
    );
    setFormData(formData);
  };

  const handleImageUpload = async () => {
    if (!selectedFolder) {
      alert("Please select a folder to upload the images.");
      return;
    }
    if (!formData) {
      alert("Please select images to upload.");
      return;
    }

    try {
      const response = await fetch(`/api/upload?folder=${selectedFolder}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Images uploaded successfully!");
        setFormData(null);
      } else {
        alert("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Select Folder</h2>
      <select value={selectedFolder} onChange={handleFolderChange}>
        <option value="">Select a folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>
            {folder}
          </option>
        ))}
      </select>

      <h2>Create New Folder</h2>
      <input
        type="text"
        placeholder="New folder name"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
      />
      <button onClick={handleFolderCreation}>Create Folder</button>

      <h2>Upload Images</h2>
      <input type="file" multiple onChange={handleChangeImage} />
      <button onClick={handleImageUpload}>Upload</button>
    </div>
  );
}

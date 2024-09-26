"use client";

import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import createFolder from "../../helpers/createFolder";
import getFolders from "../../helpers/getFolders";
import uploadFiles from "../../helpers/uploadFiles";

export default function Admin() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [currentPass, setCurrentPass] = useState("");
  const [isCorrectPass, setIsCorrectPass] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await getFolders();
      setFolders(folders);
    };

    fetchFolders();
  }, []);

  const handleFolderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(e.target.value);
  };

  const handleFolderCreation = async () => {
    if (!newFolderName) {
      return;
    }

    const res = await createFolder(newFolderName);

    setFolders([...folders, newFolderName]);
    setNewFolderName("");
    alert(res);
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

    await uploadFiles(selectedFolder, formData);
    setFormData(null);
  };

  const getCurrentPass = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPass(e.target.value);
  };

  const checkPass = () => {
    setIsCorrectPass(currentPass === process.env.NEXT_PUBLIC_ADMIN_PASS);
  };

  if (!isCorrectPass) {
    return (
      <>
        <label>Type pass</label>
        <input type="text" onChange={getCurrentPass} />
        <button onClick={checkPass}>Check</button>
      </>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <Link href={"/"}>Main page</Link>
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

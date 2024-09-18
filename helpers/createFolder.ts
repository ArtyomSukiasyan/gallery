export default async function createFolder(newFolderName: string) {
  try {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderName: newFolderName }),
    });

    const data = await res.json();

    return data.message;
  } catch (err) {
    console.error("Failed to create folder", err);
    return `Failed to create folder with error ${err}`;
  }
}

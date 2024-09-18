export default async function getImagesByFolderName(folderName: string) {
  if (!folderName) {
    return [];
  }

  try {
    const res = await fetch(`/api/images?folderName=${folderName}`);
    const data = await res.json();

    return data.images;
  } catch (err) {
    console.error("Failed to fetch folders", err);
    return [];
  }
}

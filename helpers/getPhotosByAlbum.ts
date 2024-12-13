export default async function getImagesByFolderName(albumId: string) {
  if (!albumId) {
    return [];
  }

  try {
    const res = await fetch(`/api/photos?album=${albumId}`);
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Failed to fetch folders", err);
    return [];
  }
}

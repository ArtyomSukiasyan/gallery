export default async function getFolders() {
  try {
    const res = await fetch("/api/folders");
    const data = await res.json();

    return data.folders;
  } catch (err) {
    console.error("Failed to fetch folders", err);
    return ""
  }
}

export default async function getFolders() {
  try {
    const res = await fetch("/api/albums");
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Failed to fetch folders", err);
    return ""
  }
}
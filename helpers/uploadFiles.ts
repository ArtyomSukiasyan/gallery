export default async function uploadFiles(
  selectedFolder: string,
  formData: FormData
) {
  try {
    const response = await fetch(`/api/upload?folder=${selectedFolder}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Images uploaded successfully!");
    } else {
      alert("Failed to upload images. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading images:", error);
    alert("Failed to upload images. Please try again.");
  }
}

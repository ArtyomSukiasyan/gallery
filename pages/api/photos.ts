import { getAccessToken } from "../../lib/refreshToken";

const photosUrl = "https://photoslibrary.googleapis.com/v1/mediaItems:search";

export default async function handler(req: any, res: any) {
  const accessToken = await getAccessToken();

  if (req.method === "GET") {
    const albumId = req.query.album as string;

    try {
      const response = await fetch(photosUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media with status ${response.status}`);
      }

      const data = await response.json();

      res.status(200).json(data.mediaItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

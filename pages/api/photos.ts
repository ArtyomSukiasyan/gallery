import { getAccessToken } from "../../lib/refreshToken";

export default async function handler(req: any, res: any) {
  const accessToken = await getAccessToken();

  if (req.method === "GET") {
    const albumId = req.query.album as string;

    const url = "https://photoslibrary.googleapis.com/v1/mediaItems:search";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: albumId,
          pageSize: 50,
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
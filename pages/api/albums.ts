import { getAccessToken } from "../../lib/refreshToken";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const accessToken = await getAccessToken();

    const url = "https://photoslibrary.googleapis.com/v1/albums";
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch photos with status ${response.status}`
        );
      }

      const data = await response.json();
      const dataToResponse = data.albums.map(
        ({ id, title }: { id: string; title: string }) => ({
          id,
          title,
        })
      );
      res.status(200).json(dataToResponse);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

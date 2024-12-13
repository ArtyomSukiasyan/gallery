import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../../lib/refreshToken";
import { IAlbum } from "../../models/album";

const albumUrl = "https://photoslibrary.googleapis.com/v1/albums";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const accessToken = await getAccessToken();

    try {
      const response = await fetch(albumUrl, {
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
      const dataToResponse = data.albums.map(({ id, title }: IAlbum) => ({
        id,
        title,
      }));
      res.status(200).json(dataToResponse);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

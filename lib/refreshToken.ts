const refreshToken = process.env.GOOGLE_PHOTOS_REFRESH_TOKEN;
const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_PHOTOS_CLIENT_SECRET;

export async function getAccessToken() {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        refresh_token: refreshToken || "",
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

import { paths } from "../../../lib/types/schema";

type params =
  paths["/refresh-token"]["post"]["requestBody"]["content"]["application/json"];

type response =
  paths["/refresh-token"]["post"]["responses"]["200"]["content"]["application/json"];

export const postRefreshToken = async (
  refreshToken: params["refreshToken"]
): Promise<{ data?: response; error?: any }> => {
  try {
    const response = await fetch("http://localhost:3001/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return { error };
  }
};

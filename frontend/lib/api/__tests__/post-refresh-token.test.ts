import { postRefreshToken } from "../post-refresh-token";

// Mock fetch globally
global.fetch = jest.fn();

describe("postRefreshToken", () => {
  const mockRefreshToken = "mock-refresh-token-123";
  const mockUrl = "http://localhost:3001/refresh-token";

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successful requests", () => {
    it("should successfully refresh token and return data", async () => {
      const mockResponse = {
        token: "new-access-token-456",
        refreshToken: "new-refresh-token-789",
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: mockRefreshToken }),
      });

      expect(mockFetchResponse.json).toHaveBeenCalled();
      expect(result).toEqual({ data: mockResponse });
      expect(result.error).toBeUndefined();
    });

    it("should handle response with only token", async () => {
      const mockResponse = {
        token: "new-access-token-only",
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({ data: mockResponse });
      expect(result.error).toBeUndefined();
    });

    it("should handle response with only refreshToken", async () => {
      const mockResponse = {
        refreshToken: "new-refresh-token-only",
      };

      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({ data: mockResponse });
      expect(result.error).toBeUndefined();
    });
  });

  describe("error handling", () => {
    it("should handle HTTP error responses", async () => {
      const mockFetchResponse = {
        ok: false,
        status: 401,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({
        error: new Error("HTTP error! status: 401"),
      });
      expect(result.data).toBeUndefined();
    });

    it("should handle 403 Forbidden response", async () => {
      const mockFetchResponse = {
        ok: false,
        status: 403,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({
        error: new Error("HTTP error! status: 403"),
      });
    });

    it("should handle 500 Internal Server Error", async () => {
      const mockFetchResponse = {
        ok: false,
        status: 500,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({
        error: new Error("HTTP error! status: 500"),
      });
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({ error: networkError });
      expect(console.error).toHaveBeenCalledWith(
        "Failed to refresh token:",
        networkError
      );
    });

    it("should handle JSON parsing errors", async () => {
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(mockRefreshToken);

      expect(result).toEqual({
        error: new Error("Invalid JSON"),
      });
      expect(console.error).toHaveBeenCalledWith(
        "Failed to refresh token:",
        expect.any(Error)
      );
    });
  });

  describe("request validation", () => {
    it("should send correct request body structure", async () => {
      const mockResponse = { token: "test-token" };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      await postRefreshToken(mockRefreshToken);

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: mockRefreshToken }),
        })
      );
    });

    it("should handle empty refresh token", async () => {
      const mockResponse = { token: "test-token" };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      await postRefreshToken("");

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: JSON.stringify({ refreshToken: "" }),
        })
      );
    });
  });

  describe("edge cases", () => {
    it("should handle very long refresh tokens", async () => {
      const longToken = "a".repeat(1000);
      const mockResponse = { token: "test-token" };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(longToken);

      expect(result).toEqual({ data: mockResponse });
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: JSON.stringify({ refreshToken: longToken }),
        })
      );
    });

    it("should handle special characters in refresh token", async () => {
      const specialToken = "token-with-special-chars!@#$%^&*()";
      const mockResponse = { token: "test-token" };
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const result = await postRefreshToken(specialToken);

      expect(result).toEqual({ data: mockResponse });
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: JSON.stringify({ refreshToken: specialToken }),
        })
      );
    });
  });
});

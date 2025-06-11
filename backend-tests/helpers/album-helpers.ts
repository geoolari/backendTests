import { APIRequestContext, expect } from '@playwright/test';

export const BASE_URL = 'https://albums-collection-service.herokuapp.com';

// Define an interface for the album structure
export interface Album {
  title: string;
  artist?: string | null;
  genre?: string | null;
  label?: string | null;
  songs?: number | null;
  year?: number | null;
  album_id?: string; // API returns this, and it's used in paths
}

// Typed initial data for creating an album
export const initialAlbumData: Omit<Album, 'album_id'> = {
  title: 'Chronicles of a Test Runner',
  artist: 'The Virtual Virtuosos',
  genre: 'Synth-Pop',
  label: 'Test Records',
  songs: 11,
  year: 2025,
};

// Typed data for update operation
export const updatedData: Partial<Album> = {
  title: 'Echoes of the Code',
  songs: 14,
  year: 2026,
};

// Helper function to create an album and return its ID
export async function createAlbum(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${BASE_URL}/albums`, {
    data: initialAlbumData,
  });
  expect(response.status()).toBe(201);
  const createdAlbum = await response.json();
  return createdAlbum.album_id;
}

// Helper function to delete an album
export async function deleteAlbum(request: APIRequestContext, albumId: string): Promise<void> {
  const response = await request.delete(`${BASE_URL}/albums/${albumId}`);
  expect(response.status()).toBe(200);
}

// Helper function to update an album with PATCH
export async function updateAlbum(request: APIRequestContext, albumId: string, updateData: Partial<Album>): Promise<void> {
  const response = await request.patch(`${BASE_URL}/albums/${albumId}`, {
    data: updateData,
  });
  expect(response.status()).toBe(200);
}

// Helper function to fetch an album by ID and validate its data
export async function expectAlbumData(request: APIRequestContext, currentAlbumId: string, expectedData: Partial<Album>) {
  const getResponse = await request.get(`${BASE_URL}/albums/${currentAlbumId}`);
  expect(getResponse.status(), `GET request for album ${currentAlbumId} should return 200. Status: ${getResponse.status()}`).toBe(200);
  const fetchedAlbum: Album = await getResponse.json();

  // Check each expected property matches the fetched album
  for (const [key, expectedValue] of Object.entries(expectedData)) {
    if (expectedValue !== undefined) {
      expect(fetchedAlbum[key as keyof Album]).toBe(expectedValue);
    }
  }
}

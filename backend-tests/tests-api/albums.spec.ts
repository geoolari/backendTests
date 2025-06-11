import { test, expect } from '@playwright/test';
import {
  BASE_URL,
  Album,
  initialAlbumData,
  updatedData,
  createAlbum,
  deleteAlbum,
  updateAlbum,
  expectAlbumData,
} from '../helpers/album-helpers';

test.describe('Albums API CRUD Operations (albums-collection-service)', () => {
  test('a. Create album with full information & b. Validate album was created', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/albums`, {
      data: initialAlbumData,
    });
    expect(response.status(), 'Verify album creation status').toBe(201);
    const createdAlbumResponse = await response.json();

    expect(createdAlbumResponse, 'Verify POST response has an album_id').toHaveProperty('album_id');
    expect(createdAlbumResponse, 'Verify POST response has a message').toHaveProperty('message');
    expect(createdAlbumResponse.message, 'Verify success message from POST').toBe('Album created succesfully');

    const createdAlbumId = createdAlbumResponse.album_id;
    expect(createdAlbumId).toBeDefined();

    // b. Validate album created using the helper function
    const expectedStateAfterCreation: Partial<Album> = {
      ...initialAlbumData,
      album_id: createdAlbumId,
    };
    await expectAlbumData(request, createdAlbumId, expectedStateAfterCreation);

    // Clean up - delete the created album
    await deleteAlbum(request, createdAlbumId);
  });
  test('c. Change the album title, songs and year & d. Validate album was updated', async ({ request }) => {
    // Create an album for this test
    const testAlbumId = await createAlbum(request);

    // Update the album
    const patchResponse = await request.patch(`${BASE_URL}/albums/${testAlbumId}`, {
      data: updatedData,
    });
    expect(patchResponse.status(), 'Verify PATCH update (title, songs, year) status').toBe(200);
    const patchResponseBody = await patchResponse.json();
    // Validate PATCH response structure and values
    expect(patchResponseBody, 'Verify PATCH response').toEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    });

    // d. Validate updated fields using the helper function
    const expectedStateAfterUpdate: Partial<Album> = {
      title: updatedData.title, // Updated
      artist: initialAlbumData.artist, // Original
      year: updatedData.year, // Updated
      genre: initialAlbumData.genre, // Original
      label: initialAlbumData.label, // Original
      songs: updatedData.songs, // Updated
      album_id: testAlbumId,
    };
    await expectAlbumData(request, testAlbumId, expectedStateAfterUpdate);

    // Clean up - delete the test album
    await deleteAlbum(request, testAlbumId);
  });
  test('e. Use PUT to "delete" fields by omission & f. Validate album was updated', async ({ request }) => {
    // Create an album for this test
    const testAlbumId = await createAlbum(request); // First, apply the first update to get to the expected state
    await updateAlbum(request, testAlbumId, updatedData);

    // PUT data without genre and year - testing  "deletion by omission"
    const putDataWithoutGenreYear = {
      title: updatedData.title!, // From previous update
      artist: initialAlbumData.artist!, // Original
      label: initialAlbumData.label!, // Original
      songs: updatedData.songs!, // From previous update
      // genre and year intentionally omitted
    };
    const putResponse = await request.put(`${BASE_URL}/albums/${testAlbumId}`, {
      data: putDataWithoutGenreYear,
    });
    expect(putResponse.status(), 'Verify PUT update (omitting genre, year) status').toBe(200);
    const putResponseBody = await putResponse.json();
    // Validate PUT response structure and values
    expect(putResponseBody, 'Verify PUT response').toEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    });

    // f. Validate album was updated using the helper function
    // Expected state after PUT with omitted fields (genre and year should be null)
    const expectedStateAfterPut: Partial<Album> = {
      title: updatedData.title, // From previous update
      artist: initialAlbumData.artist, // Original
      label: initialAlbumData.label, // Original
      songs: updatedData.songs, // From previous update
      genre: null, // Omitted field becomes null
      year: null, // Omitted field becomes null
      album_id: testAlbumId,
    };
    await expectAlbumData(request, testAlbumId, expectedStateAfterPut);

    // Clean up - delete the test album
    await deleteAlbum(request, testAlbumId);
  });
  test('g. Delete created album & h. Validate album deleted', async ({ request }) => {
    // Create an album for this test
    const testAlbumId = await createAlbum(request);

    // Delete the album
    const response = await request.delete(`${BASE_URL}/albums/${testAlbumId}`);
    expect(response.status(), 'Verify DELETE request returns 200').toBe(200);
    const deleteResponseBody = await response.json();
    // Validate DELETE response structure and values
    expect(deleteResponseBody, 'Verify DELETE response').toEqual({
      acknowledged: true,
      deletedCount: 1,
    });
    const getResponse = await request.get(`${BASE_URL}/albums/${testAlbumId}`);
    expect(getResponse.status(), 'Verify GET request for deleted album returns 404').toBe(404);
  });
});

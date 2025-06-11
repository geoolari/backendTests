import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API Tests', () => {
  // Test a: Check that a user exists with the username "Samantha"
  test('should find a user with username "Samantha"', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);
    expect(response.status()).toBe(200);
    const users = await response.json();
    const samantha = users.find((user: { username: string }) => user.username === 'Samantha');
    expect(samantha).toBeDefined();
    if (samantha) {
      expect(samantha.username).toBe('Samantha');
    }
  });

  // Test b: Add a new post and specify a title, body and user id
  test('should add a new post', async ({ request }) => {
    const newPostData = {
      title: 'My New Post Title',
      body: 'This is the body of my new post.',
      userId: 1,
    };
    const response = await request.post(`${BASE_URL}/posts`, {
      data: newPostData,
    });
    expect(response.status()).toBe(201); // Check for successful creation
    const post = await response.json();
    expect(post.title).toBe(newPostData.title);
    expect(post.body).toBe(newPostData.body);
    expect(post.userId).toBe(newPostData.userId);
    expect(post.id).toBeDefined(); // Check that the new post has an ID
  });

  // Test c: Write a test for one of the API endpoints that will fail if the response time passes a given threshold.
  test('GET /posts should respond within 500ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${BASE_URL}/posts`);
    const endTime = Date.now();

    expect(response.status()).toBe(200);

    const duration = endTime - startTime;
    console.log(`GET /posts response time: ${duration}ms`);
    expect(duration).toBeLessThanOrEqual(500); // Set your desired threshold here (e.g., 500ms)
  });
});

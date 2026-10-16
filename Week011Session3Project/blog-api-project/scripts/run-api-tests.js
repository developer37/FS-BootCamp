const { spawn } = require("child_process");
const assert = require("node:assert/strict");
const path = require("node:path");

// This script boots the API in a child process and exercises the main CRUD routes.
const projectRoot = path.resolve(__dirname, "..");
const baseUrl = "http://localhost:3000";

// Poll the health endpoint until the app is ready. This avoids race conditions
// during startup when the server may still be booting.
async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch (_error) {
      // Server is still starting, so we keep retrying until it responds.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("API server did not become ready on http://localhost:3000");
}

// A helper that sends JSON requests and returns both the raw HTTP response and
// the parsed JSON body to keep assertions consistent and readable.
async function request(method, endpoint, body) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return { response, data };
}

(async () => {
  // Start the application as a child process so the smoke test exercises the real
  // server behavior rather than testing mock-only code paths.
  const server = spawn(process.execPath, ["app.js"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  });

  // Make sure the child process is stopped when the test process ends.
  const cleanup = () => {
    if (!server.killed && server.exitCode === null) {
      server.kill("SIGINT");
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });

  try {
    // Wait for the app to finish booting before making requests.
    await waitForServer();

    // Check the root documentation and health endpoints first. These confirm the
    // service is up and serving the expected metadata.
    const doc = await request("GET", "/");
    assert.equal(doc.response.status, 200, "GET / should return 200");
    assert.equal(doc.data.message, "Blog Post API");

    const health = await request("GET", "/health");
    assert.equal(health.response.status, 200, "GET /health should return 200");
    assert.equal(health.data.status, "UP");

    // The posts route is tested end-to-end: read, create, fetch by ID, update,
    // delete, and then check validation and not-found scenarios.
    const allPosts = await request("GET", "/api/posts");
    assert.equal(
      allPosts.response.status,
      200,
      "GET /api/posts should return 200",
    );
    assert.ok(
      Array.isArray(allPosts.data.posts),
      "Response should contain a posts array",
    );

    const createdPost = await request("POST", "/api/posts", {
      title: "Getting Started with Express",
      content:
        "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
      author: "Jane Doe",
      published: true,
    });
    assert.equal(
      createdPost.response.status,
      201,
      "POST /api/posts should return 201",
    );
    assert.ok(
      createdPost.data.post && createdPost.data.post.id,
      "POST /api/posts should return a created post",
    );

    const postId = createdPost.data.post.id;

    const getPost = await request("GET", `/api/posts/${postId}`);
    assert.equal(
      getPost.response.status,
      200,
      "GET /api/posts/:id should return 200",
    );
    assert.equal(getPost.data.post.id, postId);

    const updatedPost = await request("PUT", `/api/posts/${postId}`, {
      title: "Getting Started with Express (Updated)",
      content:
        "Express is a minimal and flexible Node.js web application framework. This guide has been updated with new examples.",
      published: true,
    });
    assert.equal(
      updatedPost.response.status,
      200,
      "PUT /api/posts/:id should return 200",
    );
    assert.match(updatedPost.data.post.title, /Updated/);

    const deletedPost = await request("DELETE", `/api/posts/${postId}`);
    assert.equal(
      deletedPost.response.status,
      200,
      "DELETE /api/posts/:id should return 200",
    );

    // Validation failures and missing resources should return 400 and 404 responses.
    const invalidPost = await request("POST", "/api/posts", {
      title: "Ab",
      content: "Too short",
      author: "",
    });
    assert.equal(
      invalidPost.response.status,
      400,
      "POST /api/posts with invalid data should return 400",
    );

    const missingPost = await request("GET", "/api/posts/9999");
    assert.equal(
      missingPost.response.status,
      404,
      "GET /api/posts/9999 should return 404",
    );

    // The user routes are checked using the same flow to confirm CRUD logic and
    // validation behave the same as the post endpoints.
    const allUsers = await request("GET", "/api/users");
    assert.equal(
      allUsers.response.status,
      200,
      "GET /api/users should return 200",
    );
    assert.ok(
      Array.isArray(allUsers.data.users),
      "Response should contain a users array",
    );

    const createdUser = await request("POST", "/api/users", {
      name: "Dana Smith",
      email: "dana@example.com",
      role: "reader",
    });
    assert.equal(
      createdUser.response.status,
      201,
      "POST /api/users should return 201",
    );
    assert.ok(
      createdUser.data.user && createdUser.data.user.id,
      "POST /api/users should return a created user",
    );

    const userId = createdUser.data.user.id;

    const getUser = await request("GET", `/api/users/${userId}`);
    assert.equal(
      getUser.response.status,
      200,
      "GET /api/users/:id should return 200",
    );
    assert.equal(getUser.data.user.id, userId);

    const updatedUser = await request("PUT", `/api/users/${userId}`, {
      name: "Dana Jones",
      role: "author",
    });
    assert.equal(
      updatedUser.response.status,
      200,
      "PUT /api/users/:id should return 200",
    );
    assert.equal(updatedUser.data.user.name, "Dana Jones");

    const deletedUser = await request("DELETE", `/api/users/${userId}`);
    assert.equal(
      deletedUser.response.status,
      200,
      "DELETE /api/users/:id should return 200",
    );

    const invalidUser = await request("POST", "/api/users", {
      name: "A",
      email: "invalid-email",
    });
    assert.equal(
      invalidUser.response.status,
      400,
      "POST /api/users with invalid data should return 400",
    );

    const missingUser = await request("GET", "/api/users/9999");
    assert.equal(
      missingUser.response.status,
      404,
      "GET /api/users/9999 should return 404",
    );

    // If all of the assertions pass, the API is functioning as expected.
    console.log("API smoke tests passed.");
  } finally {
    cleanup();
  }
})();

# Blog Post API - Project Planning Guide

## Project Overview

Build a RESTful API for managing blog posts and users using Express.js. This project demonstrates Express routing, middleware, controllers, and MVC architecture.

**No frontend required** - Test your API using Postman

---

## Setup Options

Choose one of the following:

- **Option A: Start from Scratch** - Build everything from the ground up (recommended for full learning)
- **Option B: Use Template** - Copy the project structure and clear out the code for faster setup

Be careful to not run both complete-example and your version at the same time.

---

## Option A: Start from Scratch

```bash
# 1. Create project
mkdir blog-api-project
cd blog-api-project

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express
npm install --save-dev nodemon newman

# 4. Create folder structure
mkdir routes controllers middleware
```

**Configure package.json by opening it and replacing the scripts property with this:**

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "node scripts/run-api-tests.js",
  "test:postman": "newman run Blog-Post-API.postman_collection.json --reporters cli,json --reporter-json-export test-results.json",
  "test:postman:silent": "newman run Blog-Post-API.postman_collection.json --reporters cli,json --reporter-cli-silent --reporter-json-export test-results.json"
}
```

**Copy test collection:**
Copy the existing `complete-example/Blog-Post-API.postman_collection.json` to your project folder, sibling to your package.json.

blog-api-project/

- package.json
- Blog-Post-API.postman_collection.json (file should be sibling to the project.json)

---

## Option B: Use Template

```bash
# 1. Copy template
mkdir blog-api-project
cp -r complete-example/* blog-api-project/
cd blog-api-project

# 2. Clear out implementation files
# Delete all code from these files (keep the files):
# - app.js
# - controllers/postsController.js
# - controllers/usersController.js
# - routes/posts.js
# - routes/users.js
# - middleware/errorHandler.js

# 3. Install dependencies
npm install
```

---

## Project Structure

Your final project should look like this:

```
blog-api-project/
├── app.js
├── package.json
├── Blog-Post-API.postman_collection.json
├── routes/
│   ├── posts.js
│   └── users.js
├── controllers/
│   ├── postsController.js
│   └── usersController.js
└── middleware/
    └── errorHandler.js
```

---

## Implementation Checklist

**Recommended approach:** Implement one endpoint at a time, starting with the health endpoints, then test it before moving to the next. This helps catch errors early.

### Step 1: Create Main Server (`app.js`)

- [ ] Require Express and create app instance
- [ ] Set PORT with environment variable (default 3000)
- [ ] Add `express.json()` middleware
- [ ] Create request logging middleware
- [ ] Mount routes: `/api/posts` and `/api/users`
- [ ] Add root route (`/`) with API documentation
- [ ] Add health check route (`/health`)
- [ ] Add 404 handler for unknown routes
- [ ] Add error handling middleware (must be last)
- [ ] Start server with `app.listen()`

**Test:**

1. Run `npm run dev` and visit `http://localhost:3000/`
2. Test `/health` endpoint in Postman (see [Testing Your API](#testing-your-api) below)
3. Once these work, move to the next step

---

### Step 2: Create Posts Controller (`controllers/postsController.js`)

**Strategy:** Implement one function at a time. Start with `getAllPosts()`, test it, then move to `getPostById()`, and so on.

**Implement these functions:**

- [ ] `getAllPosts()` - Return all posts
- [ ] `getPostById()` - Find and return specific post
- [ ] `createPost()` - Validate and add new post
- [ ] `updatePost()` - Find and update existing post
- [ ] `deletePost()` - Find and remove post

**Post structure:**

```javascript
{
  id: number,
  title: string,           // required, min 3 chars
  content: string,         // required, min 10 chars
  author: string,          // required
  published: boolean,      // optional, default false
  createdAt: string
}
```

**Tip:** Copy sample data from `sample-data.js` in the module folder.

**Test each function:** After implementing each controller function, test it in Postman before moving to the next.

---

### Step 3: Create Users Controller (`controllers/usersController.js`)

**Strategy:** Follow the same one-at-a-time approach as with Posts Controller.

**Implement these functions:**

- [ ] `getAllUsers()` - Return all users
- [ ] `getUserById()` - Find and return specific user
- [ ] `createUser()` - Validate and add new user
- [ ] `updateUser()` - Find and update existing user
- [ ] `deleteUser()` - Find and remove user

**User structure:**

```javascript
{
  id: number,
  name: string,            // required, min 2 chars
  email: string,           // required, valid email
  role: string,            // optional: admin|author|reader (default: author)
  createdAt: string
}
```

**Tip:** Copy sample data from `sample-data.js` in the module folder.

**Test each function:** After implementing each controller function, test it in Postman before moving to the next.

---

### Step 4: Create Posts Routes (`routes/posts.js`)

- [ ] Create Express router
- [ ] Import posts controller functions
- [ ] Define routes:
  - `GET /` → getAllPosts
  - `GET /:id` → getPostById
  - `POST /` → createPost
  - `PUT /:id` → updatePost
  - `DELETE /:id` → deletePost
- [ ] Export router

---

### Step 5: Create Users Routes (`routes/users.js`)

- [ ] Create Express router
- [ ] Import users controller functions
- [ ] Define routes:
  - `GET /` → getAllUsers
  - `GET /:id` → getUserById
  - `POST /` → createUser
  - `PUT /:id` → updateUser
  - `DELETE /:id` → deleteUser
- [ ] Export router

---

### Step 6: Create Error Handler (`middleware/errorHandler.js`)

- [ ] Create function with 4 parameters: (err, req, res, next)
- [ ] Log error to console
- [ ] Return JSON error response
- [ ] Use appropriate HTTP status codes

**Error format:**

```javascript
{
  error: "Error message",
  details: "Additional context (optional)"
}
```

---

## Testing Your API

### Using Postman

1. **Import the collection:**
   - Open Postman
   - Click **Import**
   - Select `Blog-Post-API.postman_collection.json`

2. **Start your server:**

   ```bash
   npm run dev
   ```

3. **Test endpoints:**
   - Collection includes all endpoints organized by resource
   - Each request has pre-configured URLs and example data
   - Click **Send** to test individual endpoints

### Automated Testing with Newman

```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run the Node smoke tests
npm test

# Terminal 2 alternative: Run the Postman/Newman collection
npm run test:postman
```

The Node smoke test script validates the main API behavior, while the Postman collection can be used for broader collection-based testing and result export to `test-results.json`.

---

## Submission Checklist

- [ ] All 10 endpoints work correctly (5 posts + 5 users)
- [ ] Proper HTTP status codes (200, 201, 400, 404, 500)
- [ ] Input validation implemented
- [ ] Error handling implemented
- [ ] MVC architecture (separate routes and controllers)
- [ ] Code is clean and readable
- [ ] Project pushed to GitHub
- [ ] GitHub repo link shared in #projects channel

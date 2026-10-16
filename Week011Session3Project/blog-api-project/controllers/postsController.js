// In-memory data store to simulate a lightweight blog database.
let posts = [
  {
    id: 1,
    title: "Getting Started with Express.js",
    content:
      "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
    author: "Alice Johnson",
    createdAt: new Date("2024-01-15").toISOString(),
    published: true,
  },
  {
    id: 2,
    title: "Understanding RESTful APIs",
    content:
      "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations.",
    author: "Bob Smith",
    createdAt: new Date("2024-01-20").toISOString(),
    published: true,
  },
  {
    id: 3,
    title: "JavaScript Best Practices",
    content:
      "Writing clean, maintainable JavaScript code is essential for building robust applications. Here are some best practices to follow.",
    author: "Carol Davis",
    createdAt: new Date("2024-01-25").toISOString(),
    published: false,
  },
];

// Keeps IDs unique as new posts are created.
let nextId = 4;

// GET /api/posts: fetch all posts, with optional filtering by published state.
const getAllPosts = (req, res) => {
  try {
    const { published } = req.query;
    let filteredPosts = posts;

    if (published !== undefined) {
      const isPublished = published === "true";
      filteredPosts = posts.filter((post) => post.published === isPublished);
    }

    res.json({
      posts: filteredPosts,
      count: filteredPosts.length,
      totalPosts: posts.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve posts",
      message: error.message,
    });
  }
};

// GET /api/posts/:id: find a single post by ID and return 404 if absent.
const getPostById = (req, res) => {
  try {
    const { id } = req.params;
    const post = posts.find((p) => p.id === parseInt(id));

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with ID ${id}`,
      });
    }

    res.json({
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve post",
      message: error.message,
    });
  }
};

// POST /api/posts: validate the incoming payload before adding a new post.
const createPost = (req, res) => {
  try {
    const { title, content, author, published = false } = req.body;

    // Guard clauses stop invalid data before it reaches the in-memory array.
    if (!title || !content || !author) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Title, content, and author are required",
        received: { title, content, author, published },
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        error: "Validation error",
        message: "Title must be at least 3 characters long",
      });
    }

    if (content.length < 10) {
      return res.status(400).json({
        error: "Validation error",
        message: "Content must be at least 10 characters long",
      });
    }

    const newPost = {
      id: nextId++,
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
      published: Boolean(published),
    };

    // Append the new record so the API can immediately return it to the client.
    posts.push(newPost);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create post",
      message: error.message,
    });
  }
};

// PUT /api/posts/:id: update only the fields the client sends while preserving others.
const updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, published } = req.body;

    const postIndex = posts.findIndex((p) => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with ID ${id}`,
      });
    }

    if (title !== undefined && title.length < 3) {
      return res.status(400).json({
        error: "Validation error",
        message: "Title must be at least 3 characters long",
      });
    }

    if (content !== undefined && content.length < 10) {
      return res.status(400).json({
        error: "Validation error",
        message: "Content must be at least 10 characters long",
      });
    }

    // Apply only the supplied updates; undefined fields are ignored.
    if (title !== undefined) {
      posts[postIndex].title = title;
    }
    if (content !== undefined) {
      posts[postIndex].content = content;
    }
    if (author !== undefined) {
      posts[postIndex].author = author;
    }
    if (published !== undefined) {
      posts[postIndex].published = Boolean(published);
    }

    res.json({
      message: "Post updated successfully",
      post: posts[postIndex],
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update post",
      message: error.message,
    });
  }
};

// DELETE /api/posts/:id: remove the matching post and return the deleted object.
const deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = posts.findIndex((p) => p.id === parseInt(id));

    if (postIndex === -1) {
      return res.status(404).json({
        error: "Post not found",
        message: `No post exists with ID ${id}`,
      });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];

    res.json({
      message: "Post deleted successfully",
      post: deletedPost,
      remainingPosts: posts.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete post",
      message: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

// Favorites Routes - CRUD operations for saved tracks
const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// TODO: POST '/' — Save a track to favorites
router.post('/', async (req, res) => {
  try {
    const { trackId, trackName, artistName, albumName, previewUrl, imageUrl } = req.body;

    // Validate required fields
    if (!trackId || !trackName || !artistName || !albumName || !imageUrl) {
      return res.status(400).json({
        error: 'Missing required fields: trackId, trackName, artistName, albumName, imageUrl'
      });
    }

    // Check for duplicate
    const existing = await Favorite.findOne({ where: { trackId } });
    if (existing) {
      return res.status(400).json({ error: 'Track is already in favorites' });
    }

    // Create and save
    const favorite = await Favorite.create({
      trackId,
      trackName,
      artistName,
      albumName,
      previewUrl: previewUrl || null,
      imageUrl
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO: GET '/' — Get all favorites
//   1. Use Favorite.findAll() with order: [['addedAt', 'DESC']]
//   2. Return 200 with JSON: { count: favorites.length, favorites }
//   3. Catch errors → return 500
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      order: [['addedAt', 'DESC']]
    });

    res.status(200).json({
      count: favorites.length,
      favorites: favorites
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO: GET '/:id' — Get a single favorite
//   1. Use Favorite.findByPk(req.params.id)
//   2. If not found, return 404: "Favorite not found"
//   3. Return 200 with the favorite
//   4. Catch errors → return 500
router.get('/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// TODO: DELETE '/:id' — Remove a favorite
//   1. Use Favorite.findByPk(req.params.id)
//   2. If not found, return 404: "Favorite not found"
//   3. Call favorite.destroy()
//   4. Return 200 with: { message: "Favorite deleted successfully", favorite }
//   5. Catch errors → return 500
router.delete('/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByPk(req.params.id);

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await favorite.destroy();

    res.status(200).json({
      message: 'Favorite deleted successfully',
      favorite: favorite
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

// Favorite Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  trackId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  trackName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Track name cannot be empty' }
    }
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Artist name cannot be empty' }
    }
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Album name cannot be empty' }
    }
  },
  previewUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favorites'
});

module.exports = Favorite;

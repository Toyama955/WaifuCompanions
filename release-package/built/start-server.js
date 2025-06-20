#!/usr/bin/env node

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`恋愛クラスメイトゲームが起動しました: http://localhost:${PORT}`);
});
const mongoose = require('mongoose');

// Definição do esquema usando Mongoose Schema
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    category: String,
    content: String,
    slug: String,
    author: String,
    views: Number
}, { collection: 'posts' });

// Criar o modelo usando o esquema
const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})

const Pokemon = mongoose.model('Pokemon', {
    name: String,
    type: String,
    level: Number,
    nature: String
});

app.post('/api/pokemon', async (req, res) => {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).send(pokemon);
})

app.get('/api/pokemon', async (req, res) => {
    const list = await Pokemon.find();
    res.send(list);
})
//API is running in port 5000 -> http://localhost:5000
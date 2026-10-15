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

const Pokemon = mongoose.model('Pokemon', new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 100 },
    nature: { type: String, required: true }
}));

app.post('/api/pokemon', async (req, res) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.save();
        res.status(201).send(pokemon);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/api/pokemon', async (req, res) => {
    try {
        const list = await Pokemon.find();
        res.send(list);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
//API is running in port 5000 -> http://localhost:5000
app.put('/api/pokemon/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid ID' });
    }

    try {
        const updated = await Pokemon.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).send({ error: 'Pokemon not found' });
        }

        res.send(updated);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.delete('/api/pokemon/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({ error: 'Invalid ID' });
    }
    try {
        const deleted = await Pokemon.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ error: 'Pokemon not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
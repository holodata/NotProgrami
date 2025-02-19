const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(bodyParser.json());

app.get('/api/notes', (req, res) => {
    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        const notes = JSON.parse(data);
        notes.unshift(newNote);
        fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.status(201).json(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
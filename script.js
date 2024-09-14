const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // or any port you prefer

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const leaderboardFilePath = path.join(__dirname, 'leaderboard.json');

// Get leaderboard data
app.get('/leaderboard', (req, res) => {
    fs.readFile(leaderboardFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading leaderboard data');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Update leaderboard data
app.post('/leaderboard', (req, res) => {
    const newEntry = req.body;

    fs.readFile(leaderboardFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading leaderboard data');
            return;
        }

        let leaderboard = JSON.parse(data);
        leaderboard.push(newEntry);
        leaderboard = leaderboard
            .sort((a, b) => b.time - a.time)
            .slice(0, 3); // Keep top 3 only

        fs.writeFile(leaderboardFilePath, JSON.stringify(leaderboard, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error updating leaderboard data');
                return;
            }
            res.send('Leaderboard updated');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

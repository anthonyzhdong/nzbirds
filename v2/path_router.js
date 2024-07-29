const express = require('express');
const pool = require('./db');
router = express.Router();
const multer = require('multer');

router.get('/', async (req, res) => {
    res.redirect('/birds')
});

router.get('/birds', async (req, res) => {
    conservation_status_data = []
    bird_data = []

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    const bird_query = `SELECT * FROM Bird
    INNER JOIN Photos ON Bird.bird_id = Photos.bird_id
    INNER JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
    ORDER BY Bird.bird_id ASC;`

    try {
        const [statusRows, statusFields] = await db.query(status_query);
        conservation_status_data = statusRows;
        const [birdRows, birdFields] = await db.query(bird_query);
        bird_data = birdRows;
    } catch (err) {
        console.error("You havent set up the database yet!");
    }
    res.render('index', { title: 'Birds of Aotearoa', birds: bird_data, status: conservation_status_data });
});

router.get('/birds/create', async (req, res) => {
    res.render('create');
});

router.get('/birds/:id/', async (req, res) => {
    conservation_status_data = []
    bird_data = []

    const db = pool.promise();

    const birdId = req.params.id;

    const status_query = `SELECT * FROM ConservationStatus;`

    const bird_query = `
        SELECT * FROM Bird
        INNER JOIN Photos ON Bird.bird_id = Photos.bird_id
        INNER JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
        WHERE Bird.bird_id = ?;`;

    try {
        const [statusRows, statusFields] = await db.query(status_query);
        conservation_status_data = statusRows;
        const [birdRows, birdFields] = await db.query(bird_query, [birdId]);
        bird_data = birdRows;

    } catch (err) {
        console.error('Error fetching bird details:');
    }

    res.render('view', { title: 'Birds of Aotearoa', birds: bird_data, status: conservation_status_data });
});

router.get('/birds/:id/edit', async (req, res) => {
    const db = pool.promise();

    const birdId = req.params.id;

    const bird_query = `
    SELECT * FROM Bird
    INNER JOIN Photos ON Bird.bird_id = Photos.bird_id
    INNER JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
    WHERE Bird.bird_id = ?;`;

    const status_query = `SELECT * FROM ConservationStatus;`;

    try {
        const [birdRows, birdFields] = await db.query(bird_query, [birdId]);
        bird_data = birdRows[0];

        const [statusRows, statusFields] = await db.query(status_query);
        conservation_status_data = statusRows;

    } catch (err) {
        console.error('Error fetching bird details:', err);
    }
    res.render('edit', { title: 'Edit: ' + bird_data.primary_name, birds: bird_data, status: conservation_status_data });

});

router.get('/birds/:id/delete', async (req, res) => {
    const db = pool.promise();

    const birdId = req.params.id;

    const delete_photo = `DELETE FROM Photos WHERE bird_id = ?;`
    const delete_bird = `DELETE FROM Bird WHERE bird_id = ?;`

    try {
        await db.query(delete_photo + " " + delete_bird, [birdId, birdId]);

    } catch (error) {
        console.error('Error deleting bird record:', error);
    }
    res.redirect('/birds');
});


var multipartUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, 'public/images/'); },
        filename: function (req, file, callback) { callback(null, file.originalname); }
    })
}).single('photo_upload');

router.post('/birds/edit', multipartUpload, async (req, res) => {
    const db = pool.promise();

    const reqBody = req.body;
    const reqFile = req.file;

    const bird_query = `UPDATE Bird SET
    primary_name = ?,
    english_name = ?,
    scientific_name = ?,
    order_name = ?,
    family = ?,
    length = ?,
    weight = ?,
    status_id = ?
    WHERE bird_id = ?;`;

    const photo_query = `UPDATE Photos SET filename = ?, photographer = ? WHERE bird_id = ?;`;

    try {
        const updateBird = await db.query(bird_query, [reqBody.primary_name, reqBody.english_name, reqBody.scientific_name, reqBody.order_name, reqBody.family, reqBody.length, reqBody.weight, reqBody.status_id, reqBody.bird_id]);

        if (reqFile != null) {
            const updatePhoto = await db.query(photo_query, [reqFile.originalname, reqBody.photographer, reqBody.bird_id]);
        }

    } catch (error) {
        console.error('Error updating bird details:', error);

    }
    res.redirect('/birds');
});

router.post('/birds/create', multipartUpload, async (req, res) => {
    const db = pool.promise();

    const reqBody = req.body;
    const reqFile = req.file;

    const bird_query = `INSERT INTO Bird (primary_name, english_name, scientific_name, order_name, family, length, weight, status_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

    const photo_query = `INSERT INTO Photos (filename, photographer, bird_id)
                        VALUES (?, ?, ?);`;

    try {
        const bird = await db.query(bird_query, [reqBody.primary_name, reqBody.english_name, reqBody.scientific_name, reqBody.order_name, reqBody.family, reqBody.length, reqBody.weight, reqBody.status_id]);

        const birdId = bird[0].insertId;
        if (reqFile != null) {
            const photo = await db.query(photo_query, [reqFile.originalname, reqBody.photographer, birdId]);
        }
    } catch (error) {
        console.error('Error creating bird:', error);
    }
    res.redirect('/birds');
});

module.exports = router;
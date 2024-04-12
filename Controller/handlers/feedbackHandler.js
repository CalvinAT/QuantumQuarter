const { connectToMySQL } = require('../dbConnection');

async function addFeedback(req, res){
    const {
        email,
        name,
        description,
        star
    } = req.body;

    try {
        if (email === undefined || name === undefined || star === undefined || description === undefined) {
            throw new Error("One or more required properties are missing.");
        }
        const pool = await connectToMySQL();
        await pool.query('INSERT INTO review (email, name, desc, star, date) VALUES (?, ?, ?, ?, CURDATE());', [email, name, description, star]);
        res.status(201).json({status: 201, message: 'Feedback successfully added'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getFeedback(req, res){
    try {
        const pool = await connectToMySQL();
        let [result] = await pool.query('SELECT * FROM review ORDER BY date desc');
        // Process the date for each row
        result = result.map(row => {
            // Parse the date string into a Date object
            const date = new Date(row.date);

            // Get the day, month, and year
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();

            // Format the date for output
            const formattedDate = `${day} ${month} ${year}`;
            return { ...row, date: formattedDate };
        });
        res.status(201).json({ status: 201, result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {getFeedback, addFeedback};
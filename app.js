const express = require('express');
const app = express();
app.use(express.json());

// Endpoint Utama API
app.post('/v1/sanitize', (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: "Input teks tidak boleh kosong." });
    }

    // Regex untuk mendeteksi Email dan Angka Kartu Kredit
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const creditCardRegex = /\b(?:\d[ -]*?){13,16}\b/g;

    let totalCensored = 0;
    let sanitizedText = text;
    
    // Proses Sensor Email
    const emailsFound = text.match(emailRegex);
    if (emailsFound) {
        totalCensored += emailsFound.length;
        sanitizedText = sanitizedText.replace(emailRegex, "[REDACTED_EMAIL]");
    }

    // Proses Sensor Kartu Kredit
    const cardsFound = text.match(creditCardRegex);
    if (cardsFound) {
        totalCensored += cardsFound.length;
        sanitizedText = sanitizedText.replace(creditCardRegex, "[REDACTED_CREDIT_CARD]");
    }

    // Kembalikan output JSON bersih
    res.json({
        success: true,
        censored_items_count: totalCensored,
        result: sanitizedText,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
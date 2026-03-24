const fs = require('fs');

// Teri input aur output files ke naam
const inputFile = 'chandrkanta.json'; // Yahan apni purani file ka naam daal
const outputFile = 'chandrkanta_clean.json';

try {
    // 1. JSON file ko read kar rahe hain
    let playlist = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

    // 2. Har video ke data pe operation
    playlist = playlist.map(video => {
        // Check kar rahe hain ki text mein comma hai ya nahi
        if (video.name.includes(',')) {
            // Regex ka jugaad: "Chapter 1:" (ya jo bhi number ho) usko extract kar lo
            const chapterMatch = video.name.match(/^(Chapter \d+:)/i);
            
            // Comma ke baad wala hissa (Hindi text) nikal kar uske aage-peeche ka space hata do
            const hindiText = video.name.split(',')[1].trim();
            
            // Agar Chapter prefix mila toh usko Hindi text ke sath jod do, warna sirf Hindi text
            video.name = chapterMatch ? `${chapterMatch[1]} ${hindiText}` : hindiText;
        }
        return video;
    });

    // 3. Wapas chakachak format me save kar rahe hain (bina kisi faltu sections ke)
    fs.writeFileSync(outputFile, JSON.stringify(playlist, null, 4));
    console.log("Boom! 💥 Ekdum Jasprit Bumrah ki yorker ki tarah English kachra clean ho gaya!");
    
} catch (err) {
    console.error("Arre bhai, error aagaya. File ka naam check kar lena! Error:", err.message);
}
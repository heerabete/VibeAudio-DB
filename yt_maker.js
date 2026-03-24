const { exec } = require('child_process');
const fs = require('fs');

// Teri YouTube playlist ki link
const playlistUrl = "https://youtube.com/playlist?list=PLAsrDfJrVPE62H-Knq2o5B9c7mKR4wfm7&si=Br8wjbCBIrn7IsLX";

// yt-dlp command jo har video ka saara metadata JSON format me nikalti hai
const command = `yt-dlp --dump-json --flat-playlist "${playlistUrl}"`;

console.log("Bhai, thoda wait kar... data extract ho raha hai!");

// Command run kar rahe hain (maxBuffer badhaya hai taaki badi playlist pe crash na ho)
exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
    if (error) {
        console.error(`Arre yaar, error aagaya: ${error.message}`);
        return;
    }

    // yt-dlp har video ka alag JSON object ek nayi line me deta hai
    const lines = stdout.trim().split('\n');
    
    // Data ko tere format me map kar rahe hain
    const finalData = lines.map((line, index) => {
        const videoData = JSON.parse(line);
        return {
            name: `Chapter ${index + 1}: ${videoData.title}`,
            url: videoData.url
        };
    });

    // File me save kar do (4 spaces ki formatting ke sath)
    fs.writeFileSync('Mansarovar1.json', JSON.stringify(finalData, null, 4));
    console.log("Boom! 💥 mansarovar1.json file database ke liye ready hai!");
});
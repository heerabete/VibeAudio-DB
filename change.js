const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.join(__dirname, 'books');

// Ye tera purana folder scan karne wala jugad
function getAllJsonFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJsonFiles(filePath, fileList); 
        } else if (filePath.endsWith('.json')) {
            fileList.push(filePath); 
        }
    }
    return fileList;
}

function updateAudioLinks() {
    console.log(`\n🚀 VibeAudio DB Updater: Operation 'Link Badlo'`);
    const jsonFiles = getAllJsonFiles(BOOKS_DIR);
    let updatedCount = 0;

    for (const file of jsonFiles) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            let book = JSON.parse(content);

            if (!book.bookId) continue;

            // Step 1: bookId se number extract karo (e.g., "book_145" -> 145)
            const bookNumMatch = book.bookId.match(/book_(\d+)/);
            if (!bookNumMatch) continue;
            
            const bookNum = parseInt(bookNumMatch[1]);

            // Step 2: Target ONLY book_141 to book_147
            if (bookNum >= 141 && bookNum <= 147) {
                let isModified = false;

                // Step 3: Check if chapters exist and loop through them
                if (book.chapters && Array.isArray(book.chapters)) {
                    book.chapters.forEach(chapter => {
                        if (chapter.url) {
                            const oldUrl = chapter.url;
                            
                            // Step 4: URL replace maro (using replaceAll to be safe)
                            chapter.url = chapter.url
                                .replaceAll('hanubhaiji', 'junabkr')
                                .replaceAll('newda_hin_3', 'hin_hi_1');

                            // Agar actual me kuch change hua tabhi flag true karo
                            if (oldUrl !== chapter.url) {
                                isModified = true;
                            }
                        }
                    });
                }

                // Step 5: Agar updates hue hain, toh JSON ko wapas save kar do
                if (isModified) {
                    // `null, 2` use kiya taaki JSON format bigde na, mast format me save ho
                    fs.writeFileSync(file, JSON.stringify(book, null, 2));
                    console.log(`✅ Updated links in: ${book.bookId} (${path.basename(file)})`);
                    updatedCount++;
                }
            }
        } catch (err) {
            console.error(`❌ Error in ${path.basename(file)}:`, err.message);
        }
    }

    console.log(`\n🎉 SAVAGE! Total ${updatedCount} books update kar di bhai ne!`);
}

updateAudioLinks();
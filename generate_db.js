const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.join(__dirname, 'books'); 
const OUTPUT_FILE = path.join(__dirname, 'catalog.json');

// 👇 TERA CLOUDFLARE PAGES URL 👇
const CLOUDFLARE_BASE_URL = 'https://vibeaudio-db.pages.dev';

// 🥷 NINJA FUNCTION: Subfolders ke andar ghus-ghus ke files dhoondna
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

function buildDatabase() {
    console.log(`\n🚀 Starting VibeAudio Cloudflare DB Compiler...`);
    
    const jsonFiles = getAllJsonFiles(BOOKS_DIR);
    const megaCatalog = [];
    
    console.log(`📂 Found ${jsonFiles.length} files. Generating dataPath links...`);

    for (const file of jsonFiles) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const book = JSON.parse(content);
            
            if (!book.bookId) continue;

            const hiCount = book.chapters ? book.chapters.length : 0;
            const enCount = book.chapters_en ? book.chapters_en.length : 0;

            // ⚡ FILE PATH CALCULATION: (e.g., books/Fantasy/witcher.json)
            // path.relative se humein repo root se file ka rasta mil jayega
            const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
            
            // 🔗 FINAL CLOUDFLARE URL
            const cloudflareUrl = `${CLOUDFLARE_BASE_URL}/${relativePath}`;

            // 📦 CATALOG ME SIRF METADATA (Low Fat, High Speed)
            megaCatalog.push({
                bookId: book.bookId,
                title: book.title,
                author: book.author || "Unknown",
                cover: book.cover || "",
                totalChapters: hiCount > 0 ? hiCount : enCount,
                dataPath: cloudflareUrl // Full JSON yahan se fetch hoga click par
            });

        } catch (err) {
            console.error(`❌ Error in ${path.basename(file)}:`, err.message);
        }
    }

    // JUGAD: Minified JSON write kar rahe hain taaki catalog.json ka size 0 ho jaye
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(megaCatalog));
    
    console.log(`🎉 SUCCESS: Compiled ${megaCatalog.length} books into catalog.json!`);
    console.log(`📡 All dataPaths are now pointing to Cloudflare Pages.`);
}

buildDatabase();
const fs = require('fs');
const path = require('path');

const BOOKS_DIR = path.join(__dirname, 'books'); 
const OUTPUT_FILE = path.join(__dirname, 'catalog.json');

// 🥷 NINJA FUNCTION: Subfolders ke andar ghus-ghus ke files dhoondna
function getAllJsonFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJsonFiles(filePath, fileList); // Folder ke andar folder
        } else if (filePath.endsWith('.json')) {
            fileList.push(filePath); // JSON file mil gayi!
        }
    }
    return fileList;
}

function buildDatabase() {
    console.log(`\n🚀 Starting VibeAudio DB Compiler...`);
    
    const jsonFiles = getAllJsonFiles(BOOKS_DIR);
    const megaCatalog = [];
    
    console.log(`📂 Found ${jsonFiles.length} files in all subfolders...`);

    for (const file of jsonFiles) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const book = JSON.parse(content);
            
            if (!book.bookId) continue;

            const hiCount = book.chapters ? book.chapters.length : 0;
            const enCount = book.chapters_en ? book.chapters_en.length : 0;
            book.totalChapters = hiCount > 0 ? hiCount : enCount;

            megaCatalog.push(book);
        } catch (err) {
            console.error(`❌ Error in ${path.basename(file)}:`, err.message);
        }
    }

    // 🔥 JUGAD: 'null, 2' hata diya. Ab ye Minified (bina spaces ki) ek line me file banayega. Size 40% chota!
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(megaCatalog));
    
    console.log(`🎉 SUCCESS: Compiled ${megaCatalog.length} books into catalog.json!`);
    console.log(`📉 File Size Optimized (Minified). Ready for GitHub!`);
}

buildDatabase();
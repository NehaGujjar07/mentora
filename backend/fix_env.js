const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    // Try reading as utf-16le first (common windows issue)
    let content = fs.readFileSync(envPath, 'utf16le');
    if (content.includes('MONGO_URI=')) {
        console.log('Detected UTF-16LE. Converting to UTF-8...');
        fs.writeFileSync(envPath, content, 'utf8');
        console.log('Fixed encoding.');
    } else {
        // Fallback or already utf8?
        content = fs.readFileSync(envPath, 'utf8');
        if (content.includes('MONGO_URI=')) {
            console.log('File seems to be UTF-8 already.');
        } else {
            console.log('Could not detect valid content in either encoding.');
        }
    }
} catch (e) {
    console.error('Error:', e.message);
}

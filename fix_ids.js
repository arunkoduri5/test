const fs = require('fs');
const path = require('path');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace raw <input type="date"> with <input id="date" type="date">
    content = content.replace(/<input type="date">/g, '<input id="date" type="date">');

    // Replace raw <input type="text" placeholder="Enter acres">
    content = content.replace(/<input type="text" placeholder="Enter acres">/g, '<input id="acres" type="number" placeholder="Enter acres">');
    // Just in case it was type="number" but missed ID
    content = content.replace(/<input type="number" placeholder="Enter acres">/g, '<input id="acres" type="number" placeholder="Enter acres">');

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Fixed missing IDs in HTML forms');

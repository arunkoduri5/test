const fs = require('fs');
const path = require('path');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Fix broken onclick handlers from previous regex
    content = content.replace(/window\.location\.searchEquipment/g, 'searchEquipment');
    content = content.replace(/window\.searchEquipment/g, 'searchEquipment');
    
    if (file === 'results.html') {
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Available Equipment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2 class="title">Available Machines</h2>
    <div id="machineList"></div>
    <script src="js/script.js"></script>
</body>
</html>`;
    }
    
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Fixed HTML files');

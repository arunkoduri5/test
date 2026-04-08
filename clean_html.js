const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Pattern to match `<div class="nav">...</div>`
    const regex = /<div class="nav">[\s\S]*?<\/div>/g;
    
    content = content.replace(regex, '');

    // For login.html: Ensure input ID is set
    if(file === 'login.html') {
        content = content.replace('<input type="text" placeholder="Enter Mobile Number">', '<input id="mobile" type="text" placeholder="Enter Mobile Number">');
    }

    // For tractor.html: Ensure button passes correct type to searchEquipment
    if(file === 'tractor.html') {
        content = content.replace('searchTractor()', "searchEquipment('tractor')");
    }
    if(file === 'harvester.html') {
        content = content.replace('href=\'results.html?type=harvester\'', 'searchEquipment(\'harvester\')'); // Example adjustment
    }
    if(file === 'sugarcane.html') {
        content = content.replace("location.href='results.html?type=sugarcane'", "searchEquipment('sugarcane')");
    }
    if(file === 'jcb.html') {
        content = content.replace("location.href='results.html?type=jcb'", "searchEquipment('jcb')");
    }
    if(file === 'drone.html' || file === 'spraying.html') {
        content = content.replace("location.href='results.html?type=drone'", "searchEquipment('drone')");
    }
    if(file === 'manualspray.html') {
         content = content.replace("location.href='results.html?type=sprayer'", "searchEquipment('sprayer')");
    }

    // Add script.js inclusion if not present and if it needs it (most should have it, but index definitely does to inject nav)
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '    <script src="js/script.js"></script>\n</body>');
    }

    // Specific clean for RESULTS page - Need to ensure `<div id="machineList"></div>` exists
    if(file === 'results.html') {
        content = content.replace(/<div class="card"[\s\S]*?<\/div>/, '<div id="machineList"></div>');
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});
console.log('Cleaned HTML files successfully');

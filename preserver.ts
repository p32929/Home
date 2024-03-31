import * as fs from 'fs';
import * as path from 'path';

// List of files to preserve
const filesToPreserve: string[] = ['home.png', 'manifest.json'];

// Source and destination paths
const srcDir: string = 'src'; // Adjust this to your source directory
const distDir: string = 'dist';

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy files to dist folder
filesToPreserve.forEach(file => {
    const srcFilePath: string = path.join(srcDir, file);
    const destFilePath: string = path.join(distDir, file);
    fs.copyFileSync(srcFilePath, destFilePath);
});

console.log(`Build complete with browser extension support`)
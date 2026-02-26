const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function generatePdfs() {
    const manualsDir = path.join(__dirname, '../manuals');
    const files = fs.readdirSync(manualsDir).filter(f => f.endsWith('.md') && (f.includes('Guide') || f.includes('Reference')));

    console.log(`Found ${files.length} manuals to convert...`);

    for (const file of files) {
        const mdPath = path.join(manualsDir, file);
        const pdfPath = mdPath.replace('.md', '.pdf');
        console.log(`Converting ${file} to PDF...`);
        try {
            await mdToPdf({ path: mdPath }, { dest: pdfPath });
            // Add a slight delay to allow Puppeteer to finish internal I/O before killing
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`Successfully generated ${path.basename(pdfPath)}`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }

    console.log('PDF generation complete. Exiting process safely.');
    process.exit(0); // Force exit to prevent Puppeteer hanging
}

generatePdfs();

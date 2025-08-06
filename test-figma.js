import axios from 'axios';

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FILE_KEY = '8nAwh2VPKWdHFDzkkw8E7y';
const TOKEN = process.env.FIGMA_ACCESS_TOKEN || 'YOUR_FIGMA_ACCESS_TOKEN';

async function getFileData() {
  try {
    console.log('Fetching Figma file data...');
    const response = await axios.get(`${FIGMA_API_BASE}/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': TOKEN,
      },
    });
    
    console.log('File Name:', response.data.name);
    console.log('Last Modified:', response.data.lastModified);
    console.log('Version:', response.data.version);
    console.log('Document Structure:', JSON.stringify(response.data.document, null, 2).substring(0, 500) + '...');
    
    // Count pages and frames
    const pages = response.data.document.children || [];
    console.log('\nPages found:', pages.length);
    
    pages.forEach((page, index) => {
      console.log(`\nPage ${index + 1}: ${page.name}`);
      const frames = page.children || [];
      console.log(`  Frames/Elements: ${frames.length}`);
      frames.slice(0, 3).forEach(frame => {
        console.log(`    - ${frame.name} (${frame.type})`);
      });
    });
    
  } catch (error) {
    console.error('Error fetching file:', error.response?.data || error.message);
  }
}

getFileData();
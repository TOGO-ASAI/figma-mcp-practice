import axios from 'axios';
import fs from 'fs';

const FIGMA_API_BASE = 'https://api.figma.com/v1';
const FILE_KEY = '8nAwh2VPKWdHFDzkkw8E7y';
const TOKEN = process.env.FIGMA_ACCESS_TOKEN || 'YOUR_FIGMA_ACCESS_TOKEN';

async function getFullDesignData() {
  try {
    console.log('Fetching complete Figma file data...');
    const response = await axios.get(`${FIGMA_API_BASE}/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': TOKEN,
      },
    });
    
    // Save full JSON for analysis
    fs.writeFileSync('figma-design-data.json', JSON.stringify(response.data, null, 2));
    console.log('Full design data saved to figma-design-data.json');
    
    // Extract key design information
    const document = response.data.document;
    const styles = response.data.styles || {};
    
    console.log('\n=== Design Details ===');
    console.log('File Name:', response.data.name);
    
    // Process pages and frames
    if (document.children) {
      document.children.forEach(page => {
        console.log(`\nPage: ${page.name}`);
        
        if (page.children) {
          page.children.forEach(frame => {
            console.log(`\n  Frame: ${frame.name}`);
            console.log(`  Size: ${frame.absoluteBoundingBox?.width}x${frame.absoluteBoundingBox?.height}`);
            console.log(`  Background:`, frame.backgroundColor);
            
            // Process frame children
            if (frame.children) {
              console.log(`  Elements (${frame.children.length}):`);
              frame.children.forEach(child => {
                console.log(`    - ${child.name} (${child.type})`);
                if (child.type === 'TEXT') {
                  console.log(`      Text: "${child.characters || ''}"`.substring(0, 100));
                  console.log(`      Font: ${child.style?.fontFamily || 'N/A'} ${child.style?.fontSize || 'N/A'}px`);
                }
                if (child.fills && child.fills[0]) {
                  console.log(`      Color:`, child.fills[0].color);
                }
              });
            }
          });
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

getFullDesignData();
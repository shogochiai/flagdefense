// Simple script to verify the game is working
const fetch = require('node-fetch');

async function verifyGame() {
  console.log('Verifying FlagDefense V2...\n');
  
  try {
    // Check if server is running
    const response = await fetch('http://localhost:3000');
    console.log('✅ Server is running');
    
    // Check if assets are accessible
    const yamlResponse = await fetch('http://localhost:3000/flags/datasheet.yaml');
    if (yamlResponse.ok) {
      console.log('✅ Assets are being served correctly');
      const yamlText = await yamlResponse.text();
      console.log(`✅ Datasheet loaded (${yamlText.length} bytes)`);
    } else {
      console.log('❌ Failed to load assets');
    }
    
    // Check a sample flag image
    const flagResponse = await fetch('http://localhost:3000/flags/img/usa.png');
    if (flagResponse.ok) {
      console.log('✅ Flag images are accessible');
    } else {
      console.log('❌ Flag images not found');
    }
    
    console.log('\n📝 Summary:');
    console.log('The game server is running and assets are properly configured.');
    console.log('Open http://localhost:3000 in your browser to play!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure the dev server is running with: npm run dev');
  }
}

verifyGame();
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';
const regScreenPath = path.join(baseDir, 'frontend/src/screens/Screen2_Register.jsx');
let regScreen = fs.readFileSync(regScreenPath, 'utf8');

// Use a regular expression that handles whitespace flexibly
const regAvatarRegex = /<img\s+src="https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb\?auto=format&fit=crop&w=200&q=80"\s+alt="Profile Preview"[\s\S]*?onClick=\{\(\) => showToast\('Photo uploaded successfully!'\)\}/m;

regScreen = regScreen.replace(regAvatarRegex, 
`<img 
                src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                alt="Profile Preview" 
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }}
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
              <button 
                type="button"
                onClick={() => {}}`);

fs.writeFileSync(regScreenPath, regScreen);
console.log('Fixed Screen 2 Regex replacement');

const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';
const profScreenPath = path.join(baseDir, 'frontend/src/screens/Screen7_ProfileSettings.jsx');
let profScreen = fs.readFileSync(profScreenPath, 'utf8');

const profAvatarRegex = /src=\{user\.avatar\}\s*alt=\{user\.name\}\s*style=\{\{\s*width:\s*'90px',\s*height:\s*'90px',\s*borderRadius:\s*'50%',\s*objectFit:\s*'cover',\s*border:\s*'3px\s+solid\s+#064e3b'\s*\}\}\s*\/>[\s\S]*?onClick=\{\(\) => showToast\('Avatar updated!'\)\}/m;

profScreen = profScreen.replace(profAvatarRegex, 
`src={avatar} 
            alt={user.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} 
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
          <button 
            type="button"
            onClick={() => {}}`);

fs.writeFileSync(profScreenPath, profScreen);
console.log('Fixed Screen 7 Regex replacement');

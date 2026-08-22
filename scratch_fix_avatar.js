const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';

// 1. SCREEN 2: REGISTER
const regScreenPath = path.join(baseDir, 'frontend/src/screens/Screen2_Register.jsx');
let regScreen = fs.readFileSync(regScreenPath, 'utf8');

regScreen = regScreen.replace(
  `<img \n                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" \n                alt="Profile Preview" \n                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }}\n              />\n              <button \n                type="button"\n                onClick={() => showToast('Photo uploaded successfully!')}`,
  `<img 
                src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                alt="Profile Preview" 
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }}
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
              <button 
                type="button"
                onClick={() => {}}`
);
fs.writeFileSync(regScreenPath, regScreen);


// 2. SCREEN 7: PROFILE
const profScreenPath = path.join(baseDir, 'frontend/src/screens/Screen7_ProfileSettings.jsx');
let profScreen = fs.readFileSync(profScreenPath, 'utf8');

profScreen = profScreen.replace(
  `src={user.avatar} \n            alt={user.name} \n            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} \n          />\n          <button \n            onClick={() => showToast('Avatar updated!')}`,
  `src={avatar} 
            alt={user.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} 
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
          <button 
            onClick={() => {}}`
);
fs.writeFileSync(profScreenPath, profScreen);

console.log('Fixed avatar uploads in both screens!');

const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';
const profScreenPath = path.join(baseDir, 'frontend/src/screens/Screen7_ProfileSettings.jsx');
let profScreen = fs.readFileSync(profScreenPath, 'utf8');

// 1. Add updateUser and setAvatar
profScreen = profScreen.replace(
  `const { user, setUser, destinations, setCurrentScreen, showToast } = useApp();`,
  `const { user, setUser, destinations, setCurrentScreen, showToast, updateUser } = useApp();`
);

profScreen = profScreen.replace(
  `const [activeTab, setActiveTab] = useState('Profile');`,
  `const [activeTab, setActiveTab] = useState('Profile');
  const [avatar, setAvatar] = useState(user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');`
);

// 2. Add handleImageUpload and update handleSave
const handleImageUploadProf = `
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      showToast('Image must be less than 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUser({
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      country: formData.country,
      currency: formData.currency,
      avatarUrl: avatar
    });
  };
`;

profScreen = profScreen.replace(
  `const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    showToast('Profile settings saved successfully!');
  };`,
  handleImageUploadProf
);

// 3. Update the avatar UI (again, just to be sure)
profScreen = profScreen.replace(
  `src={user.avatar} 
            alt={user.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} 
          />
          <button 
            onClick={() => showToast('Avatar updated!')}`,
  `src={avatar} 
            alt={user.name} 
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #064e3b' }} 
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }} />
          <button 
            type="button"
            onClick={() => {}}`
);

fs.writeFileSync(profScreenPath, profScreen);
console.log('Fixed Screen7 Profile Avatar!');

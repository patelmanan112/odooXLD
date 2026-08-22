const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';

// 1. UPDATE BACKEND CONTROLLER
const authCtrlPath = path.join(baseDir, 'backend/src/controllers/auth.controller.js');
let authCtrl = fs.readFileSync(authCtrlPath, 'utf8');

authCtrl = authCtrl.replace(
  'const { name, email, password } = req.body;',
  'const { name, email, password, avatarUrl, phone, city, country } = req.body;'
);

authCtrl = authCtrl.replace(
  `const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      }
    });`,
  `const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        phone,
        city,
        country
      }
    });`
);

authCtrl += `
export const updateMe = async (req, res, next) => {
  try {
    const { name, avatarUrl, phone, city, country, bio, currency } = req.body;
    const userId = req.user.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(avatarUrl && { avatarUrl }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(country && { country }),
        ...(bio && { bio }),
        ...(currency && { currency })
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        phone: updatedUser.phone,
        city: updatedUser.city,
        country: updatedUser.country,
        bio: updatedUser.bio,
        currency: updatedUser.currency
      }
    });
  } catch (error) {
    next(error);
  }
};
`;
fs.writeFileSync(authCtrlPath, authCtrl);


// 2. UPDATE BACKEND ROUTES
const authRoutesPath = path.join(baseDir, 'backend/src/routes/auth.routes.js');
let authRoutes = fs.readFileSync(authRoutesPath, 'utf8');

authRoutes = authRoutes.replace(
  `import { signup, login, checkEmail, getMe } from '../controllers/auth.controller.js';`,
  `import { signup, login, checkEmail, getMe, updateMe } from '../controllers/auth.controller.js';`
);
authRoutes = authRoutes.replace(
  `router.get('/me', authMiddleware, getMe);`,
  `router.get('/me', authMiddleware, getMe);\nrouter.put('/me', authMiddleware, updateMe);`
);
fs.writeFileSync(authRoutesPath, authRoutes);


// 3. UPDATE APP CONTEXT
const appContextPath = path.join(baseDir, 'frontend/src/context/AppContext.jsx');
let appContext = fs.readFileSync(appContextPath, 'utf8');

appContext = appContext.replace(
  `const signupUser = async (name, email, password) => {`,
  `const signupUser = async (userData) => {`
);

appContext = appContext.replace(
  `body: JSON.stringify({ name, email, password })`,
  `body: JSON.stringify(userData)`
);

// We should also add updateUser function to AppContext
const updateUserInsert = `
  const updateUser = async (updateData) => {
    try {
      const data = await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      setUser(prev => ({ ...prev, ...data.user }));
      showToast('Profile updated successfully!');
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to update profile');
      return false;
    }
  };
`;

appContext = appContext.replace(
  `const logout = (showToastMsg = true) => {`,
  `${updateUserInsert}\n  const logout = (showToastMsg = true) => {`
);

appContext = appContext.replace(
  `signupUser,\n    logout,`,
  `signupUser,\n    updateUser,\n    logout,`
);

fs.writeFileSync(appContextPath, appContext);


// 4. UPDATE REGISTER SCREEN
const regScreenPath = path.join(baseDir, 'frontend/src/screens/Screen2_Register.jsx');
let regScreen = fs.readFileSync(regScreenPath, 'utf8');

regScreen = regScreen.replace(
  `import { Mail, Phone, MapPin, Globe, Lock } from 'lucide-react';`,
  `import { Mail, Phone, MapPin, Globe, Lock, Upload } from 'lucide-react';`
);

regScreen = regScreen.replace(
  `confirmPassword: 'password123'`,
  `confirmPassword: 'password123',\n      avatarUrl: ''`
);

const handleImageUploadReg = `
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      showToast('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };
`;

regScreen = regScreen.replace(
  `const toggleStyle = (style) => {`,
  `${handleImageUploadReg}\n\n  const toggleStyle = (style) => {`
);

regScreen = regScreen.replace(
  `const result = await signupUser(fullName, formData.email, formData.password);`,
  `const result = await signupUser({ 
        name: fullName, 
        email: formData.email, 
        password: formData.password,
        avatarUrl: formData.avatarUrl,
        phone: formData.phone,
        city: formData.city,
        country: formData.country
      });`
);

const avatarInputReg = `
            {/* Avatar Upload */}
            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px',
                overflow: 'hidden', border: '2px dashed #cbd5e1', position: 'relative'
              }}>
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Upload size={24} color="#94a3b8" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Click to upload avatar (Max 1MB)</span>
            </div>
`;

regScreen = regScreen.replace(
  `<div className="grid-2">`,
  `${avatarInputReg}\n            <div className="grid-2">`
);

fs.writeFileSync(regScreenPath, regScreen);


// 5. UPDATE PROFILE SCREEN
const profScreenPath = path.join(baseDir, 'frontend/src/screens/Screen7_ProfileSettings.jsx');
let profScreen = fs.readFileSync(profScreenPath, 'utf8');

profScreen = profScreen.replace(
  `const { user, showToast } = useApp();`,
  `const { user, showToast, updateUser } = useApp();`
);

profScreen = profScreen.replace(
  `const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');`,
  `const [avatar, setAvatar] = useState(user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');`
);

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
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };
`;

profScreen = profScreen.replace(
  `const handleSave = () => {`,
  `${handleImageUploadProf}\n\n  const handleSave = async () => {`
);

profScreen = profScreen.replace(
  `showToast('Profile settings saved successfully');`,
  `await updateUser({
      name: formData.name,
      phone: formData.phone,
      city: formData.location.split(',')[0]?.trim(),
      country: formData.location.split(',')[1]?.trim(),
      currency: formData.currency,
      bio: formData.bio,
      avatarUrl: avatar
    });`
);

profScreen = profScreen.replace(
  `<div className="profile-upload-btn">`,
  `<div className="profile-upload-btn" style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />`
);

fs.writeFileSync(profScreenPath, profScreen);

console.log('All files updated successfully');

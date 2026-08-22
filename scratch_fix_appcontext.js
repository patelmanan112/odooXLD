const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';
const appContextPath = path.join(baseDir, 'frontend/src/context/AppContext.jsx');
let appContext = fs.readFileSync(appContextPath, 'utf8');

const updateUserInsert = `
  const updateUser = async (updateData) => {
    try {
      const data = await apiFetch('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      const formattedUser = {
        ...data.user,
        currency: data.user.currency || ',1',
        avatar: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setUser(prev => ({ ...prev, ...formattedUser }));
      localStorage.setItem('wanderly_user', JSON.stringify(formattedUser));
      showToast('Profile updated successfully!');
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to update profile');
      return false;
    }
  };
`;

appContext = appContext.replace(
  `const logout = (showNotification = true) => {`,
  `${updateUserInsert}\n  const logout = (showNotification = true) => {`
);

appContext = appContext.replace(
  `signupUser,\n    logout,`,
  `signupUser,\n    updateUser,\n    logout,`
);

fs.writeFileSync(appContextPath, appContext);
console.log('Re-added updateUser to AppContext');

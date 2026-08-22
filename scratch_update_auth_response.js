const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/MANAN/OneDrive/Desktop/odooXld';
const authCtrlPath = path.join(baseDir, 'backend/src/controllers/auth.controller.js');
let authCtrl = fs.readFileSync(authCtrlPath, 'utf8');

authCtrl = authCtrl.replace(
  `select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }`,
  `select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        city: true,
        country: true,
        bio: true,
        currency: true,
        createdAt: true,
        updatedAt: true
      }`
);

authCtrl = authCtrl.replace(
  `user: {
        id: user.id,
        name: user.name,
        email: user.email
      }`,
  `user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        currency: user.currency
      }`
);

// Do it again for signup, since it appears twice (once in signup, once in login)
authCtrl = authCtrl.replace(
  `user: {
        id: user.id,
        name: user.name,
        email: user.email
      }`,
  `user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        currency: user.currency
      }`
);

fs.writeFileSync(authCtrlPath, authCtrl);
console.log("Updated getMe, login and signup responses to include avatarUrl");

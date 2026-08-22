import app from './src/app.js';
import prisma from './src/config/prisma.js';

async function runTests() {
  console.log('=== STARTING BACKEND VERIFICATION TESTS ===');
  let server;
  const PORT = 5005;

  try {
    // 1. Ensure DB connection is active
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Database connected successfully.');

    // 2. Start Server
    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        resolve();
      });
    });

    const baseUrl = `http://localhost:${PORT}/api`;

    // 3. Health check
    console.log('\n--- 1. Health Check ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthRes.status, healthData);
    if (healthRes.status !== 200 || healthData.status !== 'ok') {
      throw new Error('Health check failed!');
    }

    // Generate unique emails for test
    const timestamp = Date.now();
    const adminUser = {
      name: 'Admin Master',
      email: `admin_${timestamp}@example.com`,
      password: 'adminpassword123'
    };
    const normalUser = {
      name: 'Normal Traveler',
      email: `traveler_${timestamp}@example.com`,
      password: 'userpassword123'
    };

    // 4. Signup Users
    console.log('\n--- 2. Signup Admin & Normal Users ---');
    const signupAdminRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminUser)
    });
    const signupAdminData = await signupAdminRes.json();
    if (signupAdminRes.status !== 201 || !signupAdminData.token) throw new Error('Signup Admin failed');
    const adminToken = signupAdminData.token;
    const adminUserId = signupAdminData.user.id;

    // Promote Admin User directly in DB for testing
    await prisma.user.update({
      where: { id: adminUserId },
      data: { role: 'ADMIN' }
    });

    const signupNormalRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalUser)
    });
    const signupNormalData = await signupNormalRes.json();
    const normalToken = signupNormalData.token;
    const normalUserId = signupNormalData.user.id;

    // 5. PART 8: Admin Security & Unauthenticated / Unauthorized Rejections
    console.log('\n--- 3. PART 8: Admin Security Rejection Tests (401 & 403) ---');
    const unauthDashRes = await fetch(`${baseUrl}/admin/dashboard`);
    if (unauthDashRes.status !== 401) throw new Error('Unauthenticated admin dashboard expected 401');

    const userDashRes = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${normalToken}` }
    });
    console.log('Normal User Admin Dashboard Response Status:', userDashRes.status);
    if (userDashRes.status !== 403) throw new Error('Normal user admin dashboard expected 403 Forbidden');

    const userUsersRes = await fetch(`${baseUrl}/admin/users`, {
      headers: { 'Authorization': `Bearer ${normalToken}` }
    });
    if (userUsersRes.status !== 403) throw new Error('Normal user admin users list expected 403 Forbidden');

    // 6. PART 8: Admin Dashboard Statistics
    console.log('\n--- 4. PART 8: GET /api/admin/dashboard ---');
    const adminDashRes = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const dashData = await adminDashRes.json();
    console.log('Admin Dashboard Stats Response:', adminDashRes.status, dashData);
    if (
      adminDashRes.status !== 200 ||
      typeof dashData.users !== 'number' ||
      typeof dashData.trips !== 'number' ||
      typeof dashData.totalExpenseAmount !== 'number'
    ) {
      throw new Error('Admin dashboard stats retrieval failed');
    }

    // 7. PART 8: User Management (List & Single)
    console.log('\n--- 5. PART 8: GET /api/admin/users & GET /api/admin/users/:userId ---');
    const adminUsersRes = await fetch(`${baseUrl}/admin/users?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const usersListData = await adminUsersRes.json();
    console.log('Admin Users List Count:', usersListData.data.length, 'Total:', usersListData.pagination.total);
    if (adminUsersRes.status !== 200 || usersListData.data.length < 2) {
      throw new Error('Admin users list retrieval failed');
    }

    // Confirm passwordHash is absent in user listing
    if (usersListData.data.some(u => u.passwordHash !== undefined)) {
      throw new Error('passwordHash exposed in admin users list!');
    }

    const singleUserRes = await fetch(`${baseUrl}/admin/users/${normalUserId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const singleUserData = await singleUserRes.json();
    console.log('Admin Single User Response:', singleUserRes.status, singleUserData.name, singleUserData.role);
    if (singleUserRes.status !== 200 || singleUserData.name !== normalUser.name || singleUserData.passwordHash !== undefined) {
      throw new Error('Admin single user retrieval failed or passwordHash exposed!');
    }

    // Non-existent user (404)
    const invalidUserRes = await fetch(`${baseUrl}/admin/users/non-existent-user-id`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (invalidUserRes.status !== 404) throw new Error('Non-existent user expected 404');

    // 8. PART 8: User Role Management (Promote & Demote)
    console.log('\n--- 6. PART 8: PUT /api/admin/users/:userId/role ---');
    // Normal user attempting role update (403)
    const userRoleAttempt = await fetch(`${baseUrl}/admin/users/${normalUserId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${normalToken}` },
      body: JSON.stringify({ role: 'ADMIN' })
    });
    if (userRoleAttempt.status !== 403) throw new Error('Normal user role change attempt expected 403');

    // Admin promotes Normal User -> ADMIN
    const promoteRes = await fetch(`${baseUrl}/admin/users/${normalUserId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'ADMIN' })
    });
    const promoteData = await promoteRes.json();
    console.log('Promote User Response:', promoteRes.status, promoteData.role);
    if (promoteRes.status !== 200 || promoteData.role !== 'ADMIN') throw new Error('User promotion failed');

    // Admin demotes User back -> USER
    const demoteRes = await fetch(`${baseUrl}/admin/users/${normalUserId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'USER' })
    });
    const demoteData = await demoteRes.json();
    console.log('Demote User Response:', demoteRes.status, demoteData.role);
    if (demoteRes.status !== 200 || demoteData.role !== 'USER') throw new Error('User demotion failed');

    // Invalid role string (400)
    const invalidRoleRes = await fetch(`${baseUrl}/admin/users/${normalUserId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ role: 'SUPERADMIN' })
    });
    if (invalidRoleRes.status !== 400) throw new Error('Invalid role string expected 400');

    // 9. PART 8: Admin Trip Management & Administrative Deletion
    console.log('\n--- 7. PART 8: Admin Trip Management & Administrative Delete ---');
    const createTripRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${normalToken}` },
      body: JSON.stringify({ title: 'Normal User Trip to be Deleted by Admin', startDate: '2026-10-01', endDate: '2026-10-10' })
    });
    const tripData = await createTripRes.json();
    if (createTripRes.status !== 201) throw new Error('Normal user trip creation failed');

    // Admin list trips
    const adminTripsRes = await fetch(`${baseUrl}/admin/trips`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminTripsData = await adminTripsRes.json();
    console.log('Admin Trips Count:', adminTripsData.length);
    if (adminTripsRes.status !== 200 || adminTripsData.length < 1) throw new Error('Admin trip listing failed');

    // Admin deletes Normal User's trip
    const adminDelTripRes = await fetch(`${baseUrl}/admin/trips/${tripData.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Admin Delete Trip Response:', adminDelTripRes.status);
    if (adminDelTripRes.status !== 200) throw new Error('Admin delete trip failed');

    // 10. PART 8: Admin City & Activity Management
    console.log('\n--- 8. PART 8: Admin City & Activity Management ---');
    // Create City
    const createCityRes = await fetch(`${baseUrl}/admin/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'Rome', country: 'Italy', description: 'Eternal City', imageUrl: 'https://example.com/rome.jpg' })
    });
    const cityData = await createCityRes.json();
    console.log('Admin City Created:', createCityRes.status, cityData.name);
    if (createCityRes.status !== 201 || cityData.name !== 'Rome') throw new Error('Admin city creation failed');

    // Update City
    const updateCityRes = await fetch(`${baseUrl}/admin/cities/${cityData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ description: 'Historic Capital of Italy' })
    });
    const updatedCityData = await updateCityRes.json();
    if (updateCityRes.status !== 200 || updatedCityData.description !== 'Historic Capital of Italy') throw new Error('Admin city update failed');

    // Create Activity
    const createActRes = await fetch(`${baseUrl}/admin/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ cityId: cityData.id, name: 'Colosseum Tour', description: 'Amphitheater tour', category: 'Sightseeing', estimatedCost: 350, effortLevel: 'MODERATE' })
    });
    const actData = await createActRes.json();
    console.log('Admin Activity Created:', createActRes.status, actData.name, actData.estimatedCost);
    if (createActRes.status !== 201 || actData.name !== 'Colosseum Tour' || actData.estimatedCost !== 350) throw new Error('Admin activity creation failed');

    // Update Activity
    const updateActRes = await fetch(`${baseUrl}/admin/activities/${actData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ estimatedCost: 400 })
    });
    const updatedActData = await updateActRes.json();
    if (updateActRes.status !== 200 || updatedActData.estimatedCost !== 400) throw new Error('Admin activity update failed');

    // Delete Activity
    const delActRes = await fetch(`${baseUrl}/admin/activities/${actData.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (delActRes.status !== 200) throw new Error('Admin delete activity failed');

    // Delete City
    const delCityRes = await fetch(`${baseUrl}/admin/cities/${cityData.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (delCityRes.status !== 200) throw new Error('Admin delete city failed');

    // 11. Cleanup Test Records
    console.log('\n--- 9. Cleanup Test Records ---');
    await prisma.user.deleteMany({ where: { id: { in: [adminUserId, normalUserId] } } });

    console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
      console.log('Test server closed.');
    }
    await prisma.$disconnect();
  }
}

runTests();

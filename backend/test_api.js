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
    const userA = {
      name: 'User Alpha',
      email: `user_a_${timestamp}@example.com`,
      password: 'password123'
    };
    const userB = {
      name: 'User Beta',
      email: `user_b_${timestamp}@example.com`,
      password: 'password456'
    };

    // 4. Signup Users
    console.log('\n--- 2. Signup User A & B ---');
    const signupARes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA)
    });
    const signupAData = await signupARes.json();
    if (signupARes.status !== 201 || !signupAData.token) throw new Error('Signup A failed');
    const tokenA = signupAData.token;

    const signupBRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB)
    });
    const signupBData = await signupBRes.json();
    const tokenB = signupBData.token;

    // 5. Create Trips for User A and User B
    console.log('\n--- 3. Create Trips (User A & User B) ---');
    const tripARes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({
        title: 'EuroTrip 2026',
        estimatedBudget: 20000,
        startDate: '2026-10-01',
        endDate: '2026-10-15'
      })
    });
    const tripAData = await tripARes.json();
    if (tripARes.status !== 201) throw new Error('Trip A creation failed');
    const tripIdA = tripAData.id;

    const tripBRes = await fetch(`${baseUrl}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({
        title: 'Asia Tour 2026',
        estimatedBudget: 10000,
        startDate: '2026-11-01',
        endDate: '2026-11-10'
      })
    });
    const tripBData = await tripBRes.json();
    const tripIdB = tripBData.id;

    // 6. PART 6B: Unauthenticated Access Rejections (401)
    console.log('\n--- 4. PART 6B: Unauthenticated Expense Access (401) ---');
    const unauthPostRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hotel', amount: 5000 })
    });
    if (unauthPostRes.status !== 401) throw new Error('Unauthenticated POST expense expected 401');

    const unauthGetRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`);
    if (unauthGetRes.status !== 401) throw new Error('Unauthenticated GET expenses expected 401');

    // 7. PART 6B: Create Expense Validation Error Tests
    console.log('\n--- 5. PART 6B: Create Expense Validation Error Tests ---');
    // Missing title (400)
    const noTitleRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ amount: 1000 })
    });
    if (noTitleRes.status !== 400) throw new Error('Missing title expected 400');

    // Empty title (400)
    const emptyTitleRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: '   ', amount: 1000 })
    });
    if (emptyTitleRes.status !== 400) throw new Error('Empty title expected 400');

    // Missing amount (400)
    const noAmountRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Hotel' })
    });
    if (noAmountRes.status !== 400) throw new Error('Missing amount expected 400');

    // Negative amount (400)
    const negAmountRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Hotel', amount: -500 })
    });
    if (negAmountRes.status !== 400) throw new Error('Negative amount expected 400');

    // Invalid category (400)
    const invalidCatRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Hotel', amount: 5000, category: 'INVALID_CAT' })
    });
    if (invalidCatRes.status !== 400) throw new Error('Invalid category expected 400');

    // Invalid date (400)
    const invalidDateRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Hotel', amount: 5000, date: 'invalid-date' })
    });
    if (invalidDateRes.status !== 400) throw new Error('Invalid date expected 400');

    // Non-existent Trip (404)
    const nonExistentTripRes = await fetch(`${baseUrl}/trips/non-existent-trip-id/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Hotel', amount: 5000 })
    });
    if (nonExistentTripRes.status !== 404) throw new Error('Non-existent trip expected 404');

    console.log('Create Expense Validation Error Tests Passed!');

    // 8. PART 6B: Create Valid Expenses & Verify Numeric Formatting
    console.log('\n--- 6. PART 6B: Create Valid Expenses ---');
    const exp1Res = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Boutique Hotel Stay', amount: 2500, category: 'ACCOMMODATION', date: '2026-10-02' })
    });
    const exp1Data = await exp1Res.json();
    console.log('Expense 1 Created:', exp1Res.status, exp1Data.id, exp1Data.amount, typeof exp1Data.amount);
    if (exp1Res.status !== 201 || exp1Data.amount !== 2500 || typeof exp1Data.amount !== 'number') {
      throw new Error('Expense 1 creation or amount formatting failed');
    }

    const exp2Res = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Train Pass', amount: 1500, category: 'TRANSPORT' })
    });
    const exp2Data = await exp2Res.json();

    const exp3Res = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ title: 'Museum Guided Tour', amount: 1000, category: 'ACTIVITIES' })
    });
    const exp3Data = await exp3Res.json();

    // 9. PART 6B: GET Trip Expenses
    console.log('\n--- 7. PART 6B: GET Trip Expenses ---');
    const getExpRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const expList = await getExpRes.json();
    console.log('Expenses Count:', expList.length, expList.map(e => e.title));
    if (expList.length !== 3 || expList[0].amount !== 1000) {
      throw new Error('GET Trip Expenses failed');
    }

    // 10. PART 6B: GET Single Expense & Scope Security Isolation
    console.log('\n--- 8. PART 6B: GET Single Expense & Scope Isolation ---');
    const getSingleExpRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const singleExpData = await getSingleExpRes.json();
    console.log('Single Expense Response:', getSingleExpRes.status, singleExpData.title);
    if (getSingleExpRes.status !== 200 || singleExpData.title !== 'Boutique Hotel Stay') {
      throw new Error('GET single expense failed');
    }

    // User B attempting to access User A's expense (404)
    const crossUserGetExp = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    if (crossUserGetExp.status !== 404) throw new Error('Cross-user expense GET expected 404');

    // Accessing Expense A via Trip B URL (404)
    const crossTripGetExp = await fetch(`${baseUrl}/trips/${tripIdB}/expenses/${exp1Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (crossTripGetExp.status !== 404) throw new Error('Cross-trip expense GET expected 404');

    // 11. PART 6B: UPDATE Expense (Partial & Security Rejections)
    console.log('\n--- 9. PART 6B: PUT /api/trips/:tripId/expenses/:expenseId ---');
    const updateExpRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp1Data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ amount: 3000, title: 'Luxury Hotel Stay' })
    });
    const updatedExpData = await updateExpRes.json();
    console.log('Updated Expense Response:', updateExpRes.status, updatedExpData.title, updatedExpData.amount);
    if (updateExpRes.status !== 200 || updatedExpData.amount !== 3000 || updatedExpData.category !== 'ACCOMMODATION') {
      throw new Error('Update expense failed');
    }

    // Protected field modification attempt (tripId/userId) (400)
    const protectedUpdateRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp1Data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ tripId: tripIdB })
    });
    if (protectedUpdateRes.status !== 400) throw new Error('Protected field update attempt expected 400');

    // 12. PART 6B: GET Expense Summary
    console.log('\n--- 10. PART 6B: GET /api/trips/:tripId/expenses/summary ---');
    const summaryRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/summary`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    const summaryData = await summaryRes.json();
    console.log('Expense Summary Response:', summaryRes.status, summaryData);
    // exp1=3000, exp2=1500, exp3=1000 => totalSpent=5500, estimatedBudget=20000 => remainingBudget=14500
    if (
      summaryRes.status !== 200 ||
      summaryData.totalSpent !== 5500 ||
      summaryData.estimatedBudget !== 20000 ||
      summaryData.remainingBudget !== 14500
    ) {
      throw new Error('Expense summary calculation failed!');
    }

    // User B attempting to access User A's expense summary (404)
    const crossUserSummaryRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/summary`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    if (crossUserSummaryRes.status !== 404) throw new Error('Cross-user expense summary expected 404');

    // 13. PART 6B: DELETE Expense
    console.log('\n--- 11. PART 6B: DELETE /api/trips/:tripId/expenses/:expenseId ---');
    const deleteExpRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp3Data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('Delete Expense Response Status:', deleteExpRes.status);
    if (deleteExpRes.status !== 200) throw new Error('Delete expense failed');

    // Verify Expense 3 is deleted but Trip A STILL EXISTS
    const checkDeletedExpRes = await fetch(`${baseUrl}/trips/${tripIdA}/expenses/${exp3Data.id}`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (checkDeletedExpRes.status !== 404) throw new Error('Deleted expense verification failed');

    const checkTripStillExists = await prisma.trip.findUnique({ where: { id: tripIdA } });
    if (!checkTripStillExists) throw new Error('Deleting expense accidentally deleted parent Trip!');
    console.log('Parent Trip preserved:', checkTripStillExists.title);

    // 14. Cleanup Test Records
    console.log('\n--- 12. Cleanup Test Records ---');
    await prisma.trip.deleteMany({ where: { id: { in: [tripIdA, tripIdB] } } });
    await prisma.user.deleteMany({ where: { email: { in: [userA.email, userB.email] } } });

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

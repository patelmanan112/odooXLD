import prisma from '../config/prisma.js';

const VALID_CATEGORIES = ['FOOD', 'TRANSPORT', 'ACCOMMODATION', 'ACTIVITIES', 'SHOPPING', 'OTHER'];

const formatExpense = (expense) => {
  if (!expense) return null;
  return {
    ...expense,
    amount: expense.amount !== undefined && expense.amount !== null ? Number(expense.amount) : 0
  };
};

const verifyTripOwnership = async (userId, tripId) => {
  if (!tripId || typeof tripId !== 'string') {
    return { error: { status: 400, message: 'Invalid trip ID.' } };
  }
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId }
  });
  if (!trip) {
    return { error: { status: 404, message: 'Trip not found or permission denied.' } };
  }
  return { trip };
};

export const createExpense = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const { title, amount, category, date } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title is required and must be a non-empty string.'
      });
    }

    if (amount === undefined || amount === null || typeof amount === 'boolean') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Amount is required.'
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Amount must be a non-negative number.'
      });
    }

    let validCategory = 'OTHER';
    if (category !== undefined && category !== null && String(category).trim() !== '') {
      const upperCategory = String(category).trim().toUpperCase();
      if (!VALID_CATEGORIES.includes(upperCategory)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid category. Allowed values: ${VALID_CATEGORIES.join(', ')}`
        });
      }
      validCategory = upperCategory;
    }

    let parsedDate = null;
    if (date !== undefined && date !== null && String(date).trim() !== '') {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid date format.'
        });
      }
    }

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        title: title.trim(),
        amount: numAmount,
        category: validCategory,
        date: parsedDate
      }
    });

    return res.status(201).json(formatExpense(expense));
  } catch (error) {
    next(error);
  }
};

export const getTripExpenses = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(expenses.map(formatExpense));
  } catch (error) {
    next(error);
  }
};

export const getExpenseSummary = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }
    const { trip } = ownership;

    const aggregateResult = await prisma.expense.aggregate({
      where: { tripId },
      _sum: { amount: true }
    });

    const totalSpent = aggregateResult._sum.amount !== null && aggregateResult._sum.amount !== undefined ? Number(aggregateResult._sum.amount) : 0;
    const estimatedBudget = trip.estimatedBudget !== undefined && trip.estimatedBudget !== null ? Number(trip.estimatedBudget) : 0;
    const remainingBudget = Math.max(0, estimatedBudget - totalSpent);

    return res.status(200).json({
      totalSpent,
      estimatedBudget,
      remainingBudget
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleExpense = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const { expenseId } = req.params;

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Not Found', message: 'Expense not found in specified trip.' });
    }

    return res.status(200).json(formatExpense(expense));
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const { expenseId } = req.params;
    const {
      title,
      amount,
      category,
      date,
      id,
      tripId: bodyTripId,
      userId: bodyUserId,
      createdAt,
      updatedAt
    } = req.body;

    if (id !== undefined || bodyTripId !== undefined || bodyUserId !== undefined || createdAt !== undefined || updatedAt !== undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Modification of protected fields (id, tripId, userId, createdAt, updatedAt) is not allowed.'
      });
    }

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Not Found', message: 'Expense not found in specified trip.' });
    }

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Title must be a non-empty string.' });
      }
      updateData.title = title.trim();
    }

    if (amount !== undefined && amount !== null) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || !isFinite(numAmount) || numAmount < 0) {
        return res.status(400).json({ error: 'Validation Error', message: 'Amount must be a non-negative number.' });
      }
      updateData.amount = numAmount;
    }

    if (category !== undefined && category !== null) {
      const upperCategory = String(category).trim().toUpperCase();
      if (!VALID_CATEGORIES.includes(upperCategory)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid category. Allowed values: ${VALID_CATEGORIES.join(', ')}`
        });
      }
      updateData.category = upperCategory;
    }

    if (date !== undefined) {
      if (date === null || String(date).trim() === '') {
        updateData.date = null;
      } else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: 'Validation Error', message: 'Invalid date format.' });
        }
        updateData.date = parsedDate;
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: updateData
    });

    return res.status(200).json(formatExpense(updatedExpense));
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const { expenseId } = req.params;

    const ownership = await verifyTripOwnership(req.user.userId, tripId);
    if (ownership.error) {
      return res.status(ownership.error.status).json({ error: 'Not Found', message: ownership.error.message });
    }

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Not Found', message: 'Expense not found in specified trip.' });
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    return res.status(200).json({
      message: 'Expense deleted successfully',
      expenseId
    });
  } catch (error) {
    next(error);
  }
};

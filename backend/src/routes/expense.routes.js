import { Router } from 'express';
import {
  createExpense,
  getTripExpenses,
  getExpenseSummary,
  getSingleExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controller.js';

const router = Router({ mergeParams: true });

router.post('/', createExpense);
router.get('/', getTripExpenses);
router.get('/summary', getExpenseSummary);
router.get('/:expenseId', getSingleExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

export default router;

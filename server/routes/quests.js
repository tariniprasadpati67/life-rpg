import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getQuests,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
  generateDailyQuests
} from '../controllers/questController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getQuests);
router.post('/', createQuest);
router.post('/generate-daily', generateDailyQuests);
router.put('/:id', updateQuest);
router.delete('/:id', deleteQuest);
router.post('/:id/complete', completeQuest);

export default router;

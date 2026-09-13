import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { 
  getProfile, 
  updateProfile, 
  getLeaderboard,
  buyShopItem,
  equipCosmetic,
  unequipCosmetic,
  convertCurrency
} from '../controllers/progressController.js';

const router = express.Router();

// Public leaderboard route (accessible by everyone, tracks isYou if token provided)
router.get('/leaderboard', optionalAuth, getLeaderboard);

// Protected routes
router.use(requireAuth);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Authoritative Shop Actions
router.post('/shop/buy', buyShopItem);
router.post('/shop/equip', equipCosmetic);
router.post('/shop/unequip', unequipCosmetic);
router.post('/shop/convert', convertCurrency);
router.post('/convert-currency', convertCurrency);

export default router;

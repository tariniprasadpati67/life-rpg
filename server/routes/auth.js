import express from 'express';
import { 
  getSystemStatus, 
  loginGuest, 
  registerUser, 
  changePassword,
  resetPassword,
  resolveEmail
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', getSystemStatus);
router.get('/resolve-email', resolveEmail);
router.post('/register', registerUser);
router.post('/guest', loginGuest);
router.post('/reset-password', resetPassword);
router.post('/change-password', requireAuth, changePassword);

export default router;

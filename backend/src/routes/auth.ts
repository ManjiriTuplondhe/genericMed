import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, UserAccount } from '../db';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';
import { isEmail, isNonEmptyString } from '../utils/validators';
import { UserProfile } from '../types';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password, role, quickLogin } = req.body;

  // Support quick demo profile login
  if (quickLogin && role) {
    const demoUser = db.findUserByEmail(`${role}@demo.internal`) ||
      db.findUserById(
        role === 'patient'
          ? 'usr_849201'
          : role === 'pharmacist'
          ? 'usr_pharm_01'
          : role === 'developer'
          ? 'usr_dev_01'
          : 'usr_admin_01'
      );

    if (demoUser) {
      const token = generateToken(demoUser);
      res.json({
        success: true,
        token,
        user: demoUser
      });
      return;
    }
  }

  if (!email || !isEmail(email)) {
    res.status(400).json({
      error: 'Please provide a valid email address.',
      code: 'INVALID_EMAIL'
    });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({
      error: 'Invalid credentials. No user found with that email.',
      code: 'AUTH_FAILED'
    });
    return;
  }

  if (password && user.passwordHash) {
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({
        error: 'Invalid password provided.',
        code: 'INVALID_PASSWORD'
      });
      return;
    }
  }

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user
  });
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, role = 'patient', orgName, zipCode } = req.body;

  if (!isNonEmptyString(name)) {
    res.status(400).json({ error: 'Name is required.', code: 'INVALID_NAME' });
    return;
  }

  if (!isEmail(email)) {
    res.status(400).json({ error: 'A valid email is required.', code: 'INVALID_EMAIL' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'A user with this email already exists.', code: 'EMAIL_EXISTS' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = password ? await bcrypt.hash(password, salt) : undefined;

  const newUser: UserAccount = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: role as UserProfile['role'],
    roleTitle: role === 'patient' ? 'Verified Patient' : role === 'pharmacist' ? 'Staff Pharmacist' : 'API Developer',
    orgName: orgName || 'genericMed Community Network',
    zipCode: zipCode || '11201',
    passwordHash,
    twoFactorEnabled: false
  };

  db.registerUser(newUser);
  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: 'User registration successful.',
    token,
    user: newUser
  });
});

// GET /api/auth/me - Verify current session
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    return;
  }
  const user = db.findUserById(req.user.id);
  res.json({ user: user || req.user });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Session revoked successfully.'
  });
});

export default router;

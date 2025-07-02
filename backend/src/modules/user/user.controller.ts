// src/modules/user/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError';

import {
  fetchUserById,
  updateUserProfile,
  deleteUserAccount,
} from './user.service';

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;  // ← early return to narrow req.user
    }

    const userId = req.user.id;                      // ← safely extract
    const user = await fetchUserById(userId);
    res.json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;  // ← early return
    }

    const userId = req.user.id;                      // ← safely extract
    const updated = await updateUserProfile(userId, req.body);
    res.json({ status: 'success', user: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;  // ← early return
    }

    const userId = req.user.id;                      // ← safely extract
    await deleteUserAccount(userId);
    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
}

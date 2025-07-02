import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from './category.model';
import { ApiError } from '../../utils/apiError';

export async function listCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categories = await CategoryModel.listAll();
    res.json({ status: 'success', categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body as { name: string };
    const category = await CategoryModel.create({ name });
    res.status(201).json({ status: 'success', category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const updated = await CategoryModel.update(id, { name });
    res.json({ status: 'success', category: updated });
  } catch (err) {
    // Prisma throws if id not found → catch & convert
    if ((err as any)?.code === 'P2025') {
      return next(new ApiError(404, 'Category not found'));
    }
    next(err);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    await CategoryModel.delete(id);
    res.status(204).send(); // No Content
  } catch (err) {
    if ((err as any)?.code === 'P2025') {
      return next(new ApiError(404, 'Category not found'));
    }
    next(err);
  }
}
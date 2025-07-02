import { Request, Response, NextFunction } from 'express';

import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './product.service';

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      page,
      limit,
    } = req.query as Record<string, string | undefined>;

    const filters = {
      q,
      categoryId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page:  page  ? Number(page)  : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const result = await listProducts(filters, pagination);
    res.json({ status: 'success', ...result });
  } catch (err) {
    next(err);
  }
}

export async function getSingleProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const idOrSlug = req.params.idOrSlug;

    /* Decide whether it's a UUID/ID or a slug (crude check: contains '-') */
    const product = await getProduct(
      idOrSlug.includes('-')
        ? { id: idOrSlug }
        : { slug: idOrSlug },
    );

    res.json({ status: 'success', product });
  } catch (err) {
    next(err);
  }
}

export async function createProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ status: 'success', product });
  } catch (err) {
    next(err);
  }
}

export async function updateProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await updateProduct(id, req.body);
    res.json({ status: 'success', product: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProductHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
}
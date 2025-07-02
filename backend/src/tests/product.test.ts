import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  listProducts,
  getProduct,
} from '../modules/product/product.service';
import { ApiError } from '../utils/apiError';


vi.mock('../modules/product/product.model', () => ({
  ProductModel: {
    list:     vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
  },
}));

import { ProductModel } from '../modules/product/product.model';

const mockedPM = ProductModel as unknown as {
  list: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  findBySlug: ReturnType<typeof vi.fn>;
};



beforeEach(() => {
  vi.clearAllMocks();
});

        
describe('Product Service', () => {
  it('listProducts → returns items & pagination meta', async () => {
    const fakeResult = {
      items: [{ id: 'p1', name: 'Headphones', price: 59.99 }],
      total: 1,
      page: 1,
      pageCount: 1,
    };

    mockedPM.list.mockResolvedValueOnce(fakeResult);

    const res = await listProducts({}, { page: 1, limit: 20 });

    expect(mockedPM.list).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 20 },
      { createdAt: 'desc' },
      expect.any(Object),   // publicSelect
    );
    expect(res).toEqual(fakeResult);
  });

  it('getProduct(id) → returns the product', async () => {
    const product = { id: 'p2', name: 'Watch', slug: 'watch' };
    mockedPM.findById.mockResolvedValueOnce(product);

    const res = await getProduct({ id: 'p2' });

    expect(mockedPM.findById).toHaveBeenCalledWith(
      'p2',
      expect.any(Object),
    );
    expect(res).toEqual(product);
  });

  it('getProduct(slug) → throws 404 when not found', async () => {
    mockedPM.findBySlug.mockResolvedValueOnce(null);

    await expect(getProduct({ slug: 'missing-prod' })).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});

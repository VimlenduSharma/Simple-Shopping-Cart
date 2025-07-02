import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = 'Admin#123'; // change in production!
  const passwordHash  = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email:        'admin@example.com',
      passwordHash,
      firstName:    'Admin',
      lastName:     'User',
      isAdmin:      true,
    },
  });
  console.log('✅ Admin user created (email=admin@example.com, password=' + adminPassword + ')');
  const categories = ['Electronics', 'Fashion', 'Home', 'Food'];
  for (const name of categories) {
    await prisma.category.upsert({
      where:  { name },
      update: {},
      create: { name },
    });
    console.log(`✅ Category upserted: ${name}`);
  }

  const products: Prisma.ProductCreateInput[] = [
    {
      name:        'Premium Wireless Headphones',
      slug:        'premium-wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price:       new Prisma.Decimal(299.99),
      stock:       50,
      images:      ['https://example.com/images/headphones.jpg'],
      rating:      4.8,
      ratingCount: 1205,
      category:    { connect: { name: 'Electronics' } },
    },
    {
      name:        'Vintage Leather Backpack',
      slug:        'vintage-leather-backpack',
      description: 'Stylish vintage leather backpack for everyday use.',
      price:       new Prisma.Decimal(89.99),
      stock:       80,
      images:      ['https://example.com/images/backpack.jpg'],
      rating:      4.6,
      ratingCount: 892,
      category:    { connect: { name: 'Fashion' } },
    },
    {
      name:        'Smart Fitness Watch',
      slug:        'smart-fitness-watch',
      description: 'Advanced fitness tracking with heart rate monitor.',
      price:       new Prisma.Decimal(199.99),
      stock:       100,
      images:      ['https://example.com/images/watch.jpg'],
      rating:      4.7,
      ratingCount: 2340,
      category:    { connect: { name: 'Electronics' } },
    },
    // …add more products as desired…
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where:  { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`✅ Product upserted: ${product.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

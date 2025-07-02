import { Prisma, User } from '@prisma/client';
import { prisma } from '../../config/db';

export const UserModel = {
  /** Create a new user */
  create(data: Prisma.UserCreateInput, select?: Prisma.UserSelect) {
    return prisma.user.create({ data, ...(select && { select }) });
  },

  /** Find by primary key */
  findById(id: string, select?: Prisma.UserSelect) {
    return prisma.user.findUnique({ where: { id }, ...(select && { select }) });
  },

  /** Find by unique e-mail */
  findByEmail(email: string, select?: Prisma.UserSelect) {
    return prisma.user.findUnique({ where: { email }, ...(select && { select }) });
  },

  /** Update any column(s) */
  update(id: string, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect) {
    return prisma.user.update({ where: { id }, data, ...(select && { select }) });
  },

  /** Delete user (use with care!) */
  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  /** Paginated / filtered list (pass any Prisma `findMany` args) */
  list(args: Prisma.UserFindManyArgs = {}) {
    return prisma.user.findMany(args);
  },
};

export type PublicUser = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'createdAt'
>;

export function toPublicUser(user: User): PublicUser {
  const { id, email, firstName, lastName, createdAt } = user;
  return { id, email, firstName, lastName, createdAt };
}
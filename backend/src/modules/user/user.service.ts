import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

import { UserModel, toPublicUser, PublicUser } from './user.model';
import { ApiError } from '../../utils/apiError';

export async function fetchUserById(userId: string): Promise<PublicUser> {
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return toPublicUser(user);
}

type UpdateProfileInput = Prisma.UserUpdateInput & {
  currentPassword?: string; // for password change flow
  newPassword?: string;
};

export async function updateUserProfile(
  userId: string,
  data: UpdateProfileInput,
): Promise<PublicUser> {
  const { currentPassword, newPassword, ...profileUpdates } = data;

  /* Fetch user (including hash) */
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  /* Email uniqueness check */
  if (profileUpdates.email && profileUpdates.email !== user.email) {
    const taken = await UserModel.findByEmail(profileUpdates.email as string);
    if (taken) throw new ApiError(409, 'Email already in use');
  }

  /* Password change flow */
  if (newPassword) {
    if (!currentPassword) {
      throw new ApiError(400, 'Current password is required to set a new one');
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new ApiError(401, 'Current password is incorrect');

    (profileUpdates as any).passwordHash = await bcrypt.hash(newPassword, 12);
  }

  /* Persist changes */
  const updated = await UserModel.update(userId, profileUpdates);

  return toPublicUser(updated);
}

/* -------------------------------------------------------------------------- */
/* 3. (Optional) Account deletion                                             */
/* -------------------------------------------------------------------------- */

export async function deleteUserAccount(userId: string): Promise<void> {
  await UserModel.delete(userId);
}
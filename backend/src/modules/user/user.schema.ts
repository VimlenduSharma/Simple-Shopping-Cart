import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    firstName:     z.string().min(1).optional(),
    lastName:      z.string().min(1).optional(),
    email:         z.string().email().optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword:     z.string().min(6).optional(),
  })
  /* If newPassword is present, currentPassword must be too */
  .superRefine((data, ctx) => {
    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        path: ['currentPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Current password is required to set a new password',
      });
    }
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
import { AdminModel } from '@/db/models/admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { ClientSession } from 'mongoose';

const SALT_ROUNDS = 10;

/**
 * Creates a new admin.
 */
export const createAdminService = async (data: { name: string; email: string; password: string }, session?: ClientSession) => {
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const [admin] = await AdminModel.create(
    [
      {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    ],
    { session }
  );

  return admin;
};

/**
 * Signs in an admin.
 * Looks up the admin by email, verifies the password, generates both an access token and a refresh token,
 * and then updates the admin record with the new refresh token.
 */
export const signInAdminService = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const admin = await AdminModel.findOne({ email, archivedAt: null });
  if (!admin) {
    throw new Error('Admin not found.');
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }

  const payload = { adminId: admin._id.toString() };

  const accessToken = jwt.sign(payload, process.env.ADMIN_JWT_SECRET!, { expiresIn: '1d' });
  // Use a separate secret for refresh token (or the same if you prefer, but ideally a different one)
  const refreshToken = jwt.sign(payload, process.env.ADMIN_JWT_SECRET!, { expiresIn: '7d' });

  admin.refreshToken = refreshToken;
  await admin.save();

  return { accessToken, refreshToken };
};

/**
 * Refreshes tokens by verifying the provided refresh token.
 * If valid, it issues a new access token and a new refresh token.
 */
export const refreshAdminTokenService = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  // Verify refresh token using its secret.
  const decoded = jwt.verify(refreshToken, process.env.ADMIN_JWT_SECRET!) as { adminId: string };
  if (!decoded?.adminId) {
    throw new Error('Invalid token payload.');
  }

  // Fetch admin from DB and ensure the stored refreshToken matches.
  const admin = await AdminModel.findById(decoded.adminId);
  if (!admin || admin.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token.');
  }

  const payload = { adminId: admin._id.toString() };

  // Generate new tokens.
  const newAccessToken = jwt.sign(payload, process.env.ADMIN_JWT_SECRET!, { expiresIn: '1d' });
  const newRefreshToken = jwt.sign(payload, process.env.ADMIN_JWT_SECRET!, { expiresIn: '7d' });

  // Update admin record with the new refresh token.
  admin.refreshToken = newRefreshToken;
  await admin.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * Checks admin authentication.
 *  */
export const checkAdminService = async (adminId: string): Promise<{ adminId: string }> => {
  // Optionally, re-fetch the admin from DB to confirm existence.
  console.log('adminId', adminId);
  const admin = await AdminModel.findById(adminId).lean();
  console.log('admin', admin);
  if (!admin) {
    throw new Error('Admin not found.');
  }
  return { adminId: admin._id.toString() };
};

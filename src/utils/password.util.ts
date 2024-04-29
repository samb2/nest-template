import * as bcrypt from 'bcrypt';

export async function bcryptPassword(password: string): Promise<string> {
  // Bcrypt Password with Salt
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, userPassword);
}

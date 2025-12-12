import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { AdminUser } from '../server/db/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function parseArg(flag: string, fallback?: string) {
  const i = process.argv.findIndex(a => a === flag || a.startsWith(`${flag}=`));
  if (i === -1) return fallback;
  const eq = process.argv[i].indexOf('=');
  if (eq !== -1) return process.argv[i].slice(eq + 1);
  return process.argv[i + 1] ?? fallback;
}

async function main() {
  const email = parseArg('--email', 'admin@example.com');
  const password = parseArg('--password', 'StrongPass@123');
  const name = parseArg('--name', 'Admin');
  const role = parseArg('--role', 'super_admin');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone';

  if (!email || !password) {
    console.error('Usage: tsx scripts/create-admin.ts --email <email> --password <password> [--name <name>] [--role <role>]');
    process.exit(1);
  }

  await mongoose.connect(uri, {
    maxPoolSize: 5,
  } as any);

  const existing = await AdminUser.findOne({ email }).lean();
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    await mongoose.connection.close();
    return;
  }

  const hash = await bcrypt.genSalt(12).then(s => bcrypt.hash(password, s));

  await AdminUser.create({
    id: `admin-${Date.now()}`,
    email,
    password: hash,
    name,
    role,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`✅ Admin created: ${email}`);
  await mongoose.connection.close();
}

main().catch(async (e) => {
  console.error('❌ Failed to create admin:', e);
  try { await mongoose.connection.close(); } catch {}
  process.exit(1);
});

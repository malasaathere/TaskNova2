require('dotenv').config();
const { connectDB } = require('./src/config/database');
const { User } = require('./src/models');

const seed = async () => {
  await connectDB();

  // Check if admin already exists
  const existing = await User.findOne({ where: { email: 'admin@tms.com' } });
  if (existing) {
    console.log('ℹ️  Admin user already exists');
    process.exit(0);
  }

  await User.create({
    name: 'System Admin',
    email: 'admin@tms.com',
    password: 'Admin@1234',
    role: 'Admin',
    mustResetPassword: false,
  });

  console.log('✅ Admin user created!');
  console.log('   Email:    admin@tms.com');
  console.log('   Password: Admin@1234');
  console.log('   ⚠️  Change this password after first login!\n');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@adyapan.com' },
    });

    if (!admin) {
      console.log('❌ Admin account NOT FOUND. Creating now...\n');
      
      // Hash password for Admin@123
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      console.log('Generated hash:', hashedPassword);
      
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@adyapan.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isVerified: true,
          isEmailVerified: true,
          isActive: true,
        },
      });

      console.log('✅ Admin account created successfully!');
      console.log('ID:', newAdmin.id);
      console.log('Email:', newAdmin.email);
      console.log('Role:', newAdmin.role);
      console.log('\nYou can now login with:');
      console.log('Email: admin@adyapan.com');
      console.log('Password: Admin@123');
    } else {
      console.log('✅ Admin account FOUND');
      console.log('ID:', admin.id);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
      console.log('Email Verified:', admin.isEmailVerified);
      
      // Verify password works
      if (admin.password) {
        const match = await bcrypt.compare('Admin@123', admin.password);
        console.log('\n🔐 Password test (Admin@123):', match ? '✅ MATCHES' : '❌ DOES NOT MATCH');
      } else {
        console.log('\n❌ Admin account has no password (Google login only)');
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();

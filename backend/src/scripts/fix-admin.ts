import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';

async function fixAdminUser() {
  try {
    console.log('🔍 Checking admin user...\n');

    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@adyapan.com' },
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('You need to create the admin user first.');
      process.exit(1);
    }

    console.log('✅ Admin user found');
    console.log('');
    console.log('Current Status:');
    console.log('  Email:', admin.email);
    console.log('  First Name:', admin.firstName);
    console.log('  Last Name:', admin.lastName);
    console.log('  Role:', admin.role);
    console.log('  Is Active:', admin.isActive);
    console.log('  Is Email Verified:', admin.isEmailVerified);
    console.log('  Is Verified:', admin.isVerified);
    console.log('');

    // Fix issues
    const updates: any = {};
    const issues: string[] = [];

    if (!admin.isActive) {
      issues.push('Account is inactive');
      updates.isActive = true;
    }

    if (!admin.isEmailVerified) {
      issues.push('Email is not verified');
      updates.isEmailVerified = true;
    }

    if (!admin.isVerified) {
      issues.push('Account is not verified');
      updates.isVerified = true;
    }

    // Hash the correct password
    const correctPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(correctPassword, 12);
    
    console.log('🔧 Fixing admin account...\n');
    
    // Update user
    const updated = await prisma.user.update({
      where: { id: admin.id },
      data: {
        isActive: true,
        isEmailVerified: true,
        isVerified: true,
        password: hashedPassword, // Update password hash
      },
    });

    console.log('✅ Admin account fixed!');
    console.log('');
    console.log('================================');
    console.log('ADMIN CREDENTIALS');
    console.log('================================');
    console.log('Email:    admin@adyapan.com');
    console.log('Password: Admin@123');
    console.log('================================');
    console.log('');
    console.log('Issues fixed:');
    if (issues.length > 0) {
      issues.forEach(issue => console.log('  ✓', issue));
    } else {
      console.log('  ✓ Password hash updated');
    }
    console.log('  ✓ All verification flags set to true');
    console.log('');
    console.log('Try logging in now!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
    process.exit(1);
  }
}

fixAdminUser();

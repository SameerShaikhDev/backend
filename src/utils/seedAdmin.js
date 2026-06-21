const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Homepage = require('../models/Homepage');

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
        if (existingSuperAdmin) {
            console.log('Super admin already exists');
            process.exit(0);
        }

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@panditji.com',
            phone: '9999999999',
            password: 'Admin@123456',
            role: 'super_admin',
            isVerified: true,
        });

        console.log('Super admin created successfully');
        console.log('Email: admin@panditji.com');
        console.log('Password: Admin@123456');

        let homepage = await Homepage.findOne();
        if (!homepage) {
            homepage = await Homepage.create({
                updatedBy: superAdmin._id,
            });
            console.log('Homepage document created');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding super admin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
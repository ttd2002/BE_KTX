const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../database/models/AdminAccount'); 
const { faker } = require('@faker-js/faker/locale/vi'); 

const seedAdminData = async () => {
    try {
        await mongoose.connect("");

        await Admin.deleteMany();

        const hashPassword = async (password) => await bcrypt.hash(password, 10);

        const generateVietnameseName = () => faker.name.fullName();

        const adminData = [
            {
                username: 'admin_tong',
                password: await hashPassword('password123'),
                name: generateVietnameseName(),
                role: 'generalManager',
                isAdmin: true,
            },
        ];

        // Khởi tạo 3 thu ngân
        for (let i = 1; i <= 3; i++) {
            adminData.push({
                username: `thungan_${i}`,
                password: await hashPassword('password123'),
                name: generateVietnameseName(),
                role: 'cashier',
                isAdmin: true,
            });
        }

        // Khởi tạo 3 quản lý thiết bị
        for (let i = 1; i <= 3; i++) {
            adminData.push({
                username: `ql_thietbi_${i}`,
                password: await hashPassword('password123'),
                name: generateVietnameseName(),
                role: 'equipmentManager',
                isAdmin: true,
            });
        }

        // Khởi tạo 50 nhân viên sửa chữa
        for (let i = 1; i <= 50; i++) {
            adminData.push({
                username: `nv_suachua_${i}`,
                password: await hashPassword('password123'),
                name: generateVietnameseName(),
                role: 'maintenanceStaff',
                isAdmin: true,
            });
        }

        await Admin.insertMany(adminData);
        console.log('Dữ liệu admin đã được khởi tạo thành công!');
    } catch (error) {
        console.error('Lỗi khi khởi tạo dữ liệu admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdminData();

const mongoose = require('mongoose');
const Registration = require('./models/Registration'); // Đường dẫn đến model Registration
const Payment = require('./models/Payment'); // Đường dẫn đến model Payment

(async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect('mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/');
        console.log('Database connected.');

        // Xóa tất cả dữ liệu payment cũ
        await Payment.deleteMany({});
        console.log('Existing payments deleted.');

        // Lấy tất cả các registrations
        const registrations = await Registration.find({});
        const payments = [];

        for (const registration of registrations) {
            const description = registration.description.toLowerCase();
            const amount = description.startsWith('năm học') ? 5500000 :
                description.startsWith('2 tháng hè') ? 1100000 : 0;

            if (!amount) {
                console.warn(`Unknown description format for registration ${registration.id}`);
                continue;
            }

            let year;
            let dueDate;
            if (description.startsWith('năm học')) {
                year = parseInt(description.match(/\d{4}/)[0], 10); // Lấy năm đầu tiên trong chuỗi
                dueDate = new Date(year, 7, 30); // 30/8 năm đó
            } else if (description.startsWith('2 tháng hè')) {
                year = parseInt(description.match(/\d{4}/)[0], 10); // Lấy năm trong chuỗi
                dueDate = new Date(year, 5, 30); // 30/6 năm đó
            }

            for (const application of registration.applications) {
                payments.push({
                    description: `Tiền phòng ${registration.description.toLowerCase()}`,
                    amount,
                    type: 'roomFee',
                    dueDate,
                    paymentStatus: 'paid',
                    studentId: application.studentId,
                });
            }
        }

        // Insert payments vào database
        if (payments.length > 0) {
            await Payment.insertMany(payments);
            console.log(`${payments.length} payments created.`);
        } else {
            console.log('No payments to create.');
        }

        // Đóng kết nối
        await mongoose.connection.close();
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error initializing payments:', err);
        mongoose.connection.close();
    }
})();

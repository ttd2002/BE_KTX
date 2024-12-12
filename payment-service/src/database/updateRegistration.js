const mongoose = require('mongoose');
const Registration = require('./models/Registration');  // Đảm bảo đường dẫn đúng đến model của bạn

// Kết nối đến MongoDB (đảm bảo bạn đã thay đổi URL theo cấu hình của bạn)
mongoose.connect('mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/')
    .then(() => {
        console.log('Kết nối thành công đến MongoDB');
    })
    .catch((err) => {
        console.error('Lỗi kết nối MongoDB:', err);
    });

async function updateApplicationsStatus() {
    try {
        // Tìm tất cả các Registration mà description không phải là "Năm học 2024-2025"
        const registrations = await Registration.find({ description: { $ne: 'Năm học 2024-2025' } });

        // Cập nhật status của tất cả các application thành "approved"
        for (let registration of registrations) {
            registration.applications.forEach((application) => {
                application.status = 'approved';
            });

            // Lưu lại registration đã được cập nhật
            await registration.save();
        }

        console.log('Đã cập nhật thành công tất cả application status');
    } catch (err) {
        console.error('Lỗi khi cập nhật:', err);
    } finally {
        // Đóng kết nối sau khi hoàn thành
        mongoose.disconnect();
    }
}

updateApplicationsStatus();

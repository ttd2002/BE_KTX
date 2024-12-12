const mongoose = require('mongoose');
const Building = require('./models/Room');  // Đảm bảo đường dẫn đúng đến model của bạn
const Payment = require('./models/Payment');  // Đảm bảo đường dẫn đúng đến model của bạn

// Kết nối đến MongoDB (đảm bảo bạn đã thay đổi URL theo cấu hình của bạn)
mongoose.connect('mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/')
    .then(() => {
        console.log('Kết nối thành công đến MongoDB');
    })
    .catch((err) => {
        console.error('Lỗi kết nối MongoDB:', err);
    });

async function updateRoomsAndDeletePayments() {
    try {
        // 1. Cập nhật tất cả các phòng trong các building
        const buildings = await Building.find();

        for (let building of buildings) {
            for (let floor of building.floors) {
                for (let room of floor.rooms) {
                    room.isElectricityWaterCharged = false;
                    room.oldElectricity = 0;
                    room.oldWater = 0;
                }
            }

            // Lưu lại các building đã được cập nhật
            await building.save();
        }
        console.log('Đã cập nhật tất cả các phòng thành công');

        // 2. Xóa tất cả các payment có type là "utilityFee"
        const result = await Payment.deleteMany({ type: 'utilityFee' });

        console.log(`Đã xóa ${result.deletedCount} payment có type là "utilityFee"`);
    } catch (err) {
        console.error('Lỗi khi cập nhật hoặc xóa:', err);
    } finally {
        // Đóng kết nối sau khi hoàn thành
        mongoose.disconnect();
    }
}

updateRoomsAndDeletePayments();

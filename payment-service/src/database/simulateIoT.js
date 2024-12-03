const mongoose = require('mongoose');
const Building = require('../database/models/Room'); // Đường dẫn đến model Building

// Kết nối đến MongoDB
mongoose.connect('mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/');

const simulateIoT = async () => {
    try {
        console.log('Starting IoT simulation...');
        const buildings = await Building.find();

        // Hàm sinh ngẫu nhiên giá trị tăng của điện và nước cho mỗi phòng
        const getIncrement = () => {
            // Tạo giá trị ngẫu nhiên khác nhau cho từng phòng
            const electricityIncrement = Math.random() * 0.5; // Tăng từ 0 đến 0.5 kWh
            const waterIncrement = Math.random() * 0.2; // Tăng từ 0 đến 0.2 m³
            return { electricityIncrement, waterIncrement };
        };

        // Hàm chạy mỗi phút
        const updateReadings = async () => {
            for (const building of buildings) {
                for (const floor of building.floors) {
                    for (const room of floor.rooms) {
                        // Lấy lượng tăng ngẫu nhiên cho điện và nước
                        const { electricityIncrement, waterIncrement } = getIncrement();

                        // Cập nhật chỉ số mới của phòng
                        room.newElectricity += electricityIncrement; // Tăng chỉ số điện
                        room.newWater += waterIncrement; // Tăng chỉ số nước
                    }
                }
                await building.save(); // Lưu cập nhật vào DB
            }

            // Chỉ log một thông báo duy nhất mỗi lần cập nhật
            console.log('Readings updated for all rooms.');
        };

        // Chạy mô phỏng mỗi phút trong vòng 1 tháng (43,200 phút)
        let minuteCount = 0;
        const interval = setInterval(async () => {
            const currentTime = new Date().toLocaleTimeString(); // Lấy thời gian hiện tại
            console.log(`Minute ${minuteCount + 1}: ${currentTime}`); // Hiển thị số phút và thời gian hiện tại

            if (minuteCount >= 43200) {
                clearInterval(interval); // Dừng sau 1 tháng
                console.log('Simulation completed for one month.');
                mongoose.connection.close();
                return;
            }

            await updateReadings(); // Cập nhật chỉ số điện, nước
            minuteCount++;
        }, 60000); // 60,000 ms = 1 phút
    } catch (error) {
        console.error('Error in IoT simulation:', error);
        mongoose.connection.close();
    }
};

simulateIoT();

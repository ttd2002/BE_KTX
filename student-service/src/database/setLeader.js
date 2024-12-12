const mongoose = require('mongoose');
const Student = require('./models/Student'); // Thay thế bằng đường dẫn thực tế đến file model

async function setLeaderByRoom() {
    try {
        // Kết nối tới MongoDB
        await mongoose.connect('');
        console.log('Connected to MongoDB');

        // Bước 1: Set tất cả isLeader thành false
        await Student.updateMany({}, { isLeader: false });
        console.log('All isLeader fields have been reset to false');

        // Bước 2: Lấy danh sách các roomName
        const rooms = await Student.aggregate([
            { $group: { _id: "$roomName", students: { $push: "$_id" } } },
        ]);

        // Bước 3: Với mỗi roomName, set một sinh viên bất kỳ thành leader
        for (const room of rooms) {
            if (room._id) { // Kiểm tra roomName tồn tại
                const studentId = room.students[0]; // Chọn sinh viên đầu tiên trong nhóm
                await Student.findByIdAndUpdate(studentId, { isLeader: true });
                console.log(`Set leader for room ${room._id}`);
            }
        }

        console.log('Leader assignment completed');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Đóng kết nối
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

setLeaderByRoom();

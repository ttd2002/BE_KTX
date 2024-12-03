const mongoose = require('mongoose');
const Registration = require('./models/Registration');
const Student = require('./models/Student');

// Kết nối đến MongoDB
mongoose.connect('')
    .then(async () => {
        await Registration.deleteMany({});

        const currentYear = new Date().getFullYear();
        const records = [];

        // Lấy tất cả sinh viên có `roomName` và `equipmentName` không rỗng
        const studentsWithRoomAndEquipment = await Student.find({
            roomName: { $ne: "" },
            equipmentName: { $ne: "" } // Lọc các sinh viên có equipmentName không rỗng
        });

        for (let year = currentYear - 5; year <= currentYear; year++) {
            // Tạo bản ghi cho năm học
            const academicRecord = {
                id: `reg-${year}-1`,
                startDate: new Date(`${year}-09-01`),
                endDate: new Date(`${year + 1}-05-31`),
                status: 'inactive',
                description: `Năm học ${year}-${year + 1}`,
                applications: [] // Danh sách đơn đăng ký
            };

            // Tạo bản ghi cho "2 tháng hè" từ tháng 6 đến tháng 7
            const summerRecord = {
                id: `reg-${year}-2`,
                startDate: new Date(`${year}-06-01`),
                endDate: new Date(`${year}-07-31`),
                status: 'inactive',
                description: `2 tháng hè ${year}-${year + 1}`,
                applications: [] // Danh sách đơn đăng ký
            };

            // Lấy ngẫu nhiên 500-600 sinh viên từ danh sách
            const randomCount1 = Math.floor(Math.random() * 101) + 500; // Số lượng ngẫu nhiên (500-600)
            const randomStudents1 = studentsWithRoomAndEquipment
                .sort(() => 0.5 - Math.random())
                .slice(0, randomCount1);

            const randomCount2 = Math.floor(Math.random() * 101) + 500; // Số lượng ngẫu nhiên (500-600)
            const randomStudents2 = studentsWithRoomAndEquipment
                .sort(() => 0.5 - Math.random())
                .slice(0, randomCount2);

            // Thêm danh sách sinh viên vào `applications`
            academicRecord.applications = randomStudents1.map(student => ({
                studentId: student.studentId,
                roomName: student.roomName,
                equipmentName: student.equipmentName,
                status: 'pending'
            }));

            summerRecord.applications = randomStudents2.map(student => ({
                studentId: student.studentId,
                roomName: student.roomName,
                equipmentName: student.equipmentName,
                status: 'pending'
            }));

            records.push(academicRecord, summerRecord);
        }

        await Registration.insertMany(records);
        console.log('Dữ liệu mẫu đã được khởi tạo thành công.');

        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Lỗi khi khởi tạo dữ liệu mẫu:', error);
        mongoose.connection.close();
    });

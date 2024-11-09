const mongoose = require('mongoose');
const Equipment = require('./database/models/Equipment');
const Building = require('./database/models/Room');
// Hàm để lấy trạng thái ngẫu nhiên cho thiết bị, với `good` có tỉ lệ cao hơn
const getRandomStatus = () => {
    const statuses = ['good', 'damaged', 'needMaintenance', 'liquidated'];
    const random = Math.random();
    return random < 0.7 ? 'good' : statuses[Math.floor(Math.random() * statuses.length)];
};

let bedKeyIndex = 1; // Khởi tạo biến toàn cục cho key của giường

const generateEquipmentKey = (prefix, index) => `${prefix}${index.toString().padStart(4, '0')}`;

const createBunkBeds = async () => {
    const beds = [];

    // Tạo giường cho tòa nhà I từ tầng 3 đến tầng 12
    for (let floor = 3; floor <= 12; floor++) {
        for (let room = 1; room <= 10; room++) {
            const roomNumber = `I${floor}.${room.toString().padStart(2, '0')}`;

            for (let bedGroup = 1; bedGroup <= 5; bedGroup++) {
                const bed1Key = generateEquipmentKey('G', bedKeyIndex + ".01"); // Giường tầng 1
                const bed2Key = generateEquipmentKey('G', bedKeyIndex + ".02"); // Giường tầng 2

                const bed1 = {
                    key: bed1Key,
                    name: `Giường`,
                    quantity: 1,
                    status: getRandomStatus(),
                    price: 2000000,
                    location: roomNumber,
                    importDate: new Date('2023-10-01'),
                };

                const bed2 = {
                    key: bed2Key,
                    name: `Giường`,
                    quantity: 1,
                    status: getRandomStatus(),
                    price: 2000000,
                    location: roomNumber,
                    importDate: new Date('2023-10-01'),
                };
                bedKeyIndex++
                beds.push(bed1, bed2);
            }
        }
    }

    // Tạo giường cho tòa nhà G từ tầng 2 đến tầng 11
    for (let floor = 2; floor <= 11; floor++) {
        for (let room = 1; room <= 10; room++) {
            const roomNumber = `G${floor}.${room.toString().padStart(2, '0')}`;

            for (let bedGroup = 1; bedGroup <= 5; bedGroup++) {
                const bed1Key = generateEquipmentKey('G', bedKeyIndex + ".01");
                const bed2Key = generateEquipmentKey('G', bedKeyIndex + ".02");

                const bed1 = {
                    key: bed1Key,
                    name: `Giường`,
                    quantity: 1,
                    status: getRandomStatus(),
                    price: 2000000,
                    location: roomNumber,
                    importDate: new Date('2023-10-01'),
                };

                const bed2 = {
                    key: bed2Key,
                    name: `Giường`,
                    quantity: 1,
                    status: getRandomStatus(),
                    price: 2000000,
                    location: roomNumber,
                    importDate: new Date('2023-10-01'),
                };
                bedKeyIndex++
                beds.push(bed1, bed2);
            }
        }
    }

    return beds;
};

// Hàm tạo các thiết bị khác như bàn, ghế, tủ quần áo, đèn
const createOtherEquipment = async () => {
    const buildings = await Building.find({});  // Lấy danh sách tòa nhà từ collection Building
    const equipment = [];
    let keyIndex = 1001;

    const equipmentTypes = [
        { name: 'Bàn học', price: 500000, quantity: 1 },
        { name: 'Ghế', price: 200000, quantity: 1 },
        { name: 'Tủ quần áo', price: 1500000, quantity: 1 },
        { name: 'Đèn', price: 100000, quantity: 1 },
    ];

    buildings.forEach((building) => {
        building.floors.forEach((floor) => {  // Lặp qua các tầng
            floor.rooms.forEach((room) => {  // Lặp qua các phòng
                equipmentTypes.forEach((type) => {
                    const item = {
                        key: `E${keyIndex++}`,
                        name: type.name,
                        quantity: type.quantity,
                        status: getRandomStatus(),
                        price: type.price,
                        location: room.roomNumber,
                        importDate: new Date('2023-10-01'),
                    };
                    equipment.push(item);
                });
            });
        });
    });

    return equipment;
};

// Hàm khởi tạo dữ liệu thiết bị vào database
const initEquipmentData = async () => {
    try {
        const bunkBeds = await createBunkBeds();
        const otherEquipment = await createOtherEquipment();

        await Equipment.deleteMany();
        // Insert toàn bộ dữ liệu giường và thiết bị khác vào collection equipment
        await Equipment.insertMany([...bunkBeds, ...otherEquipment]);

        console.log('Dữ liệu thiết bị đã được khởi tạo thành công!');
    } catch (error) {
        console.error('Lỗi khi khởi tạo dữ liệu thiết bị:', error);
    } finally {
        mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
    }
};

// Kết nối tới MongoDB và khởi chạy hàm initEquipmentData
mongoose.connect('')
    .then(() => {
        console.log('Kết nối MongoDB thành công');
        initEquipmentData();
    })
    .catch((error) => console.error('Lỗi kết nối MongoDB:', error));

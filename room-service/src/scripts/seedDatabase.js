require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Building = require('../database/models/Room');
const Student = require('../database/models/Students'); // Đảm bảo đường dẫn đúng đến model User
const bcrypt = require('bcrypt');

const RANDOM_USER_API_URL = 'https://randomuser.me/api/?results=1000&nat=us'; // URL lấy 1000 người dùng

const buildingData = [
  {
    key: 'I',
    buildingName: 'Nhà I',
    floors: Array.from({ length: 10 }, (_, i) => ({
      key: `I-Floor-${i + 3}`,
      floorNumber: i + 3,
      rooms: Array.from({ length: 10 }, (_, j) => ({
        key: `I${i + 3}.0${j + 1}`,
        roomNumber: `I${i + 3}.0${j + 1}`,
        capacity: 10,
        available: '0/10',
        price: 5500000,
        availableForRegistration: true,
        gender: 'female', // Tòa I là tòa của nữ
      })),
    })),
  },
  {
    key: 'G',
    buildingName: 'Nhà G',
    floors: Array.from({ length: 10 }, (_, i) => ({
      key: `G-Floor-${i + 2}`,
      floorNumber: i + 2,
      rooms: Array.from({ length: 10 }, (_, j) => ({
        key: `G${i + 2}.0${j + 1}`,
        roomNumber: `G${i + 2}.0${j + 1}`,
        capacity: 10,
        available: '0/10',
        price: 5500000,
        availableForRegistration: true,
        gender: 'male', // Tòa G là tòa của nam
      })),
    })),
  },
];

function generateStudentId() {
  const yearPrefix = Math.floor(Math.random() * 5) + 20; // Random năm từ 2020 đến 2024 (20 đến 24)
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 chữ số ngẫu nhiên
  const lastDigit = Math.random() < 0.5 ? 1 : 2; // Random 1 hoặc 2
  return `${yearPrefix}${randomDigits}${lastDigit}`;
}

async function fetchRandomStudents() {
  try {
    const response = await axios.get(RANDOM_USER_API_URL);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching random students:', error);
    return [];
  }
}

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/");

    // Xóa dữ liệu cũ
    await Building.deleteMany();
    await Student.deleteMany();

    // Khởi tạo dữ liệu building
    await Building.insertMany(buildingData);

    // Lấy dữ liệu sinh viên từ API
    const randomStudents = await fetchRandomStudents();
    const students = [];
    let studentCount = 0;

    // Tìm các phòng của tòa nhà I và G
    const buildingIRooms = buildingData.find(building => building.key === 'I').floors.flatMap(floor => floor.rooms);
    const buildingGRooms = buildingData.find(building => building.key === 'G').floors.flatMap(floor => floor.rooms);

    for (const randomStudent of randomStudents) {
      if (studentCount >= randomStudents.length) break;

      const gender = studentCount % 2 === 0 ? 'female' : 'male'; // Chọn giới tính dựa trên chỉ số sinh viên
      let roomName = '';

      if (gender === 'female') {
        // Tìm phòng trống trong tòa nhà I
        const availableRoom = buildingIRooms.find(room => room.availableForRegistration);
        if (availableRoom) {
          roomName = availableRoom.roomNumber;
          // Cập nhật trạng thái phòng sau khi gán
          availableRoom.availableForRegistration = false;
        }
      } else {
        // Tìm phòng trống trong tòa nhà G
        const availableRoom = buildingGRooms.find(room => room.availableForRegistration);
        if (availableRoom) {
          roomName = availableRoom.roomNumber;
          // Cập nhật trạng thái phòng sau khi gán
          availableRoom.availableForRegistration = false;
        }
      }

      if (!roomName) break; // Nếu không có phòng trống thì dừng lại

      const name = `${randomStudent.name.first} ${randomStudent.name.last}`;
      const phoneNumber = randomStudent.phone;
      const email = randomStudent.email;
      const address = `${randomStudent.location.street.number} ${randomStudent.location.street.name}, ${randomStudent.location.city}`;
      const className = `K${17 - (studentCount % 4)}CNPM`;
      const equipmentName = '';
      const hashedPassword = await bcrypt.hash('Pass123456.', 10);
      students.push({
        studentId: generateStudentId(),
        name: name,
        phoneNumber: phoneNumber,
        gender: gender,
        password: hashedPassword,
        className: className,
        address: address,
        email: email,
        roomName: roomName,
        isLeader: studentCount % 10 === 0, // Sinh viên đầu tiên trong mỗi phòng là leader
        equipmentName: equipmentName,
        studentStatus: 'pending'
      });

      studentCount++;
    }

    await Student.insertMany(students);
    console.log('Student data seeded!');

    // Cập nhật lại số sinh viên hiện tại cho mỗi phòng
    const updatedBuildingData = await Promise.all(buildingData.map(async (building) => {
      const updatedFloors = await Promise.all(building.floors.map(async (floor) => {
        const updatedRooms = await Promise.all(floor.rooms.map(async (room) => {
          const studentCount = await Student.countDocuments({ roomName: room.roomNumber });
          return {
            ...room,
            available: `${studentCount}/${room.capacity}`,
            availableForRegistration: studentCount < room.capacity,
          };
        }));
        return { ...floor, rooms: updatedRooms };
      }));
      return { ...building, floors: updatedFloors };
    }));

    await Building.deleteMany();
    await Building.insertMany(updatedBuildingData);
    console.log('Building data updated!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();

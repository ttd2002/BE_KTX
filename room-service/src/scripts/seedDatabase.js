require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Building = require('../database/models/Room');
const Student = require('../database/models/Students');
const Equipment = require('../database/models/Equipment'); // Import model Equipment
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker/locale/vi');

const buildingData = [
  {
    key: 'I',
    buildingName: 'Nhà I',
    floors: [
      ...Array.from({ length: 5 }, (_, i) => ({
        key: `I-Floor-${i + 3}`,
        floorNumber: i + 3,
        rooms: Array.from({ length: 10 }, (_, j) => ({
          key: `I${i + 3}.0${j + 1}`,
          roomNumber: `I${i + 3}.0${j + 1}`,
          capacity: 10,
          available: '0/10',
          price: 5500000,
          availableForRegistration: true,
          gender: 'female',
        })),
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        key: `I-Floor-${i + 8}`,
        floorNumber: i + 8,
        rooms: Array.from({ length: 10 }, (_, j) => ({
          key: `I${i + 8}.0${j + 1}`,
          roomNumber: `I${i + 8}.0${j + 1}`,
          capacity: 10,
          available: '0/10',
          price: 5500000,
          availableForRegistration: true,
          gender: 'male',
        })),
      })),
    ],
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
        gender: 'female',
      })),
    })),
  },
];

async function generateStudentId() {
  let studentId;
  let isUnique = false;

  while (!isUnique) {
    const yearPrefix = Math.floor(Math.random() * 5) + 20;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const lastDigit = Math.random() < 0.5 ? 1 : 2;
    studentId = `${yearPrefix}${randomDigits}${lastDigit}`;

    const existingStudent = await Student.findOne({ studentId });
    if (!existingStudent) {
      isUnique = true;
    }
  }

  return studentId;
}

function generateVietnameseEmail(name) {
  const randomDigits = Math.floor(100 + Math.random() * 900);
  const email = `${name.replace(/\s+/g, '').toLowerCase()}${randomDigits}@example.com`;
  return email;
}

async function seedDatabase() {
  try {
    await mongoose.connect("");

    await Building.deleteMany();
    await Student.deleteMany();

    await Building.insertMany(buildingData);

    const students = [];
    let studentCount = 0;

    const buildingIRooms = buildingData.find(building => building.key === 'I').floors.flatMap(floor => floor.rooms);
    const buildingGRooms = buildingData.find(building => building.key === 'G').floors.flatMap(floor => floor.rooms);

    for (const room of [...buildingIRooms, ...buildingGRooms]) {
      const targetStudentCount = Math.floor(Math.random() * 4) + 7;
      const gender = room.gender;

      const equipmentBeds = await Equipment.find({ location: room.roomNumber, name: 'Giường' });

      for (let i = 0; i < targetStudentCount; i++) {
        try {
          const name = faker.person.fullName({ gender: gender === 'female' ? 'female' : 'male' });
          const phoneNumber = faker.phone.number('09########');
          const address = faker.location.streetAddress(true) + ', ' + faker.location.city();
          const email = generateVietnameseEmail(name);
          const className = `K${17 - (studentCount % 4)}CNPM`;
          const hashedPassword = await bcrypt.hash('Pass123456.', 10);

          const equipmentName = equipmentBeds[i] ? equipmentBeds[i].key : '';

          students.push({
            studentId: await generateStudentId(),
            name: name,
            phoneNumber: phoneNumber,
            gender: gender,
            password: hashedPassword,
            className: className,
            address: address,
            email: email,
            roomName: room.roomNumber,
            isLeader: i === 0,
            equipmentName: equipmentName,
            studentStatus: 'pending',
          });

          studentCount++;
        } catch (studentError) {
          console.error(`Lỗi khi thêm sinh viên: ${studentError.message}`);
          continue; // Bỏ qua sinh viên này và tiếp tục thêm sinh viên khác
        }
      }
    }

    try {
      await Student.insertMany(students);
      console.log('Student data seeded!');
    } catch (bulkError) {
      console.error('Error seeding student data:', bulkError);
    }

    const updatedBuildingData = await Promise.all(buildingData.map(async (building) => {
      const updatedFloors = await Promise.all(building.floors.map(async (floor) => {
        const updatedRooms = await Promise.all(floor.rooms.map(async (room) => {
          const studentCount = await Student.countDocuments({ roomName: room.roomNumber });
          return {
            ...room,
            available: `${room.capacity - studentCount}/${room.capacity}`,
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

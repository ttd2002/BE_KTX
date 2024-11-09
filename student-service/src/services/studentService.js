const Room = require('../database/models/Room');
const Student = require('../database/models/Student');
const Equipment = require('../database/models/Equipment');
const bcrypt = require('bcryptjs');
exports.addStudent = async (data) => {
    try {
        const { studentId, name, phoneNumber, gender, className } = data;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(studentId, salt);
        const student = await Student.findOne({ studentId });
        if (student) {
            throw new Error(studentId + ' is already exist');
        }
        const newStudent = new Student({
            studentId,
            name,
            phoneNumber,
            gender,
            password: hashedPassword,
            className,
        });

        await newStudent.save();

        return {
            message: 'Student added successfully',
            student: newStudent,
        };
    } catch (err) {
        throw new Error(`Error adding student: ${err.message}`);
    }
};


exports.deleteStudent = async (studentId) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error('Student not found');
    }
    return await Student.findOneAndDelete({ studentId: studentId });
};


exports.updateStudent = async (studentId, isAdmin, updateData) => {
    try {
        const student = await Student.findOne({ studentId });
        if (!student) {
            throw new Error('Student not found');
        }

        if (!isAdmin) {
            const allowedFields = ['address', 'phoneNumber', 'email'];
            const updateKeys = Object.keys(updateData);
            for (let key of updateKeys) {
                if (!allowedFields.includes(key)) {
                    throw new Error(`You can only update address, phone, or email.`);
                }
            }
        } else {
            if (updateData.password) {
                throw new Error('Admin cannot update password.');
            }
        }

        for (let key in updateData) {
            if (key !== 'roomName') {
                student[key] = updateData[key];
            }
        }

        if (updateData.roomName !== undefined) {
            if (student.roomName && student.roomName !== "") {
                const { building: currentBuilding, floor: currentFloor, room: currentRoom } = await findRoom(student.roomName);

                if (student.roomName === updateData.roomName) {
                    throw new Error(`This Student is already in ${updateData.roomName}`);
                }

                const [currentAvailable, totalCapacity] = currentRoom.available.split('/').map(Number);
                currentRoom.available = `${currentAvailable + 1}/${totalCapacity}`;
                currentRoom.availableForRegistration = currentAvailable + 1 < totalCapacity;

                await currentBuilding.save();
            }

            if (updateData.roomName !== "") {
                const { building: newBuilding, floor: newFloor, room: newRoom } = await findRoom(updateData.roomName);

                const [newAvailable, newTotalCapacity] = newRoom.available.split('/').map(Number);
                if (student.gender !== newRoom.gender) {
                    throw new Error(`This room is for ${newRoom.gender} only`);
                }
                if (!newRoom.availableForRegistration) {
                    throw new Error('Room is full and cannot accept new registrations');
                }

                newRoom.available = `${newAvailable - 1}/${newTotalCapacity}`;
                newRoom.availableForRegistration = newAvailable - 1 > 0;
                const availableBeds = await Equipment.find({
                    location: newRoom.roomNumber,
                    name: "Giường",
                    status: "good"
                });
                const occupiedBeds = await Student.find({ roomName: newRoom.roomNumber }).select('equipmentName');
                const occupiedBedNames = occupiedBeds.map(student => student.equipmentName);
            
                const unassignedBed = availableBeds.find(bed => !occupiedBedNames.includes(bed.key));
                if (!unassignedBed) {
                    throw new Error('No available bed found in this room');
                }
                student.equipmentName = unassignedBed.key;
                student.roomName = newRoom.roomNumber;

                const studentsInRoom = await Student.find({ roomName: newRoom.roomNumber });
                student.isLeader = studentsInRoom.length === 0;

                await newBuilding.save();
            } else {
                student.roomName = "";
                student.isLeader = false;
            }
        }

        await student.save();

        return {
            message: 'Student updated successfully',
            student: student,
        };
    } catch (err) {
        throw new Error('Error updating student: ' + err.message);
    }
};




const findRoom = async (roomName) => {
    const roomIdentifier = roomName;
    const [buildingKey, floorPart, roomPart] = roomIdentifier.match(/([A-Z])(\d+)\.(\d+)/).slice(1);
    const floorNumber = parseInt(floorPart);
    const roomNumber = `${buildingKey}${floorNumber}.${roomPart}`;

    const building = await Room.findOne({ key: buildingKey });
    if (!building) {
        throw new Error('Building does not exist');
    }

    const floor = building.floors.find(f => f.floorNumber === floorNumber);
    if (!floor) {
        throw new Error('Floor does not exist');
    }

    const room = floor.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) {
        throw new Error('Room does not exist');
    }

    return { building, floor, room };
};


exports.selectRoom = async (studentId, roomIdentifier) => {
    const { building, floor, room } = await findRoom(roomIdentifier);
    const student = await Student.findOne({ studentId: studentId });
    if (!student) throw new Error('Student not found');

    if (student.roomName) throw new Error('Student has already selected a room');

    if (student.gender !== room.gender) {
        throw new Error(`This room is for ${room.gender} only`);
    }
    const [currentAvailable, totalCapacity] = room.available.split('/').map(Number); // Chuyển "1/10" thành mảng [1, 10]
    if (currentAvailable <= 0) throw new Error('Room is full and cannot accept new registrations');

    const availableBeds = await Equipment.find({
        location: roomIdentifier,
        name: "Giường",
        status: "good"
    });
    const occupiedBeds = await Student.find({ roomName: roomIdentifier }).select('equipmentName');
    const occupiedBedNames = occupiedBeds.map(student => student.equipmentName);

    const unassignedBed = availableBeds.find(bed => !occupiedBedNames.includes(bed.key));
    if (!unassignedBed) {
        throw new Error('No available bed found in this room');
    }
    student.roomName = roomIdentifier;
    student.equipmentName = unassignedBed.key;
    student.studentStatus = "pending";

    const studentsInRoom = await Student.find({ roomName: roomIdentifier });
    student.isLeader = studentsInRoom.length === 0;

    await student.save();

    room.available = `${currentAvailable - 1}/${totalCapacity}`;
    if (currentAvailable - 1 <= 0) {
        room.availableForRegistration = false;
    }
    await building.save();

    return student;
};

exports.getStudentsByStatus = async () => {
    const students = await Student.find({ studentStatus: { $in: ["pending", "approved"] } });
    return students;
};

exports.getStudentsByRoom = async (roomName) => {
    const students = await Student.find({ roomName });

    if (!roomName) {
        throw new Error('Student does not have a room');
    }

    if (students.length === 0) {
        throw new Error('No students found in this room');
    }

    return students;
};

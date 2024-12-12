const Room = require('../database/models/Room');
const Student = require('../database/models/Student');
const Equipment = require('../database/models/Equipment');
const Payment = require('../database/models/Payment');
const Registration = require('../database/models/Registration');
const History = require('../database/models/History');
const RejectStudent = require('../database/models/RejectStudent');
const bcrypt = require('bcryptjs');
exports.addStudent = async (data) => {
    try {
        const { studentId, name, phoneNumber, gender, className, roomName, equipmentName, startDate } = data;

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
            studentStatus: "approved",
            roomName,
            equipmentName,
        });
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate)) {
            throw new Error("Invalid startDate format. Please provide a valid date.");
        }
        const baseDescription = getDescription();
        const amount = calculateAmount(550000, parsedStartDate);
        await createPaymentForStudent(baseDescription, amount, studentId);

        const { building, floor, room } = await findRoom(roomName);
        const [currentAvailable, totalCapacity] = room.available.split('/').map(Number);
        room.available = `${currentAvailable - 1}/${totalCapacity}`;
        if (currentAvailable - 1 <= 0) {
            room.availableForRegistration = false;
        }
        const registration = await Registration.findOne({ description: baseDescription });
        if (!registration) throw new Error('Registration not found');
        const application = {
            studentId,
            status: "approved",
            roomName,
            equipmentName,
        };

        registration.applications.push(application);
        const history = new History({
            from: 'N/A',
            to: roomName,
            description: 'Vào ký túc xá',
            name: name,
            id: studentId
        });
        await history.save();
        await registration.save();
        await building.save();
        await newStudent.save();
        return {
            message: 'Student added successfully',
            student: newStudent,
        };
    } catch (err) {
        throw new Error(`Error adding student: ${err.message}`);
    }
};
const calculateAmount = (monthlyRent, startDate) => {
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const currentYear = startDate.getFullYear();
    const nextYear = currentYear + 1;

    let amount = 0;

    function daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    const daysThisMonth = daysInMonth(currentYear, startMonth);
    const daysRemaining = daysThisMonth - startDay;

    const dailyRent = monthlyRent / daysThisMonth;
    amount += dailyRent * daysRemaining;

    let endMonth = 5;
    if (startMonth === 6 || startMonth === 7) {
        endMonth = 7;
    }

    let remainingMonths = 0;
    if (startMonth < endMonth) {
        remainingMonths = endMonth - startMonth;
    } else {
        remainingMonths = (12 - startMonth) + endMonth;
    }

    amount += remainingMonths * monthlyRent;

    return Math.round(amount);
}
exports.swapLeader = async (currentLeaderId, newLeaderId) => {
    const newLeader = await Student.findOne({ studentId: newLeaderId });
    const currentLeader = await Student.findOne({ studentId: currentLeaderId });
    if (!newLeader) {
        throw new Error(`Student ${newLeaderId} not found`);
    }
    if (!currentLeader.isLeader) {
        throw new Error('You not is leader');
    }
    if (currentLeader.roomName !== newLeader.roomName) {
        throw new Error('Students must belong to the same room to swap leader');
    }
    if (currentLeaderId === newLeaderId) {
        throw new Error('Cannot swap yourself');
    }
    currentLeader.isLeader = false;
    newLeader.isLeader = true;

    await currentLeader.save();
    await newLeader.save();
    return { message: `Swap student ${newLeaderId} to be the leader successfully.` };
};
exports.deleteStudent = async (studentId, description) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error('Student not found');
    }
    if (student.isLeader) {
        const otherStudents = await Student.find({
            roomName: student.roomName,
            studentId: { $ne: studentId }
        });

        if (otherStudents.length > 0) {
            const newLeader = otherStudents[0];
            newLeader.isLeader = true;
            await newLeader.save();
        }
    }

    await updateRegistration(description, studentId, student.roomName, student.equipmentName, "deleted");
    const previousRoomName = student.roomName;

    student.isLeader = false;
    student.roomName = "";
    student.equipmentName = "";
    student.studentStatus = "unknown";
    await student.save();

    const history = new History({
        from: previousRoomName,
        to: 'N/A',
        description: 'Rời khỏi ký túc xá',
        name: student.name,
        id: student.studentId
    });
    await history.save();

    return { message: `Student ${studentId} deleted successfully.` };
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
                const previousRoomName = student.roomName;
                const description = student.roomName == "" ? "Vào ký túc xá" : "Chuyển phòng";
                student.equipmentName = unassignedBed.key;
                student.roomName = newRoom.roomNumber;

                const studentsInRoom = await Student.find({ roomName: newRoom.roomNumber });
                student.isLeader = studentsInRoom.length === 0;

                await newBuilding.save();
                await updateRegistration(updateData.description, studentId, updateData.roomName, unassignedBed.key, "approved")
                const history = new History({
                    from: previousRoomName,
                    to: updateData.roomName,
                    description: description,
                    name: student.name,
                    id: student.studentId
                });
                await history.save();
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

const updateRegistration = async (description, studentId, roomName, equipmentName, status) => {
    const registrations = await Registration.find({
        description: { $regex: `^${description}`, $options: "i" }
    });

    if (!registrations || registrations.length === 0) {
        throw new Error('No registrations found');
    }
    for (const registration of registrations) {
        let hasUpdated = false;

        registration.applications.forEach((application) => {
            if (application.studentId === studentId) {
                application.status = status;
                application.roomName = roomName;
                application.equipmentName = equipmentName
                hasUpdated = true;
            }
        });

        if (hasUpdated) {
            await registration.save();
        }
    }
}


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


exports.selectRoom = async (studentId, roomIdentifier, description) => {
    const { building, floor, room } = await findRoom(roomIdentifier);
    const student = await Student.findOne({ studentId: studentId });
    if (!student) throw new Error('Student not found');

    if (student.roomName) throw new Error('Student has already selected a room');

    if (student.gender !== room.gender) {
        throw new Error(`This room is for ${room.gender} only`);
    }
    const [currentAvailable, totalCapacity] = room.available.split('/').map(Number);
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
    // student.description = description;
    const studentsInRoom = await Student.find({ roomName: roomIdentifier });
    student.isLeader = studentsInRoom.length === 0;

    const registration = await Registration.findOne({ description });
    if (!registration) throw new Error('Registration not found');
    const application = {
        studentId: student.studentId,
        status: "pending",
        roomName: roomIdentifier,
        equipmentName: unassignedBed.key
    };

    registration.applications.push(application);

    room.available = `${currentAvailable - 1}/${totalCapacity}`;
    if (currentAvailable - 1 <= 0) {
        room.availableForRegistration = false;
    }
    await registration.save();
    await student.save();
    await building.save();

    return student;
};

exports.getStudentsByStatus = async () => {
    const students = await Student.find({ studentStatus: { $in: ["pending", "approved"] } });
    return students;
};
exports.getStudentsInDorm = async () => {
    const baseDescription = getDescription();
    const registrations = await Registration.find({
        description: { $regex: `^${baseDescription}` }
    });

    if (!registrations.length) {
        throw new Error('No registrations found');
    }

    const applications = registrations.flatMap(registration => registration.applications);

    const studentIds = applications.map(app => app.studentId);

    const students = await Student.find({
        studentId: { $in: studentIds },
        studentStatus: { $in: ['pending', 'approved'] }
    });

    const result = students.map(student => ({
        studentId: student.studentId,
        name: student.name,
        phoneNumber: student.phoneNumber,
        gender: student.gender,
        className: student.className,
        address: student.address,
        email: student.email,
        roomName: student.roomName,
        isLeader: student.isLeader,
        equipmentName: student.equipmentName,
        studentStatus: student.studentStatus,
        __v: student.__v
    }));

    return {
        description: baseDescription,
        totalApplications: applications.length,
        totalStudents: students.length,
        result
    };
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

const createPaymentForStudent = async (description, amount, studentId) => {
    const payment = new Payment({
        description: `Tiền phòng ${description.toLowerCase()}`,
        amount: amount,
        type: 'roomFee',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentStatus: 'unpaid',
        studentId: studentId,
    });

    await payment.save();
};
const getDescription = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let baseDescription;

    if (currentMonth >= 8 && currentMonth <= 12) {
        baseDescription = `Năm học ${currentYear}-${currentYear + 1}`;
    } else if (currentMonth >= 1 && currentMonth <= 5) {
        baseDescription = `Năm học ${currentYear - 1}-${currentYear}`;
    } else if (currentMonth >= 6 && currentMonth <= 7) {
        baseDescription = `2 tháng hè ${currentYear}`;
    }

    return baseDescription;
};

exports.approveAllPendingStudents = async () => {
    const baseDescription = getDescription();

    const registrations = await Registration.find({
        description: { $regex: `^${baseDescription}` }
    });

    if (!registrations.length) {
        throw new Error('No registrations found');
    }

    const pendingApplications = registrations.flatMap(reg =>
        reg.applications.filter(app => app.status === 'pending')
    );

    if (!pendingApplications.length) {
        throw new Error('No pending applications found');
    }

    let approvedCount = 0;

    for (const application of pendingApplications) {
        const student = await Student.findOne({ studentId: application.studentId });

        if (!student) {
            throw new Error(`Student with ID ${application.studentId} not found`);
        }

        student.studentStatus = 'approved';
        await student.save();

        application.status = 'approved';

        const { building, floor, room } = await findRoom(student.roomName);

        await createPaymentForStudent(baseDescription, room.price, student.studentId);

        const registration = registrations.find(reg => reg.applications.some(app => app.studentId === student.studentId));
        if (registration) {
            await registration.save();
        }
        const history = new History({
            from: "N/A",
            to: student.roomName,
            description: "Vào ký túc xá",
            name: student.name,
            id: student.studentId
        });
        await history.save();
        approvedCount++;
    }

    return {
        message: `Approved ${approvedCount} pending applications successfully.`,
        approvedCount
    };
};


exports.approveStudentById = async (studentId) => {
    let description = getDescription();
    const registration = await Registration.findOne({
        description: { $regex: `^${description}` },
        applications: { $elemMatch: { studentId, status: 'pending' } },
    });
    if (!registration) {
        throw new Error("Registration or application not found for the student");
    }

    const application = registration.applications.find(app => app.studentId === studentId);

    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error("Student not found");
    }

    student.studentStatus = 'approved';
    await student.save();

    const { building, floor, room } = await findRoom(application.roomName);
    await createPaymentForStudent(description, room.price, student.studentId);

    application.status = 'approved';
    const history = new History({
        from: "N/A",
        to: student.roomName,
        description: "Vào ký túc xá",
        name: student.name,
        id: studentId
    });
    await registration.save();
    await history.save();
};

exports.revertApprovedStudents = async () => {
    const baseDescription = getDescription(); // Lấy mô tả năm học hoặc kỳ học

    const registrations = await Registration.find({
        description: { $regex: `^${baseDescription}` }
    });

    if (!registrations.length) {
        throw new Error('No registrations found');
    }

    const approvedApplications = registrations.flatMap(reg =>
        reg.applications.filter(app => app.status === 'approved')
    );

    if (!approvedApplications.length) {
        throw new Error('No approved applications found');
    }

    for (const application of approvedApplications) {
        const student = await Student.findOne({ studentId: application.studentId });

        if (!student) {
            throw new Error(`Student with ID ${application.studentId} not found`);
        }

        student.studentStatus = 'pending';
        await student.save();
        application.status = 'pending';
    }

    for (const registration of registrations) {
        await registration.save();
    }

    for (const application of approvedApplications) {
        const student = await Student.findOne({ studentId: application.studentId });

        if (student) {
            const paymentDescription = `Tiền phòng ${baseDescription.toLowerCase()}`;

            await Payment.deleteMany({
                studentId: student.studentId,
                description: paymentDescription
            });
        }
    }

    return {
        message: `Reverted ${approvedApplications.length} approved applications to pending successfully.`,
        revertedCount: approvedApplications.length
    };
};
exports.rejectStudent = async (studentId, reason, description) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error('Student not found');
    }
    if (student.studentStatus != "pending") {
        throw new Error('This student is not pending');
    }

    if (!reason) {
        throw new Error('Reason is required');
    }
    const rejectStudent = new RejectStudent({
        studentId,
        studentName: student.name,
        reason,
        description,
    });
    if (student.isLeader) {
        const otherStudents = await Student.find({
            roomName: student.roomName,
            studentId: { $ne: studentId }
        });

        if (otherStudents.length > 0) {
            const newLeader = otherStudents[0];
            newLeader.isLeader = true;
            await newLeader.save();
        }
    }
    await updateRegistration(description, studentId, student.roomName, student.equipmentName, "rejected")
    await rejectStudent.save();

    const { building, floor, room } = await findRoom(student.roomName);
    const [currentAvailable, totalCapacity] = room.available.split('/').map(Number);
    room.available = `${currentAvailable + 1}/${totalCapacity}`;
    room.availableForRegistration = currentAvailable + 1 < totalCapacity;
    await room.save();

    student.roomName = "";
    student.equipmentName = "";
    student.studentStatus = "unknown";
    await student.save();
    return { message: `reject student ${studentId} success` }
}
exports.getStudentHistoriesById = async (studentId) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error('Student not found');
    }
    const histories = History.find({ id: studentId })
    return histories;
}
exports.getApplicationsByStudentId = async (studentId) => {
    const student = await Student.findOne({ studentId });
    if (!student) {
        throw new Error('Student not found');
    }

    const registrations = await Registration.find({
        'applications.studentId': studentId
    });

    if (!registrations.length) {
        throw new Error('No applications found for the given studentId');
    }

    const rejectInfo = await RejectStudent.findOne({ studentId });

    const applications = registrations.flatMap((registration) => {
        return registration.applications
            .filter(app => app.studentId === studentId)
            .map(app => ({
                description: registration.description || '',
                studentId: app.studentId,
                studentName: student.name,
                roomName: app.roomName,
                status: app.status,
                reason: rejectInfo ? rejectInfo.reason : ''
            }));
    });

    return applications;
};


const Building = require('../database/models/Room');
const Student = require('../database/models/Students');
const Equipment = require('../database/models/Equipment');
const Registration = require('../database/models/Registration');
exports.getRooms = async () => {
    const buildings = await Building.find();
    return buildings;
};

exports.getRoomsForRegister = async () => {
    const currentDate = new Date();

    const activeRegistration = await Registration.findOne({
        status: 'active',
        startDate: { $lt: currentDate },
        endDate: { $gt: currentDate }
    });

    if (!activeRegistration) {
        throw new Error("Currently, there is no active registration");
    }

    const buildings = await Building.find();

    return {
        buildings,
        registrationDescription: activeRegistration.description
    };
};

exports.getRoomsAvailable = async (gender) => {
    const buildings = await Building.find({
        'floors.rooms.gender': gender,
        'floors.rooms.availableForRegistration': true
    });

    if (!buildings.length) {
        throw new Error('No rooms available for this gender.');
    }
    const result = [];
    for (const building of buildings) {
        for (const floor of building.floors) {
            for (const room of floor.rooms) {
                if (room.gender === gender && room.availableForRegistration) {
                    const beds = await Equipment.find({
                        name: 'Giường',
                        location: room.roomNumber,
                        status: 'good',
                        key: { $nin: (await Student.find({ equipmentName: { $ne: '' } }, 'equipmentName')).map(student => student.equipmentName) }
                    });

                    result.push({
                        roomNumber: room.roomNumber,
                        equipmentAvailable: beds.map(bed => ({
                            key: bed.key,
                        }))
                    });
                }
            }
        }
    }

    return result;

};

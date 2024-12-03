const Equipment = require('../database/models/Equipment');
const Room = require('../database/models/Room');

exports.getEquipByRoom = async (roomName) => {
    const equipments = await Equipment.find({ location: roomName });
    return equipments;
};
exports.getEquipments = async () => {
    const equipments = await Equipment.find();
    return equipments;
};

const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 8; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
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
exports.addEquipments = async (data) => {
    const { name, price, location, quantity, importDate } = data;
    if (isNaN(new Date(importDate).getTime())) {
        throw new Error('Invalid importDate');
    }

    if (location !== 'Kho') {
        try {
            await findRoom(location);
        } catch (error) {
            throw new Error('Invalid location');
        }
    }
    const equipments = [];
    const keysSet = new Set();

    while (keysSet.size < quantity) {
        const key = generateRandomKey();

        const keyExists = await Equipment.findOne({ key });
        if (!keyExists) {
            keysSet.add(key);
            equipments.push({
                key,
                name,
                price,
                location,
                quantity: 1,
                status: 'good',
                importDate: new Date(importDate),
            });
        }
    }

    await Equipment.insertMany(equipments);
    return equipments

}

exports.updateEquipment = async (key, updateData) => {
    const { name, price, location, status, importDate } = updateData;

    const equipment = await Equipment.findOne({ key });
    if (!equipment) {
        throw new Error('Equipment not found');
    }

    if (location) {
        if (location !== 'Kho') {
            try {
                await findRoom(location);
            } catch (error) {
                throw new Error('Invalid location');
            }
        }
    }

    if (importDate && isNaN(new Date(importDate).getTime())) {
        throw new Error('Invalid importDate');
    }

    if (name) equipment.name = name;
    if (price) equipment.price = price;
    if (location) equipment.location = location;
    if (status) {
        if (!['good', 'damaged', 'needMaintenance', 'liquidated'].includes(status)) {
            throw new Error('Invalid status');
        }
        equipment.status = status;
    }
    if (importDate) equipment.importsDate = new Date(importDate);

    await equipment.save();
    return {
        message: 'Equipment updated successfully',
        equipment
    };

}
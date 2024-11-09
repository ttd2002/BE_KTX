const Equipment = require('../database/models/Equipment');

exports.getEquipByRoom = async (roomName) => {
    const equipments = await Equipment.find({ location: roomName });
    return equipments;
};
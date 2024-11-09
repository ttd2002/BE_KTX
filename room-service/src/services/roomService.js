const Building = require('../database/models/Room');

exports.getRooms = async () => {
    const buildings = await Building.find();
    return buildings;
};
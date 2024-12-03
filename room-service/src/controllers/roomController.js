const roomService = require('../services/roomService');

const getBuildings = async (req, res) => {
  try {
    const buildings = await roomService.getRooms();
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getRoomsForRegister = async (req, res) => {
  try {
    if (!req.user || !req.user.studentId) {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    const data = await roomService.getRoomsForRegister();

    // if (!data) {
    //   return res.status(404).json({ message: 'No active registration found.' });
    // }
    res.status(200).json({
      buildings: data.buildings,
      registrationDescription: data.registrationDescription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomsAvailable = async (req, res) => {
  try {
    if (!req.user || typeof req.user.isAdmin === 'undefined') {
      return res.status(403).json({ error: 'Only admin can get this list' });
    }
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Only admin can get this list' });
    }

    const data = await roomService.getRoomsAvailable(req.params.gender);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBuildings, getRoomsForRegister, getRoomsAvailable };

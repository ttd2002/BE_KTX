const registrationService = require('../services/registrationService');

exports.addRegistration = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can use this function' });
        }

        const message = await registrationService.addRegistration(req.body);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.updateRegistration = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can use this function' });
        }
        const registrationId = req.params.id;
        const updatedRegistration = await registrationService.updateRegistration(registrationId, req.body);
        return res.status(200).json(updatedRegistration);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
};



exports.getRegistrations = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only admins can use this function' });
        }
        const registrations = await registrationService.getRegistrations();
        res.status(200).json(registrations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


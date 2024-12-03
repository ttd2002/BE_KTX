const Registration = require('../database/models/Registration');
const moment = require('moment');
exports.addRegistration = async (data) => {
    try {
        const currentDate = new Date();
        const currentYear = moment().year();
        const currentMonth = new Date().getMonth() + 1;
        
        const existingActiveRegistration = await Registration.findOne({ status: 'active' });
        if (existingActiveRegistration) {
            throw new Error("An active registration already exists. Only one active registration is allowed at a time.");
        }

        if (new Date(data.startDate) < currentDate) {
            throw new Error("Start date must be greater than or equal to the current date.");
        }

        if (new Date(data.endDate) < new Date(data.startDate)) {
            throw new Error("End date must be greater than the start date.");
        }

        let baseRegistrationId;
        let baseDescription;

        if (data.option === 1) {
            baseRegistrationId = `reg-${currentYear}-1`;
            if (currentMonth >= 8 && currentMonth <= 12) {
                baseDescription = `Năm học ${currentYear}-${currentYear + 1}`;
            } else if (currentMonth >= 1 && currentMonth <= 5) {
                baseDescription = `Năm học ${currentYear - 1}-${currentYear}`;
            }

        } else if (data.option === 2) {
            baseRegistrationId = `reg-${currentYear}-2`;
            baseDescription = `2 tháng hè ${currentYear}`;
        } else {
            throw new Error("Invalid option.");
        }

        const existingRegistrations = await Registration.find({
            description: { $regex: `^${baseDescription}` },
        });
        const roundNumber = existingRegistrations.length + 1;
        const suffix = roundNumber > 1 ? `đợt ${roundNumber}` : "";
        const newDescription = `${baseDescription} ${suffix}`.trim();
        const registrationId = `${baseRegistrationId}${roundNumber > 1 ? `-p${roundNumber}` : ""}`;

        const newRegistration = new Registration({
            id: registrationId,
            startDate: data.startDate,
            endDate: data.endDate,
            status: 'active',
            description: newDescription,
        });

        await newRegistration.save();
        return newRegistration;
    } catch (err) {
        throw new Error(`Error adding registration: ${err.message}`);
    }
};

exports.updateRegistration = async (id, data) => {
    try {
        const currentDate = new Date();
        const currentYear = moment().year();

        const registration = await Registration.findOne({ id });

        if (!registration) {
            throw new Error("Registration not found.");
        }

        if (new Date(data.startDate) < currentDate) {
            throw new Error("Start date must be greater than or equal to the current date.");
        }

        if (new Date(data.endDate) < new Date(data.startDate)) {
            throw new Error("End date must be greater than the start date.");
        }

        let description;
        if (data.option === 1) {
            description = `Năm học ${currentYear}-${currentYear + 1}`;
        } else if (data.option === 2) {
            description = `2 tháng hè ${currentYear}-${currentYear + 1}`;
        } else {
            throw new Error("Invalid option.");
        }

        registration.startDate = data.startDate;
        registration.endDate = data.endDate;
        registration.description = description;
        registration.status = data.status;

        await registration.save();
        return registration;
    } catch (err) {
        throw new Error(`Error updating registration: ${err.message}`);
    }
};

exports.getRegistrations = async () => {
    try {
        const currentDate = new Date();

        const registrations = await Registration.find();
        return registrations;
    } catch (err) {
        throw new Error(`Error fetching registrations: ${err.message}`);
    }
};

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Building = require('../database/models/Room');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://thanhdai912:dai110912@cluster0.s1gwo.mongodb.net/');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
};
connectDB();
const calculateRoomCost = async (roomId) => {
    const prices = await getElectricityPrices();
    const { building, floor, room } = await findRoom(roomId);

    const electricityCost = calculateElectricityCost(room.newElectricity, room.oldElectricity, prices) * 1000;

    const waterCost = calculateWaterCost(room.newWater - room.oldWater);

    const totalCost = electricityCost + waterCost;

    console.log(`Room: ${room.roomNumber}`);
    console.log(`Electricity Cost: ${electricityCost.toFixed(2)} VND`);
    console.log(`Water Cost: ${waterCost.toFixed(2)} VND`);
    console.log(`Total Cost: ${totalCost.toFixed(2)} VND`);
};

const findRoom = async (roomName) => {
    const roomIdentifier = roomName;
    const [buildingKey, floorPart, roomPart] = roomIdentifier.match(/([A-Z])(\d+)\.(\d+)/).slice(1);
    const floorNumber = parseInt(floorPart);
    const roomNumber = `${buildingKey}${floorNumber}.${roomPart}`;

    const building = await Building.findOne({ key: buildingKey });
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
const getElectricityPrices = async () => {
    const url = 'https://cskh.evnhcmc.vn/Tracuu/giabandien';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const priceTableRows = $('.table-giabandien tbody tr');

        const prices = {
            'Bậc 1': null,
            'Bậc 2': null,
            'Bậc 3': null,
            'Bậc 4': null,
            'Bậc 5': null,
            'Bậc 6': null,
        };

        priceTableRows.each((index, row) => {
            const cells = $(row).find('td');
            if (cells.length > 0) {
                const level = $(cells[0]).text().trim();
                const price = $(cells[2]).text().trim();

                if (level && price) {
                    switch (true) {
                        case level.includes("Bậc 1"):
                            prices['Bậc 1'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 2"):
                            prices['Bậc 2'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 3"):
                            prices['Bậc 3'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 4"):
                            prices['Bậc 4'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 5"):
                            prices['Bậc 5'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                        case level.includes("Bậc 6"):
                            prices['Bậc 6'] = parseFloat(price.replace(/[^\d.-]/g, ''));
                            break;
                    }
                }
            }
        });
        console.log("prices", prices)

        return prices;
    } catch (error) {
        console.error('Error fetching electricity prices:', error);
    }
};



const calculateWaterCost = (waterUsage) => {
    const waterPrice = 14400;
    return waterUsage * waterPrice;
};

const calculateElectricityCost = (newElectricity, oldElectricity, prices) => {
    let totalCost = 0;
    const usage = newElectricity - oldElectricity;
    console.log('newElectricity', newElectricity);
    console.log('oldElectricity', oldElectricity);
    console.log('usage', usage);
    if (usage > 0) {
        if (usage <= 50) {
            totalCost += usage * prices['Bậc 1'];
        } else if (usage <= 100) {
            totalCost += 50 * prices['Bậc 1'] + (usage - 50) * prices['Bậc 2'];
        } else if (usage <= 200) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + (usage - 100) * prices['Bậc 3'];
        } else if (usage <= 300) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + (usage - 200) * prices['Bậc 4'];
        } else if (usage <= 400) {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + 100 * prices['Bậc 4'] + (usage - 300) * prices['Bậc 5'];
        } else {
            totalCost += 50 * prices['Bậc 1'] + 50 * prices['Bậc 2'] + 100 * prices['Bậc 3'] + 100 * prices['Bậc 4'] + 100 * prices['Bậc 5'] + (usage - 400) * prices['Bậc 6'];
        }
    }
    console.log('totalCost', totalCost);
    return totalCost;
};
calculateRoomCost('I6.02');

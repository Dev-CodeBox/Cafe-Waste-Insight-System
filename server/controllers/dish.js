const Dish = require('../models/dish.schema');
const Waste = require('../models/waste.schema');
const sendWhatsApp = require('../utils/send.whatsapp');

const dish = async (req, res) => {
    try {
        const { dish, type, quantity } = req.body;
        if (!dish) {
            return res.status(400).json({ success: false, message: 'Dish is required' });
        }

        if (!type) {
            return res.status(400).json({ success: false, message: 'Type is required' });
        }

        if (!quantity) {
            return res.status(400).json({ success: false, message: 'Quantity is required' });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingPrepared = await Dish.findOne({
            dish,
            type: "prepared",
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (type === "consumed") {
            if (!existingPrepared) {
                return res.status(400).json({ success: false, message: 'Dish not found in prepared state' });
            }
            if (quantity > existingPrepared.quantity) {
                return res.status(400).json({ success: false, message: 'Insufficient quantity in prepared state' });
            }

            const existingConsumed = await Dish.findOne({
                dish,
                type: "consumed",
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            if (existingConsumed) {
                if (existingConsumed.quantity + quantity > existingPrepared.quantity) {
                    return res.status(400).json({ success: false, message: 'Insufficient quantity in prepared state' });
                }
                existingConsumed.quantity += quantity;
                await existingConsumed.save();
            } else {
                const newConsumed = new Dish({
                    dish,
                    type: "consumed",
                    quantity,
                });
                await newConsumed.save();
            }
        } else if (type === "prepared") {
            if (existingPrepared) {
                existingPrepared.quantity += quantity;
                await existingPrepared.save();
            } else {
                const newPrepared = new Dish({
                    dish,
                    type: "prepared",
                    quantity,
                });
                await newPrepared.save();
            }
        }

        let wasteThreshold = 0;

        const existingPreparedForWaste = await Dish.findOne({
            dish,
            type: "prepared",
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const existingConsumedForWaste = await Dish.findOne({
            dish,
            type: "consumed",
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        let pQ = existingPreparedForWaste?.quantity ?? 0;
        let cQ = existingConsumedForWaste?.quantity;

        let waste;

        if (cQ === null || cQ === undefined) {
            waste = pQ;
        } else {
            waste = Math.max(pQ - cQ, 0);
        }

        let existingWaste = await Waste.findOne({ dish: existingPreparedForWaste._id });

        if (existingWaste) {
            existingWaste.waste = waste;
            await existingWaste.save();
        } else {
            existingWaste = new Waste({
                dish: existingPreparedForWaste._id,
                waste,
            });
            await existingWaste.save();
        }

        wasteThreshold = existingWaste.waste;

        if (wasteThreshold > 25) {
            const message = `⚠️ Alert: The waste threshold for "${existingPreparedForWaste.dish}" has been exceeded.\nCurrent Waste: ${wasteThreshold}%.`;
            await sendWhatsApp(process.env.ADMIN_PHONE_NUMBER, message);
        }
        res.status(201).json({ success: true, message: `Dish ${type} Successful` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
module.exports = dish;
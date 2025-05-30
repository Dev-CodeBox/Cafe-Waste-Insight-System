const Dish = require('../models/dish.schema');

const dailyInsight = async (req, res) => {
    try {
        const { date } = req.body;
        if (!date) {
            return res.status(400).json({ status: false, message: 'Date is required' });
        }

        const inputDate = new Date(date), currDate = new Date();
        if (inputDate.getDate() > currDate.getDate()) {
            return res.status(400).json({ status: false, message: 'Date cannot be in the future' });
        }

        const dateObj = new Date(date);
        const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

        const dishes = await Dish.find({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const stats = {};
        for (const doc of dishes) {
            const name = doc.dish;
            const type = doc.type;
            const quantity = doc.quantity;

            if (!stats[name]) {
                stats[name] = {
                    prepared: 0,
                    consumed: 0
                };
            }

            stats[name][type] += quantity;
        }

        const result = [];
        let totalPrepared = 0;
        let totalConsumed = 0;
        for (const dish in stats) {
            const prepared = stats[dish].prepared;
            totalPrepared += prepared;
            const consumed = stats[dish].consumed;
            totalConsumed += consumed;
            const waste = prepared - consumed;
            const efficiency = prepared > 0 ? ((consumed / prepared) * 100).toFixed(2) : 'N/A';
            const wastePercentage = prepared === 0 ? 'N/A' : ((waste / prepared) * 100).toFixed(2);
            result.push({
                dish,
                prepared,
                consumed,
                waste,
                wastePercentage: `${wastePercentage}%`,
                efficiency: `${efficiency}%`,
                suggestion:
                    prepared > 0 && waste > 0
                        ? wastePercentage > 20
                            ? `High waste in ${dish} (${wastePercentage}%). Consider reducing preparation.`
                            : `${dish} has good efficiency (${wastePercentage}% waste).`
                        : `No suggestion for ${dish}.`
            });
        }

        let totalWaste = totalPrepared - totalConsumed;
        res.status(200).json({
            success: true,
            message: "Daily Insight Fetched Successfull",
            totalPrepared,
            totalConsumed,
            totalWaste,
            result
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

module.exports = dailyInsight;
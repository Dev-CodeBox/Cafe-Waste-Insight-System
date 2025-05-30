const Dish = require("../models/dish.schema");

const weeklyInsight = async (req, res) => {
    try {
        const today = new Date();
        const day = today.getDay();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - day);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const dishes = await Dish.find({
            date: { $gte: startOfWeek, $lte: endOfWeek }
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
            message: "Weekly Insight Fetched Successfull",
            totalPrepared,
            totalConsumed,
            totalWaste,
            result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Interna Server Error" });
    }
}

module.exports = weeklyInsight;
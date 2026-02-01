const { where, fn, col } = require("sequelize");
const Expense = require("../models/expense");

exports.getLeaderboard = async (req, res) => {
  try {
    const userId = req.params.id;
    const getAllUserExpense = await Expense.findAll({
      attributes: ["category", [fn("SUM", col("amount")), "totalSpendAmout"]],
      where: {
        userId: userId,
      },
      group: ["category"],
    });
    console.log(getAllUserExpense, "getAllUserExpense");
    // if (getAllUserExpense.length == 0) {
    //   res.json({ message: "Data not available" });
    // }
    // const categoryGroupByData = {};
    // getAllUserExpense.forEach((expense) => {
    //   if (!categoryGroupByData[expense.category]) {
    //     categoryGroupByData[expense.category] = [expense];
    //   } else {
    //     categoryGroupByData[expense.category] = [
    //       ...categoryGroupByData[expense.category],
    //       expense,
    //     ];
    //   }
    // });
    // const desireResponse = Object.entries(categoryGroupByData).map(
    //   ([category, items]) => {
    //     const totalSpendAmout = items.reduce(
    //       (sum, item) => sum + Number(item.amount),
    //       0,
    //     );

    //     return {
    //       category,
    //       totalSpendAmout,
    //     };
    //   },
    // );

    // console.log(desireResponse);

    res.json({
      allUserExpense: getAllUserExpense,
      userId: userId,
    });
  } catch (error) {
    console.log(error);
  }
};

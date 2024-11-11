const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

exports.getReports = async (req, res) => {
  const { timeRange } = req.query;

  try {
    const transactions = await Transaction.find({ user: req.user.id });
    const goals = await Goal.find({ user: req.user.id });

    // Process transactions and goals to generate reports based on the time range
    const reportData = generateReportData(transactions, goals, timeRange);

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const generateReportData = (transactions, goals, timeRange) => {
  const filteredTransactions = filterTransactionsByTimeRange(transactions, timeRange);

  const categoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const timeSeriesData = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) {
      acc[key] = { name: key, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      acc[key].income += t.amount;
    } else {
      acc[key].expenses += t.amount;
    }
    return acc;
  }, {});

  const savingsRate = calculateSavingsRate(filteredTransactions);
  const topExpenseCategories = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const netWorthData = calculateNetWorth(filteredTransactions);
  const budgetPerformance = calculateBudgetPerformance(filteredTransactions, goals);
  const cashFlowData = calculateCashFlow(filteredTransactions);
  const debtToIncomeRatio = calculateDebtToIncomeRatio(filteredTransactions);

  return {
    categoryData: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    timeSeriesData: Object.values(timeSeriesData),
    savingsRate,
    topExpenseCategories,
    netWorthData,
    budgetPerformance,
    cashFlowData,
    debtToIncomeRatio,
  };
};

const filterTransactionsByTimeRange = (transactions, timeRange) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0); // Default to all time
  }

  return transactions.filter(t => new Date(t.date) >= startDate);
};

const calculateSavingsRate = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return ((income - expenses) / income) * 100;
};

const calculateNetWorth = (transactions) => {
  const netWorthData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) {
      acc[key] = { name: key, netWorth: 0 };
    }
    if (t.type === 'income') {
      acc[key].netWorth += t.amount;
    } else {
      acc[key].netWorth -= t.amount;
    }
    return acc;
  }, {});

  return Object.values(netWorthData);
};

const calculateBudgetPerformance = (transactions, goals) => {
  const budgetPerformance = goals.map(goal => {
    const actual = transactions
      .filter(t => t.category === goal.description)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      name: goal.description,
      budget: goal.target,
      actual,
    };
  });

  return budgetPerformance;
};

const calculateCashFlow = (transactions) => {
  const cashFlowData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) {
      acc[key] = { name: key, cashFlow: 0 };
    }
    if (t.type === 'income') {
      acc[key].cashFlow += t.amount;
    } else {
      acc[key].cashFlow -= t.amount;
    }
    return acc;
  }, {});

  return Object.values(cashFlowData);
};

const calculateDebtToIncomeRatio = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const debtPayments = transactions.filter(t => t.type === 'expense' && t.category === 'Debt').reduce((sum, t) => sum + t.amount, 0);
  return debtPayments / income;
};
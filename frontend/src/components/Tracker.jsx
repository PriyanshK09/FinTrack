import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, TrendingUp, Plus, Trash2, Calendar, Tag, Target, AlertCircle, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import '../styles/Tracker.css';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Create new LoadingChart component
const LoadingChart = () => (
  <motion.div 
    className="loading-chart"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="loading-chart-content" />
  </motion.div>
);

export default function Tracker() {
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: '',
    category: '',
  });
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    description: '',
    target: '',
    current: '',
  });
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  useEffect(() => {
    // Add artificial delay for smooth transition
    const timer = setTimeout(() => {
      setIsChartReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const updateChartData = useCallback(() => {
    const monthlyData = MONTHS.map(month => ({ name: month, income: 0, expenses: 0 }));
    transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });
    setChartData(monthlyData);
    
    const categoryData = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    setPieChartData(Object.entries(categoryData).map(([name, value]) => ({ name, value })));
  }, [transactions]);

  const updateGoals = useCallback(() => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        const relevantTransactions = transactions.filter(t => 
          t.category.toLowerCase() === goal.description.toLowerCase()
        );
        const totalAmount = relevantTransactions.reduce((sum, t) => 
          t.type === 'income' ? sum + t.amount : sum - t.amount, 0
        );
        return { ...goal, current: goal.current + totalAmount };
      })
    );
  }, [transactions]);

  useEffect(() => {
    updateChartData();
    updateGoals();
  }, [transactions, updateChartData, updateGoals]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleEditGoalChange = (e) => {
    const { name, value } = e.target;
    setEditingGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount && newTransaction.date && newTransaction.category) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:5000/api/transactions', newTransaction, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(prev => [...prev, response.data]);
        setNewTransaction({ description: '', amount: '', type: 'expense', date: '', category: '' });
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (newGoal.description && newGoal.target && newGoal.current) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:5000/api/goals', newGoal, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(prev => [...prev, response.data]);
        setNewGoal({ description: '', target: '', current: '' });
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    }
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    if (editingGoal.description && editingGoal.target && editingGoal.current) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`http://localhost:5000/api/goals/${editingGoal._id}`, editingGoal, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(prev => prev.map(goal => (goal._id === editingGoal._id ? response.data : goal)));
        setEditingGoal(null);
      } catch (error) {
        console.error('Error editing goal:', error);
      }
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(prev => prev.filter(transaction => transaction._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(prev => prev.filter(goal => goal._id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="tracker-container">
      <main className="tracker-main">
        <section className="summary-section">
          <div className="summary-card">
            <h2>Balance</h2>
            <p className={`balance ${balance >= 0 ? "positive" : "negative"}`}>
              {formatCurrency(balance, currency.code, currency.symbol)}
            </p>
          </div>
          <div className="summary-card">
            <h2>Income</h2>
            <p className="income">{formatCurrency(totalIncome, currency.code, currency.symbol)}</p>
          </div>
          <div className="summary-card">
            <h2>Expenses</h2>
            <p className="expenses">{formatCurrency(totalExpenses, currency.code, currency.symbol)}</p>
          </div>
        </section>
        <section className="chart-section">
          <h2>
            <TrendingUp size={20} /> Income vs Expenses
          </h2>
          <div className="chart-container">
            {!isChartReady ? (
              <LoadingChart />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#27ae60"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#e74c3c"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
        <div className="bottom-sections">
          <section className="transactions-section">
            <h2>
              <PieChart size={20} /> Recent Transactions
            </h2>
            <ul className="transaction-list">
              {transactions.map((transaction) => (
                <li
                  key={transaction._id}
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-info">
                    <span className="transaction-description">
                      {transaction.description}
                    </span>
                    <span className="transaction-category">
                      <Tag size={14} /> {transaction.category}
                    </span>
                    <span className="transaction-date">
                      <Calendar size={14} />{" "}
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="transaction-amount">
                    {formatCurrency(transaction.amount, currency.code, currency.symbol)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(transaction._id)}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="add-transaction-section">
            <h2>
              <Plus size={20} /> Add New Transaction
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
              />
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              />
              <button type="submit">Add Transaction</button>
            </form>
          </section>
        </div>
        <section className="goals-section">
          <h2>
            <Target size={20} /> Financial Goals
          </h2>
          <ul className="goals-list">
            {goals.map((goal) => (
              <li key={goal._id} className="goal-item">
                <div className="goal-info">
                  <span className="goal-description">{goal.description}</span>
                  <progress value={goal.current} max={goal.target}></progress>
                  <span className="goal-progress">
                    {formatCurrency(goal.current, currency.code, currency.symbol)} / {formatCurrency(goal.target, currency.code, currency.symbol)}
                  </span>
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="edit-btn"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="delete-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editingGoal && (
            <form onSubmit={handleEditGoalSubmit} className="edit-goal-form">
              <input
                type="text"
                name="description"
                placeholder="Goal Description"
                value={editingGoal.description}
                onChange={handleEditGoalChange}
                required
              />
              <input
                type="number"
                name="target"
                placeholder="Target Amount"
                value={editingGoal.target}
                onChange={handleEditGoalChange}
                required
              />
              <input
                type="number"
                name="current"
                placeholder="Current Amount"
                value={editingGoal.current}
                onChange={handleEditGoalChange}
                required
              />
              <button type="submit">Update Goal</button>
              <button type="button" onClick={() => setEditingGoal(null)}>
                Cancel
              </button>
            </form>
          )}
          <form onSubmit={handleGoalSubmit} className="add-goal-form">
            <input
              type="text"
              name="description"
              placeholder="Goal Description"
              value={newGoal.description}
              onChange={handleGoalInputChange}
              required
            />
            <input
              type="number"
              name="target"
              placeholder="Target Amount"
              value={newGoal.target}
              onChange={handleGoalInputChange}
              required
            />
            <input
              type="number"
              name="current"
              placeholder="Current Amount"
              value={newGoal.current}
              onChange={handleGoalInputChange}
              required
            />
            <button type="submit">Add Goal</button>
          </form>
        </section>
        <section className="insights-section">
          <h2>
            <AlertCircle size={20} /> Financial Insights
          </h2>
          <div className="insights-content">
            <div className="insight-card">
              <h3>Spending by Category</h3>
              <div className="chart-container">
                {!isChartReady ? (
                  <LoadingChart />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <RePieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="insight-card">
              <h3>Quick Tips</h3>
              <ul className="tips-list">
                <li>Try to save at least 20% of your income</li>
                <li>Review your subscriptions and cancel unused ones</li>
                <li>Set up automatic transfers to your savings account</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
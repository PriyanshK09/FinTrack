"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw, Plus, X, DollarSign, Filter, BarChart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles/Investments.css'

const fetchInvestmentData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'S&P 500 ETF', type: 'ETF', amount: 10000, currentValue: 10911.00, returns: 9.11 },
        { id: 2, name: 'Apple Inc.', type: 'Stock', amount: 5000, currentValue: 5472.78, returns: 9.46 },
        { id: 3, name: 'US Treasury Bonds', type: 'Bonds', amount: 15000, currentValue: 15318.33, returns: 2.12 },
        { id: 4, name: 'Bitcoin', type: 'Crypto', amount: 2000, currentValue: 2350.00, returns: 17.50 },
        { id: 5, name: 'Real Estate Fund', type: 'Real Estate', amount: 20000, currentValue: 21200.00, returns: 6.00 },
      ])
    }, 1000)
  })
}

const generateChartData = (investments) => {
  return investments.map(inv => ({
    name: inv.name,
    value: inv.currentValue,
    returns: inv.returns
  }))
}

export default function Investments() {
  const [investments, setInvestments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingInvestment, setIsAddingInvestment] = useState(false)
  const [newInvestment, setNewInvestment] = useState({ name: '', type: '', amount: '' })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [filterType, setFilterType] = useState('All')
  const [chartData, setChartData] = useState([])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchInvestmentData()
      setInvestments(data)
      setChartData(generateChartData(data))
    } catch (error) {
      console.error("Error fetching investment data:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(intervalId)
  }, [])

  const handleAddInvestment = () => {
    if (newInvestment.name && newInvestment.type && newInvestment.amount) {
      const investment = {
        id: Date.now(),
        name: newInvestment.name,
        type: newInvestment.type,
        amount: parseFloat(newInvestment.amount),
        currentValue: parseFloat(newInvestment.amount),
        returns: 0
      }
      const updatedInvestments = [...investments, investment]
      setInvestments(updatedInvestments)
      setChartData(generateChartData(updatedInvestments))
      setNewInvestment({ name: '', type: '', amount: '' })
      setIsAddingInvestment(false)
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const overallReturns = ((totalCurrentValue - totalInvested) / totalInvested) * 100

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedInvestments = React.useMemo(() => {
    let sortableItems = [...investments]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [investments, sortConfig])

  const filteredInvestments = sortedInvestments.filter(inv => 
    filterType === 'All' || inv.type === filterType
  )

  return (
    <div className="investments-container">
      <motion.main 
        className="investments-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="investments-header">
          <h1 className="investments-title">Investment Portfolio</h1>
          <button className="refresh-button" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className="refresh-icon" />
            Refresh Data
          </button>
        </div>
        
        <div className="investments-grid">
          <div className="investment-card">
            <h2 className="card-title">Total Invested</h2>
            <p className="card-value">
              <DollarSign className="card-icon" />
              {totalInvested.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
          <div className="investment-card">
            <h2 className="card-title">Current Value</h2>
            <p className="card-value">
              <DollarSign className="card-icon" />
              {totalCurrentValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
          <div className="investment-card">
            <h2 className="card-title">Overall Returns</h2>
            <p className={`card-value ${overallReturns >= 0 ? 'positive' : 'negative'}`}>
              {overallReturns >= 0 ? <TrendingUp className="card-icon" /> : <TrendingDown className="card-icon" />}
              {overallReturns.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="chart-container">
          <h2 className="chart-title"><BarChart className="chart-icon" /> Portfolio Composition</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="returns" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <RefreshCw className="loading-icon" />
            <p className="loading-text">Loading investment data...</p>
          </div>
        ) : (
          <div className="investment-table-container">
            <div className="table-controls">
              <div className="filter-control">
                <Filter className="filter-icon" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Stock">Stocks</option>
                  <option value="ETF">ETFs</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Crypto">Cryptocurrency</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>
            <table className="investment-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('type')}>Type {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('amount')}>Invested Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('currentValue')}>Current Value {sortConfig.key === 'currentValue' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                  <th onClick={() => handleSort('returns')}>Returns {sortConfig.key === 'returns' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.map((investment) => (
                  <tr key={investment.id}>
                    <td>{investment.name}</td>
                    <td>{investment.type}</td>
                    <td>{investment.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{investment.currentValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td className={investment.returns >= 0 ? 'positive' : 'negative'}>
                      {investment.returns >= 0 ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
                      {investment.returns.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="add-investment-button" onClick={() => setIsAddingInvestment(true)}>
          <Plus className="add-icon" />
          Add New Investment
        </button>

        <AnimatePresence>
          {isAddingInvestment && (
            <motion.div 
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="add-investment-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="modal-header">
                  <h2>Add New Investment</h2>
                  <button className="close-button" onClick={() => setIsAddingInvestment(false)}>
                    <X />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Investment Name"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                />
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="Stock">Stock</option>
                  <option value="ETF">ETF</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Crypto">Cryptocurrency</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
                <div className="amount-input">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newInvestment.amount}
                    onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                  />
                </div>
                <div className="modal-buttons">
                  <button onClick={handleAddInvestment}>Add Investment</button>
                  <button onClick={() => setIsAddingInvestment(false)}>Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  )
}
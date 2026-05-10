import React, { useState, useEffect } from 'react';
import { Download, Share2, Plus, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useGlobalContext } from '../GlobalContext';
import './BudgetPlanner.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlanner = ({ trip }) => {
  const { userProfile, addToast } = useGlobalContext();
  const [budget, setBudget] = useState(null);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food' });

  useEffect(() => {
    fetchBudget();
  }, [trip.id]);

  const fetchBudget = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/budgets/${trip.id}`, { credentials: 'include' });
      const data = await res.json();
      if (!data.budget) {
        let numericBudget = 5000;
        if (trip.budget) {
          const parsed = parseFloat(trip.budget.toString().replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed)) numericBudget = parsed;
        }

        const createRes = await fetch(`http://localhost:5000/api/budgets/${trip.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ totalBudget: numericBudget, currency: 'USD' })
        });
        const createData = await createRes.json();
        setBudget(createData.budget);
      } else {
        setBudget(data.budget);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    try {
      const res = await fetch(`http://localhost:5000/api/budgets/${budget.id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newExpense)
      });
      const data = await res.json();
      setBudget(prev => ({ ...prev, expenses: [data.expense, ...prev.expenses] }));
      setNewExpense({ title: '', amount: '', category: 'Food' });
      addToast('Expense added!', 'success');
    } catch (err) {
      addToast('Failed to add expense', 'error');
    }
  };

  const totalSpent = budget?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const remaining = (budget?.totalBudget || 0) - totalSpent;
  const isOverBudget = remaining < 0;

  // Chart Data
  const categories = ['Food', 'Transport', 'Hotel', 'Activities', 'Shopping', 'Miscellaneous'];
  const categoryTotals = categories.map(cat => 
    budget?.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0) || 0
  );

  const chartData = {
    labels: categories,
    datasets: [{
      data: categoryTotals,
      backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c', '#ff9f1c', '#a05195'],
      borderWidth: 0,
    }]
  };

  if (!budget) return <div className="skeleton" style={{ height: '400px' }}></div>;

  return (
    <div className="budget-planner-container">
      <div className="budget-header">
        <div>
          <h2 className="budget-title">Budget Planner</h2>
          <div className="budget-meta">
            <span>Created by @{userProfile?.username}</span>
            <span>Currency: {budget.currency}</span>
          </div>
        </div>
        <div className="budget-actions">
          <button className="btn-secondary btn-small"><Download size={16}/> Export</button>
          <button className="btn-secondary btn-small"><Share2 size={16}/> Share</button>
        </div>
      </div>

      <div className="budget-analytics">
        <div className="analytic-card">
          <div className="analytic-title">Planned Budget</div>
          <div className="analytic-value">${budget.totalBudget}</div>
        </div>
        <div className="analytic-card">
          <div className="analytic-title">Total Spent</div>
          <div className="analytic-value">${totalSpent}</div>
        </div>
        <div className="analytic-card">
          <div className="analytic-title">Remaining</div>
          <div className="analytic-value" style={{color: isOverBudget ? '#ff8a8a' : '#4ecdc4'}}>
            ${remaining}
          </div>
        </div>
        <div className="analytic-card">
          <div className="analytic-title">Daily Average</div>
          <div className="analytic-value">${(totalSpent / (trip.duration ? parseInt(trip.duration) : 1)).toFixed(0)}</div>
        </div>
      </div>

      {isOverBudget && (
        <div className="smart-alert">
          <AlertTriangle size={20}/>
          Warning: You have exceeded your planned budget by ${Math.abs(remaining)}. Consider reducing shopping or luxury activities.
        </div>
      )}

      <div className="budget-content">
        <div>
          <div className="add-expense-form">
            <input type="text" className="auth-input" placeholder="Expense title" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
            <input type="number" className="auth-input" placeholder="Amount" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} style={{width: '100px'}} />
            <select className="auth-input" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="btn-primary" onClick={handleAddExpense}><Plus size={16}/></button>
          </div>

          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {budget.expenses.map(exp => (
                <tr key={exp.id} className="expense-row">
                  <td>{exp.title}</td>
                  <td><span style={{fontSize:'0.8rem', padding:'0.2rem 0.5rem', background:'rgba(255,255,255,0.1)', borderRadius:'4px'}}>{exp.category}</span></td>
                  <td style={{fontWeight:'bold'}}>${exp.amount}</td>
                  <td style={{color:'var(--text-secondary)'}}>{new Date(exp.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-container">
          <h4 style={{marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem'}}><PieChartIcon size={18}/> Spending by Category</h4>
          <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;

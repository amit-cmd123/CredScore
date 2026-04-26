import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Calculator as CalcIcon } from 'lucide-react';

const CreditCalculator = () => {
  const [formData, setFormData] = useState({
    income: '',
    debt: '',
    paymentHistory: 'good',
    creditAge: ''
  });
  const [score, setScore] = useState(null);

  const calculateScore = (e) => {
    e.preventDefault();
    // Dummy logic
    let base = 600;
    const { income, debt, paymentHistory, creditAge } = formData;
    
    if (income > 50000) base += 50;
    if (debt < 10000) base += 50;
    if (paymentHistory === 'excellent') base += 100;
    if (paymentHistory === 'poor') base -= 100;
    if (creditAge > 5) base += 50;

    setScore(Math.min(850, Math.max(300, base)));
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Score Calculator</h1>
        <p className="text-gray-500">Estimate credit score based on financial parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
          <form onSubmit={calculateScore} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Annual Income ($)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.income}
                onChange={e => setFormData({...formData, income: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Total Outstanding Debt ($)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.debt}
                onChange={e => setFormData({...formData, debt: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Payment History</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.paymentHistory}
                onChange={e => setFormData({...formData, paymentHistory: e.target.value})}
              >
                <option value="excellent">Excellent (No missed payments)</option>
                <option value="good">Good (1-2 late payments)</option>
                <option value="poor">Poor (Multiple missed payments)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Credit Age (Years)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.creditAge}
                onChange={e => setFormData({...formData, creditAge: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              <CalcIcon size={20} />
              Calculate Score
            </button>
          </form>
        </div>

        {score !== null && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">Estimated Credit Score</h3>
            <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center mb-6 ${
              score >= 700 ? 'border-green-500 text-green-600' :
              score >= 600 ? 'border-yellow-500 text-yellow-600' :
              'border-red-500 text-red-600'
            }`}>
              <span className="text-6xl font-bold">{score}</span>
            </div>
            <p className="text-lg font-medium text-gray-800">
              {score >= 700 ? 'Excellent Standing' : score >= 600 ? 'Fair Standing' : 'Poor Standing'}
            </p>
            <p className="text-gray-500 mt-2 text-sm max-w-sm">
              This is an AI-driven estimate based on the provided financial parameters. Actual scores may vary.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreditCalculator;

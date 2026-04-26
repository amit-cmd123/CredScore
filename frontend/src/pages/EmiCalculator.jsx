import React, { useState } from 'react';
import Layout from '../components/Layout';
import { CreditCard } from 'lucide-react';

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenureYears, setTenureYears] = useState(5);

  const calculateEMI = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenureYears) * 12;
    
    if (!p || !r || !n) return { emi: 0, totalInterest: 0, totalAmount: 0 };
    
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;
    
    return {
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  };

  const results = calculateEMI();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EMI Calculator</h1>
        <p className="text-gray-500">Calculate Equated Monthly Installment for loans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Loan Amount ($)</label>
                <span className="font-medium text-blue-600">${loanAmount}</span>
              </div>
              <input 
                type="range" 
                min="1000" max="1000000" step="1000"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Interest Rate (%)</label>
                <span className="font-medium text-blue-600">{interestRate}%</span>
              </div>
              <input 
                type="range" 
                min="1" max="30" step="0.5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={interestRate}
                onChange={e => setInterestRate(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Tenure (Years)</label>
                <span className="font-medium text-blue-600">{tenureYears} Years</span>
              </div>
              <input 
                type="range" 
                min="1" max="30" step="1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                value={tenureYears}
                onChange={e => setTenureYears(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard size={28} className="text-blue-200" />
            <h3 className="text-xl font-bold">EMI Details</h3>
          </div>
          
          <div className="mb-8">
            <p className="text-blue-200 text-sm mb-1">Monthly EMI</p>
            <p className="text-5xl font-bold">${results.emi}</p>
          </div>

          <div className="space-y-4 border-t border-blue-500 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Principal Amount</span>
              <span className="font-semibold">${Number(loanAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Total Interest</span>
              <span className="font-semibold">${Number(results.totalInterest).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-blue-500/50">
              <span className="font-medium">Total Amount Payable</span>
              <span className="font-bold text-lg">${Number(results.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmiCalculator;

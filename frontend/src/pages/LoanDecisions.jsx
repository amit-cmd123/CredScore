import React from 'react';
import Layout from '../components/Layout';
import { AlertCircle, Check, X } from 'lucide-react';

const decisions = [
  { id: 'APP-1023', name: 'Alice Smith', amount: '$45,000', risk: 'Low', score: 750, status: 'Pending' },
  { id: 'APP-1024', name: 'Bob Johnson', amount: '$12,000', risk: 'High', score: 580, status: 'Pending' },
  { id: 'APP-1025', name: 'Charlie Brown', amount: '$85,000', risk: 'Medium', score: 680, status: 'Pending' },
];

const LoanDecisions = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Decisions</h1>
        <p className="text-gray-500">Review applications and make AI-assisted lending decisions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {decisions.map(app => (
          <div key={app.id} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{app.id}</span>
                <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Requested Amount</p>
                  <p>{app.amount}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Credit Score</p>
                  <p>{app.score}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Risk Level</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    app.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    app.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.risk} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium">
                <X size={18} />
                Reject
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">
                <Check size={18} />
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default LoanDecisions;

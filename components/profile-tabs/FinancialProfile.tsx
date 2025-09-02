'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { DollarSign, TrendingUp, CreditCard, PiggyBank, Receipt, AlertCircle } from 'lucide-react';

interface FinancialProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function FinancialProfile({ veteran }: FinancialProfileProps) {
  const financialData = veteran.profileServices?.financial;
  
  // Separate income sources
  const vaDisability = veteran.benefits.monthlyAmount || 0;
  const socialSecurity = Math.floor(vaDisability * 0.4) || 0; // Estimated SSA
  const vaPension = 0; // Not receiving pension if getting disability
  const otherIncome = financialData?.monthlyIncome || 0;
  const totalMonthlyIncome = vaDisability + socialSecurity + otherIncome;
  
  return (
    <div className="space-y-6">
      {/* Income Breakdown */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Income Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">VA Disability</p>
            <p className="text-white font-bold text-xl">
              ${vaDisability.toLocaleString()}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">Monthly</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Social Security</p>
            <p className="text-white font-bold text-xl">
              ${socialSecurity.toLocaleString()}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">Monthly</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">VA Pension</p>
            <p className="text-white font-bold text-xl">
              ${vaPension.toLocaleString()}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">Monthly</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Other Income</p>
            <p className="text-white font-bold text-xl">
              ${otherIncome.toLocaleString()}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">Monthly</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-skinz-accent/20 to-skinz-accent/10 rounded-lg p-4 border border-skinz-accent/30">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Monthly Income</p>
            <p className="text-white font-bold text-2xl">
              ${totalMonthlyIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-skinz-accent/20 to-skinz-accent/10 rounded-lg p-4 border border-skinz-accent/30">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Annual Income</p>
            <p className="text-white font-bold text-2xl">
              ${(totalMonthlyIncome * 12).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Recent Payments</h3>
        </div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const payments = [];
            
            if (vaDisability > 0) {
              payments.push({ type: 'VA Disability', amount: vaDisability, date: new Date(date.getFullYear(), date.getMonth(), 1) });
            }
            if (socialSecurity > 0) {
              payments.push({ type: 'Social Security', amount: socialSecurity, date: new Date(date.getFullYear(), date.getMonth(), 3) });
            }
            if (vaPension > 0) {
              payments.push({ type: 'VA Pension', amount: vaPension, date: new Date(date.getFullYear(), date.getMonth(), 1) });
            }
            
            return payments.map((payment, idx) => (
              <div key={`${i}-${idx}`} className="flex justify-between items-center p-3 bg-skinz-bg-tertiary/30 rounded-lg">
                <div>
                  <p className="text-white">{payment.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-skinz-text-secondary text-sm">{payment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${payment.amount.toLocaleString()}</p>
                  <p className="text-green-400 text-sm">Deposited</p>
                </div>
              </div>
            ));
          }).flat()}
        </div>
      </div>

      {/* Debt Information */}
      {financialData?.debts && financialData.debts.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Outstanding Debts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialData.debts.map((debt, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-medium">{debt.type}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    debt.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' : 
                    debt.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    debt.status === 'waived' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {debt.status}
                  </span>
                </div>
                <p className="text-white text-xl font-bold">${debt.amount.toLocaleString()}</p>
                <p className="text-skinz-text-secondary text-sm mt-1">Monthly: ${debt.monthlyPayment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
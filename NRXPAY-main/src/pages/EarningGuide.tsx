import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUSDTRates } from "@/hooks/useUSDTRates";

const EarningGuide = () => {
  const { rates } = useUSDTRates();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">How to Earn Using NRX PAY</h1>
        </div>
      </header>
      
      <main className="px-4 py-6 space-y-6 animate-slide-up pb-20">
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-bold mb-4 neon-text">Earning Guide</h2>
          
          {/* Method 1: Recharging USDT */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-600">1. Earn by Recharging USDT</h3>
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <p className="text-sm">
                <span className="font-bold">High Commission Earnings:</span> Recharge USDT and earn high commission on every transaction.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">How to Recharge:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Go to Homepage</li>
                  <li>• Click on "Recharge" button</li>
                  <li>• Select USDT amount (Rate: 1 USDT = ₹{rates?.buy_rate || 98})</li>
                  <li>• Choose payment method</li>
                  <li>• Complete the transaction</li>
                  <li>• Start earning high commissions!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Method 2: Upload Bank Accounts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">2. Earn by Uploading Bank Accounts</h3>
            <div className="bg-purple-50 p-4 rounded-lg space-y-3">
              <p className="text-sm">
                <span className="font-bold">High Daily Earnings:</span> Upload your bank accounts and earn up to ₹30k+ daily through current accounts and ₹1 lakh+ through corporate accounts.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">How to Start:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Go to Homepage → Current Account or Corporate Account</li>
                  <li>• Click "Upload Current/Corporate Account Now"</li>
                  <li>• Fill account details (Bank name, Account number, IFSC, etc.)</li>
                  <li>• Upload required documents (Aadhar, PAN photos)</li>
                  <li>• Submit application for review</li>
                  <li>• Once approved, start run and earn daily comission!</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Minimum Requirements:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Current Account: Minimum 500 USD recharge required</li>
                  <li>• Corporate Account: Minimum 1500 USD recharge required</li>
                  <li>• Valid bank account with required documents</li>
                  <li>• Active mobile number linked to account</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                <p className="text-sm font-semibold text-purple-700">
                  💎 Current Account: ₹30k+ daily | Corporate Account: ₹1 lakh+ daily earnings potential!
                </p>
              </div>
            </div>
          </div>

          {/* Method 3: Referral System */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">3. Earn through Referrals</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <p className="text-sm">
                <span className="font-bold">3% Rebate System:</span> Invite friends and earn 3% rebate when they recharge.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">How it Works:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Share your invite link from Team page</li>
                  <li>• When someone joins using your link</li>
                  <li>• You earn 3% of their recharge amount</li>
                  <li>• You also get 3% of their withdrawal rebate</li>
                  <li>• Build your team and earn passive income!</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-blue-700">
                  Example: If your referral recharges ₹10,000, you earn ₹300 (3%)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EarningGuide;
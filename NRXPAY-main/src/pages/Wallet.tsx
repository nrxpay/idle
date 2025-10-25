import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { DepositHistory } from "@/components/DepositHistory";
import WithdrawHistory from "@/components/WithdrawHistory";
import WithdrawForm from "@/components/WithdrawForm";
import { useUserBalance } from "@/hooks/useUserBalance";
import { useUSDTRates } from "@/hooks/useUSDTRates";
import { useUserBankAccounts } from "@/hooks/useUserBankAccounts";
import AddUpiForm from "@/components/AddUpiForm";
import UpiAccountsList from "@/components/UpiAccountsList";

const Wallet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deposit");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [showAllBanks, setShowAllBanks] = useState(false);

  // Open modals based on query params (from profile shortcuts)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('openUpi')) {
        setShowUpiForm(true);
      }
      if (params.get('openWithdraw')) {
        setShowWithdrawForm(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Use custom hooks for balance, rates, and bank accounts
  const { balance, loading: balanceLoading } = useUserBalance();
  const { rates, loading: ratesLoading } = useUSDTRates();
  const { bankAccounts, loading: bankLoading } = useUserBankAccounts();

  // Calculate USDT balance in INR using sell rate
  const usdtInINR = rates && balance ? balance.usdt_balance * rates.sell_rate : 0;

  return <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Wallet</h1>
        <div className="w-9"></div>
      </div>
      
      <main className="px-4 py-6 space-y-6 animate-slide-up">

        {/* User Balance */}
        <Card className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium">CURRENT BALANCE (USDT → INR)</p>
              <p className="font-bold text-foreground text-lg">
                {balanceLoading || ratesLoading ? "Loading..." : `₹ ${Math.round(usdtInINR).toLocaleString()}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium">USDT BALANCE</p>
              <p className="text-foreground text-lg font-bold">
                {balanceLoading ? "Loading..." : `${balance?.usdt_balance || 0} USDT`}
              </p>
            </div>
          </div>
          {rates && !ratesLoading && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                Current Rate: 1 USDT = ₹{rates.sell_rate}
              </p>
            </div>
          )}
        </Card>

        {/* Bank Account Details */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Bank Account Details</h3>
            {bankAccounts.length > 2 && (
              <button
                className="text-xs text-primary underline"
                onClick={() => setShowAllBanks((s) => !s)}
              >
                {showAllBanks ? "Show less" : `Show all (${bankAccounts.length})`}
              </button>
            )}
          </div>
          {bankLoading ? (
            <p className="text-sm text-muted-foreground">Loading bank details...</p>
          ) : bankAccounts.length > 0 ? (
            <div className="space-y-2">
              {(showAllBanks ? bankAccounts : bankAccounts.slice(0, 2)).map((account, index) => (
                <div key={`${account.user_id}-${index}`} className="bg-muted/50 p-2 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{account.account_holder_name}</p>
                    <p className="text-xs text-muted-foreground">{account.bank_name}</p>
                    <p className="text-xs text-muted-foreground">****{account.account_number.slice(-4)} • {account.ifsc_code}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{account.branch_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No bank account added yet</p>
          )}
        </Card>

        <Card className="p-4">
          <UpiAccountsList />
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline-neon" 
            className="h-12" 
            onClick={() => navigate(bankAccounts.length > 0 ? "/change-bank" : "/add-bank")}
          >
            {bankAccounts.length > 0 ? "Change Bank" : "Add Bank"}
          </Button>
          <Button variant="outline-neon" className="h-12" onClick={() => setShowUpiForm(true)}>
            Add UPI
          </Button>
        </div>

        {/* Withdraw Button */}
        <Button 
          variant="neon" 
          className="w-full h-14 text-lg font-semibold"
          onClick={() => setShowWithdrawForm(true)}
        >
          📤 Withdraw
        </Button>

        {/* Transaction History */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit History</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <DepositHistory />
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <WithdrawHistory />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
      
      <WithdrawForm 
        isOpen={showWithdrawForm}
        onClose={() => setShowWithdrawForm(false)}
        onSuccess={() => {
          // Optionally switch to withdraw tab to show the new request
          setActiveTab("withdraw");
        }}
      />
      {showUpiForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddUpiForm />
            <Button variant="ghost" onClick={() => setShowUpiForm(false)} className="mt-4 w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>;
};
export default Wallet;
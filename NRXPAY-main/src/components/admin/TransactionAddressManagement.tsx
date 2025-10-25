import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";

export default function TransactionAddressManagement() {
  const [addresses, setAddresses] = useState<TransactionAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state for each crypto type
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [solanaAddress, setSolanaAddress] = useState("");
  const [litecoinAddress, setLitecoinAddress] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("transaction_addresses")
        .select("*")
        .order("crypto_type");

      if (error) throw error;

      setAddresses(data || []);

      // Populate form fields
      data?.forEach((addr: any) => {
        switch (addr.crypto_type) {
          case "bitcoin":
            setBitcoinAddress(addr.address);
            break;
          case "ethereum":
            setEthereumAddress(addr.address);
            break;
          case "solana":
            setSolanaAddress(addr.address);
            break;
          case "litecoin":
            setLitecoinAddress(addr.address);
            break;
          case "usdt":
            setUsdtAddress(addr.address);
            break;
        }
      });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load transaction addresses");
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (cryptoType: string, address: string) => {
    if (!address.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    const cryptoSymbols: Record<string, string> = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      solana: 'SOL',
      litecoin: 'LTC',
      usdt: 'USDT'
    };

    setSaving(true);
    try {
      const { error } = await supabase
        .from("transaction_addresses")
        .upsert({
          crypto_type: cryptoType,
          crypto_symbol: cryptoSymbols[cryptoType] || cryptoType.toUpperCase(),
          address: address.trim(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: "crypto_type"
        });

      if (error) throw error;

      toast.success(`${cryptoType.toUpperCase()} address updated successfully`);
      fetchAddresses(); // Refresh the data
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast.error(error.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const copyAddress = (address: string, cryptoType: string) => {
    navigator.clipboard.writeText(address);
    toast.success(`${cryptoType.toUpperCase()} address copied to clipboard`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Address Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading addresses...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Address Management</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update cryptocurrency addresses for recharge and crypto exchange transactions
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bitcoin */}
          <div className="space-y-2">
            <Label htmlFor="bitcoin-address" className="text-base font-semibold">
              Bitcoin (BTC) Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="bitcoin-address"
                value={bitcoinAddress}
                onChange={(e) => setBitcoinAddress(e.target.value)}
                placeholder="Enter Bitcoin address"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(bitcoinAddress, "bitcoin")}
                disabled={!bitcoinAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => updateAddress("bitcoin", bitcoinAddress)}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </div>

          {/* Ethereum */}
          <div className="space-y-2">
            <Label htmlFor="ethereum-address" className="text-base font-semibold">
              Ethereum (ETH) Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="ethereum-address"
                value={ethereumAddress}
                onChange={(e) => setEthereumAddress(e.target.value)}
                placeholder="Enter Ethereum address"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(ethereumAddress, "ethereum")}
                disabled={!ethereumAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => updateAddress("ethereum", ethereumAddress)}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </div>

          {/* Solana */}
          <div className="space-y-2">
            <Label htmlFor="solana-address" className="text-base font-semibold">
              Solana (SOL) Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="solana-address"
                value={solanaAddress}
                onChange={(e) => setSolanaAddress(e.target.value)}
                placeholder="Enter Solana address"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(solanaAddress, "solana")}
                disabled={!solanaAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => updateAddress("solana", solanaAddress)}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </div>

          {/* Litecoin */}
          <div className="space-y-2">
            <Label htmlFor="litecoin-address" className="text-base font-semibold">
              Litecoin (LTC) Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="litecoin-address"
                value={litecoinAddress}
                onChange={(e) => setLitecoinAddress(e.target.value)}
                placeholder="Enter Litecoin address"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(litecoinAddress, "litecoin")}
                disabled={!litecoinAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => updateAddress("litecoin", litecoinAddress)}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </div>

          {/* USDT */}
          <div className="space-y-2">
            <Label htmlFor="usdt-address" className="text-base font-semibold">
              USDT Address
            </Label>
            <div className="flex gap-2">
              <Input
                id="usdt-address"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                placeholder="Enter USDT address"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyAddress(usdtAddress, "usdt")}
                disabled={!usdtAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => updateAddress("usdt", usdtAddress)}
                disabled={saving}
              >
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Addresses Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold capitalize">{addr.crypto_type} ({addr.crypto_symbol})</p>
                  <p className="text-sm text-gray-600 font-mono break-all">{addr.address}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyAddress(addr.address, addr.crypto_type)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {addresses.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No addresses configured yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
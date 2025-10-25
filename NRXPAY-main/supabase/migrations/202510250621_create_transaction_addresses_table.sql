-- Create transaction_addresses table
CREATE TABLE IF NOT EXISTS transaction_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crypto_type TEXT NOT NULL UNIQUE,
  crypto_symbol TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transaction_addresses_updated_at
  BEFORE UPDATE ON transaction_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default addresses
INSERT INTO transaction_addresses (crypto_type, crypto_symbol, address) VALUES
  ('bitcoin', 'BTC', '1BitcoinEaterAddressDontSendf59kuE'),
  ('ethereum', 'ETH', '0x742d35Cc6588C4a1F1D9b1C7a1b5b8c9d1f2e3b4c5'),
  ('solana', 'SOL', 'So11111111111111111111111111111111111111112'),
  ('litecoin', 'LTC', 'LTC1234567890abcdefghij1234567890ab'),
  ('usdt', 'USDT', 'TBbY2a6YoY6c932DrkZMLKRe3iBBg8X7jM')
ON CONFLICT (crypto_type) DO NOTHING;
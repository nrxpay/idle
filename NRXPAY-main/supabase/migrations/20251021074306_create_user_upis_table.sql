
CREATE TABLE user_upis (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    upi_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_upis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own UPIs" ON user_upis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own UPIs" ON user_upis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own UPIs" ON user_upis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own UPIs" ON user_upis FOR DELETE USING (auth.uid() = user_id);

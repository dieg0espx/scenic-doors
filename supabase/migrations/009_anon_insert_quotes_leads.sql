-- Allow unauthenticated visitors to insert leads and quotes from the public quote wizard
CREATE POLICY "Anon can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can insert quotes" ON quotes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update leads" ON leads FOR UPDATE TO anon USING (true) WITH CHECK (true);

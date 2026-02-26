CREATE POLICY "Anon can delete quote photos"
  ON quote_photos FOR DELETE TO anon USING (true);

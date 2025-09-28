const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    const { data: callus_types, error: e1 } = await supabase.from('callus_types').select('*');
    if (e1) throw e1;

    const { data: products, error: e2 } = await supabase.from('products').select('*');
    if (e2) throw e2;

    const { data: treatments, error: e3 } = await supabase.from('treatments').select('*');
    if (e3) throw e3;

    res.status(200).json({ callus_types, products, treatments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

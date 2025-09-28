const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const clientData = req.body;

    // Procura por um cliente existente com o mesmo email ou telemóvel
    let query = supabase.from('clients');
    if (clientData.email) {
        query = query.select('id').eq('email', clientData.email);
    } else if (clientData.phone) {
        query = query.select('id').eq('phone', clientData.phone);
    }

    const { data: existing, error: findError } = await query;
    if (findError) throw findError;

    if (existing && existing.length > 0) {
        // Se o cliente já existe, retorna os dados dele em vez de criar um novo.
        return res.status(200).json({ success: true, data: existing, message: 'Client already exists.' });
    }

    // Se não existe, insere o novo cliente
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();

    if (error) throw error;

    res.status(200).json({ success: true, data: data, message: 'Client created.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const express = require('express');
const serverless = require('serverless-http');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
app.use(express.json());

router.get('/messages', async (req, res) => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    res.json(data || []);
});

router.post('/messages', async (req, res) => {
    const { error } = await supabase.from('messages').insert([req.body]);
    if (error && error.code === '23505') return res.status(400).json({ error: "Taken" });
    res.status(201).json({ success: true });
});

app.use('/api', router);
module.exports.handler = serverless(app);

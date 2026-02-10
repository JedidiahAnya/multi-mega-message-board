const express = require('express');
const serverless = require('serverless-http');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const router = express.Router();

// Get these from your Supabase Dashboard
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

// Get all messages from Supabase
router.get('/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
    
  if (error) return res.status(500).json(error);
  res.json(data);
});

// Post a new message
router.post('/messages', async (req, res) => {
  const { user, text } = req.body;
  const { data, error } = await supabase
    .from('messages')
    .insert([{ user, text }]);

  if (error) return res.status(500).json(error);
  res.status(201).json(data);
});

app.use('/api', router);
module.exports.handler = serverless(app);

// Add this helper to get the user from the header
const getUser = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return user;
};

router.post('/messages', async (req, res) => {
  const token = req.headers.authorization;
  const user = await getUser(token);

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase
    .from('messages')
    .insert([{ text: req.body.text, user_id: user.id }]);

  if (error) return res.status(500).json(error);
  res.status(201).json(data);
});

const express = require('express');
const serverless = require('serverless-http');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const router = express.Router();

// Get these from your Supabase Dashboard
const supabase = createClient(
  process.env.https://donetvmwpxlxqkzrnsvu.supabase.co, 
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbmV0dm13cHhseHFrenJuc3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU3NDgsImV4cCI6MjA4NjMwMTc0OH0.XvPZy5DMaDYjWphDWf2DYYXr-WbMWnc1hGCljMqe_JI
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

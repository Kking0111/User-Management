import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const jsonFilePath = path.join('data', 'users.json');

let users = [];

// Load users from JSON file on server start
async function loadUsers() {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    console.error('Error loading users from JSON file:', error);
    users = [];
  }
}

// Save users to JSON file
async function saveUsers() {
  try {
    console.log('Saving users to JSON file:', users);
    await fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users to JSON file:', error);
  }
}

// Initialize users data
loadUsers();

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

app.post('/api/users', async (req, res) => {
  const { name, email, mobile } = req.body;
  console.log('Adding user:', { name, email, mobile });
  if (!name || !email || !mobile) {
    return res.status(400).send('Name and email are required');
  }
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    mobile
  };
  users.push(newUser);
  await saveUsers();
  res.status(201).json(newUser);
});

app.put('/api/users/:id', async (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  const { name, email, mobile } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.mobile = mobile || user.mobile;

  await saveUsers();
  res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("User not found");

  const deletedUser = users.splice(index, 1);
  await saveUsers();
  res.json(deletedUser[0]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// Dummy in-memory database
let users = [
  { id: 1, name: "Alicem", email: "alice@example.com", mobile: "74598" },
  { id: 2, name: "Bob", email: "bob@example.com", mobile: "7459873458" },
  { id: 3, name: "Kartik", email: "kartik@gmail.com", mobile: "7459873458" },
  { id: 4, name: "dghdio", email: "dsfmi@fm.cf", mobile: "67548967" },
  { id: 5, name: "eyphodfji", email: "idsjgiogh@gfj.cdhjbh", mobile: "3269873456" },
  { id: 6, name: "dkvngn", email: "sffi@dfm.dkn", mobile: "23465" }
];

async function saveUsers() {
  console.log('In-memory users updated:', users);
}

// API Routes
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
  if (!name || !email || !mobile) {
    return res.status(400).send('Name, email, and mobile are required');
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

// ---------- Serve Frontend -----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// -------------------------------------

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

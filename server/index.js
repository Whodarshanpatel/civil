
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory fallback if MongoDB is not available
let messages = [];

// MongoDB connection with Timeout
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI, { 
    serverSelectionTimeoutMS: 5000 
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.log('⚠️ MongoDB connection error (using in-memory fallback):', err.message);
  });

// Schema for Portfolio Data
const portfolioSchema = new mongoose.Schema({
  hero: Object,
  about: Object,
  skills: Array,
  services: Array,
  experience: Array,
  education: Array,
  contact: Object
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Schema for Contact Messages
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const workerSchema = new mongoose.Schema({
  name: String,
  role: String,
  site: String,
  status: { type: String, default: 'Active' },
  phone: String
});

const projectSchema = new mongoose.Schema({
  name: String,
  location: String,
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'Ongoing' }
});

const Contact = mongoose.model('Contact', contactSchema);
const Worker = mongoose.model('Worker', workerSchema);
const Project = mongoose.model('Project', projectSchema);

// Initial Seed Data (Sanket Valand's data)
const seedData = {
  hero: {
    tag: 'Civil Engineer & Structural Designer',
    h1: 'ENGINEERING',
    h2: 'EXCELLENCE',
    sub: 'Creative & Reliable Civil Engineering Solutions — From Blueprint to Built Reality.',
    stats: [
      { label: 'Years Exp.', num: '8', span: '+' },
      { label: 'Projects Done', num: '42', span: '+' },
      { label: 'Happy Clients', num: '15', span: '+' }
    ]
  },
  about: {
    bio: 'Experienced Civil Engineer with a strong background in structural design, project management, and site supervision. I have a passion for creating sustainable and efficient structures that stand the test of time.',
    info: [
      { label: 'Name', value: 'Sanket Valand' },
      { label: 'Email', value: 'sanket@example.com' },
      { label: 'Location', value: 'Gujarat, India' },
      { label: 'Availability', value: 'Full-time / Freelance' }
    ]
  },
  skills: [
    { name: 'AutoCAD', icon: '🏗️', level: 90 },
    { name: 'Staad Pro', icon: '📐', level: 85 },
    { name: 'Revit', icon: '🏢', level: 80 },
    { name: 'Project Mgmt', icon: '📅', level: 95 }
  ],
  services: [
    { title: 'Structural Design', desc: 'Planning and designing structural frameworks for buildings.', icon: '🏗️' },
    { title: 'Site Supervision', desc: 'Managing on-site construction activities and quality control.', icon: '👷' },
    { title: 'Consultancy', desc: 'Expert advice on civil engineering projects.', icon: '💡' }
  ],
  experience: [
    { date: '2018 - Present', role: 'Senior Civil Engineer', company: 'BuildSmart Solutions', desc: 'Leading structural design teams and overseeing major commercial projects.' },
    { date: '2015 - 2018', role: 'Junior Civil Engineer', company: 'IndoDesign Builders', desc: 'Assisted in site surveys and preliminary structural analysis.' }
  ],
  education: [
    { year: '2011 - 2015', degree: 'B.Tech in Civil Engineering', institute: 'IIT Bombay', grade: '9.2 CGPA' }
  ],
  contact: {
    email: 'sanket.valand@engg.com',
    phone: '+91 9876543210',
    location: 'Ahmedabad, Gujarat',
    linkedin: 'linkedin.com/in/sanketvaland'
  }
};

// API Routes
app.get('/api/portfolio', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      portfolio = new Portfolio(seedData);
      await portfolio.save();
    }
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Contact.find().sort({ date: -1 });
      res.json(messages);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Worker Endpoints
app.get('/api/workers', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) { res.status(500).json({ error: 'Error fetching workers' }); }
});

app.post('/api/workers', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.json(worker);
  } catch (err) { res.status(500).json({ error: 'Error adding worker' }); }
});

app.delete('/api/workers/:id', async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Error deleting worker' }); }
});

// Project Management Endpoints
app.get('/api/projects-list', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) { res.status(500).json({ error: 'Error fetching projects' }); }
});

app.post('/api/projects-list', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: 'Error adding project' }); }
});

app.delete('/api/projects-list/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Error deleting project' }); }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (mongoose.connection.readyState === 1) {
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();
        console.log(`✅ Stored in MongoDB from ${name}`);
    } else {
        messages.push({ name, email, message, date: new Date() });
        console.log(`📂 Stored in Memory from ${name}`);
    }
    
    res.json({ success: true, message: 'Message received!' });
  } catch (err) {
    console.error('Error in contact route:', err);
    res.status(500).json({ error: 'Failed to store message' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;

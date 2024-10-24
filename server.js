const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// connect document

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.BD_PASSWORD);
mongoose.connect(DB).then(() => {
  console.log('DB connected');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on Port ${port}...`);
});

//Test

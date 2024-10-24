const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

const Tours = require('../../model/tourmodel.js');

dotenv.config({ path: './config.env' });

const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// connect document
console.log('hi');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.BD_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successfully'));

const importData = async () => {
  try {
    await Tours.create(tour);

    console.log('Data successfully loaded!.');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tours.deleteMany();

    console.log('Data successfully deleted!.');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  console.log(process.argv);
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);

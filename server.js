require('dotenv').config();
const db = require('./config/db');
db.connect();
const schedule = require('node-schedule')
const Product = require('./models/product')
// every_day_midnight = 0 0 * * *
const express = require('express');
var cors = require('cors')

const app = express();
app.use(cors())

const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);



app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Resource not found'
    })
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        message: 'Internal server error'
    })
});


let todayDate = new Date();

// Extract year, month, and day components
let year = todayDate.getFullYear();
let month = String(todayDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
let day = String(todayDate.getDate()).padStart(2, '0');

let formattedDate = `${year}-${month}-${day}`;
const job = schedule.scheduleJob('0 0 * * *', async ()=>{
    const expired = await Product.find()
    for (date of expired) {
        const expiry_date_formatted = date.expiry_date.toISOString().split("T")[0]
        if(expiry_date_formatted<formattedDate){
            console.log(date.expiry_date);
            date.status="inactive"
            await date.save()
        }
    }
  });

app.listen((process.env.PORT || 3000), () => {
    console.log(`\n--- Server listening on port ${process.env.PORT || 3000}`)
})
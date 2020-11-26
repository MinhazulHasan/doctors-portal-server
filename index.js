const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = 5000;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctors'));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rdyuw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Get all Appointments
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('appointments');
        collection.find().toArray((err, documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();
})

// Get all Booked Appointments
app.get('/bookedAppointments', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.find().toArray((err, documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();
})

// Insert Appointment Booking
app.post('/makeBooking', (req, res) => {
    const data = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.insertOne(data, (err, result) => {
            err ? res.status(500).send({ message: err }) : res.send(result.ops[0])
        })
    })
    client.close();
})



// Updating Booking Status
app.post('/updateBookingStatus', (req, res) => {
    const ap = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id: ObjectId(ap.id) },
            {
                $set: { "status": ap.status },
                $currentDate: { "lastModified": true }
            },
            (err, result) => {
                if (err) {
                    res.status(500).send({ message: err })
                }
                else {
                    res.send(result);
                }
                client.close();
            })
    });
})


// Updating Appointment Date/Time
app.post('/updateAppointmentTime', (req, res) => {
    const ap = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id: ObjectId(ap.id) },
            {
                $set: { "date": ap.date, "time": ap.time },
                $currentDate: { "lastModified": true }
            },
            (err, result) => {
                if (err) {
                    res.status(500).send({ message: err })
                }
                else {
                    res.send(result);
                }
                client.close();
            })
    });
})

// Updating Appointment Visiting Status
app.post('/updateVisitingStatus', (req, res) => {
    const ap = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id: ObjectId(ap.id) },
            {
                $set: { "visitingStatus": ap.visitingStatus },
                $currentDate: { "lastModified": true }
            },
            (err, result) => {
                if (err) {
                    res.status(500).send({ message: err })
                }
                else {
                    res.send(result);
                }
                client.close();
            })
    });
})


// Updating Prescription
app.post('/updatePrescription', (req, res) => {
    const ap = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id: ObjectId(ap.id) },
            {
                $set: { "prescription": ap.prescription },
                $currentDate: { "lastModified": true }
            },
            (err, result) => {
                if (err) {
                    res.status(500).send({ message: err })
                }
                else {
                    res.send(result);
                }
                client.close();
            })
    });
})


app.get('/', (req, res) => {
    res.send('DataBase connected')
})

app.listen(process.env.PORT || port, () => console.log(`Listening to port http://localhost:${port}`))
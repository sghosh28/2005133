import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Outlet } from 'react-router-dom';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import axios from 'axios';

const dummyTrains = [
  {
    id: 1,
    name: 'Express Train',
    departTime: '08:00 AM',
    delay: 0,
    price: { sleeper: 20, ac: 40 },
    availability: { sleeper: 120, ac: 60 },
    description: 'This is the Express Train. It is known for its speed and punctuality.',
  },
  {
    id: 2,
    name: 'Superior Train',
    departTime: '12:00 PM',
    delay: 30,
    price: { sleeper: 15, ac: 35 },
    availability: { sleeper: 100, ac: 50 },
    description: 'The Superior Train offers a comfortable journey with excellent amenities.',
  },
  {
    id: 3,
    name: 'Luxury Train',
    departTime: '04:00 PM',
    delay: 15,
    price: { sleeper: 25, ac: 50 },
    availability: { sleeper: 80, ac: 40 },
    description: 'Experience luxury travel with the finest services on the Luxury Train.',
  },
];

const sortOptions = [
  { value: 'price', label: 'Price (Low to High)' },
  { value: 'availability', label: 'Availability (High to Low)' },
  { value: 'departure', label: 'Departure Time (Late to Early)' },
];



const TrainCard = ({ train, handleBooking, selectedClass, setSelectedClass }) => {
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  return (
    <Card variant="outlined" style={{ margin: '10px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {train.trainName}
        </Typography>
        <Typography variant="h5" component="h2">
          {train.trainNumber}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Departure: {train.departureTime.Hours} : {train.departureTime.Minutes} : {train.departureTime.Seconds}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Delay: {train.delayedBy} minutes
        </Typography>
        <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '10px' }}>
          <InputLabel>Class</InputLabel>
          <Select value={selectedClass} onChange={handleClassChange} label="Class">
            <MenuItem value="sleeper">Sleeper</MenuItem>
            <MenuItem value="AC">AC</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" component="p">
          Price: ${train.price[selectedClass]}
        </Typography>
        <Typography variant="body2" component="p">
          Available Tickets: {train.seatsAvailable[selectedClass]}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleBooking(train.trainNumber)}>
          View More
        </Button>
      </CardContent>
    </Card>
  );
};

const TrainDetailsPage = ({ trainId }) => {
  const selectedTrain = dummyTrains.find((train) => train.id === parseInt(trainId));

  if (!selectedTrain) {
    return <Typography variant="h5">Train not found!</Typography>;
  }

  const { name, departTime, delay, price, availability, description } = selectedTrain;

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        Train Details
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Departure: {departTime}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Delay: {delay} minutes
          </Typography>
          <Typography variant="body2" component="p">
            Description: {description}
          </Typography>
          <Typography variant="body2" component="p">
            Sleeper Class Price: ${price.sleeper}
          </Typography>
          <Typography variant="body2" component="p">
            AC Class Price: ${price.ac}
          </Typography>
          <Typography variant="body2" component="p">
            Available Sleeper Tickets: {availability.sleeper}
          </Typography>
          <Typography variant="body2" component="p">
            Available AC Tickets: {availability.ac}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

function TrainList() {
  const [bookedTickets, setBookedTickets] = useState([]);
  // const [trains, setTrains] = useState(dummyTrains);
  const [sortBy, setSortBy] = useState('price');
  const [selectedClass, setSelectedClass] = useState('sleeper');

  const handleBooking = (trainNumber) => {
    const fetchTrains = async (trainNumber) => {
      await axios.get(`http://localhost:3000/singleTrainSchedule?trainNumber=${trainNumber}`).then((response) => {
        console.log("hiiiiiii", response.data);

        setTrains([response.data]);
      });
    };

    fetchTrains(trainNumber);

  };

  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      await axios.get('http://localhost:3000/getTrainSchedule').then((response) => {
        console.log("hiiiiiii", response.data);

        setTrains(response.data);
      });
    };

    fetchTrains();
  }, []);

  return (
    <Grid container spacing={3}>
      {trains.map((train) => (
        <Grid item xs={12} sm={6} md={4} key={train.trainNumber}>
          <TrainCard
            train={train}
            handleBooking={handleBooking}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function App() {
  return (
    <Router>
      <Container>
        <Typography variant="h4" style={{ margin: '20px 0' }}>
          Train Scheduling and Booking
        </Typography>

        <Routes>
          <Route path="/" element={<TrainList />} />
          <Route path="/train/:trainId" element={<Outlet><TrainDetailsPage /></Outlet>} />
        </Routes>

      </Container>
    </Router>
  );
}

export default App;

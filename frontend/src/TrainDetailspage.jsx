import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Card, CardContent } from '@material-ui/core';

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

const TrainDetailsPage = () => {
  const { trainId } = useParams();
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

export default TrainDetailsPage;

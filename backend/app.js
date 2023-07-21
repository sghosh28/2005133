const axios = require('axios')

const express = require('express')
const app = express()
const port = 3000

let cors = require("cors");
app.use(cors());

loginData = {
    "companyName": "Soumya",
    "clientID": "30d6d747-23ca-4ea4-92b3-553f19760148",
    "clientSecret": "xqrgAieJuFVZUsgP",
    "ownerName": "Soumyadip Ghosh",
    "ownerEmail": "2005133@kiit.ac.in",
    "rollNo": "2005133"
}
logCreds = {}
const auth = async() => {

  await axios.post('http://20.244.56.144/train/auth', loginData).then((res) => {
      console.log(res.data)
      logCreds = res.data
  
  })
}
const authMiddleware = async(req, res, next) => {
  let currentUnixTime = Math.round((new Date()).getTime() / 1000);
  if (!logCreds.access_token|| logCreds.expires_in < currentUnixTime) {
      await auth()
  }
  next()
}

app.use(authMiddleware)


app.get('/getTrainSchedule',async(req,res) =>{
    try {

        trainData = {}
       await axios.get('http://20.244.56.144/train/trains', {headers:{'Authorization': 'Bearer ' + logCreds.access_token}}).then((res) => {
       trainData = res.data})
       
       const currentDate = new Date();
       const currentTimestamp = currentDate.getTime();
       
       const next12HoursTimestamp = currentTimestamp + 12 * 60 * 60 * 1000;
       
       const next30MinutesTimestamp = currentTimestamp + 30 * 60 * 1000;
       
       const filteredTrains = trainData.filter((train) => {
         const departureTimestamp = currentDate.setHours(train.departureTime.Hours, train.departureTime.Minutes, train.departureTime.Seconds, 0);
         const delayedTimestamp = departureTimestamp + train.delayedBy * 60 * 1000;
         
         return delayedTimestamp > next30MinutesTimestamp && delayedTimestamp <= next12HoursTimestamp;
       });
       
       const sortedTrains = filteredTrains.sort((a, b) => {
         if (a.price.sleeper !== b.price.sleeper) {
           return a.price.sleeper - b.price.sleeper;
         }
       
         if (a.seatsAvailable.sleeper !== b.seatsAvailable.sleeper) {
           return b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
         }
       
         const departureTimestampA = currentDate.setHours(a.departureTime.Hours, a.departureTime.Minutes + a.delayedBy, a.departureTime.Seconds, 0);
         const departureTimestampB = currentDate.setHours(b.departureTime.Hours, b.departureTime.Minutes + b.delayedBy, b.departureTime.Seconds, 0);
         
         return departureTimestampB - departureTimestampA;
       });
       res.send(sortedTrains)
    }
    catch(err){
        console.log(err)
        res.send(err)
    }


})

app.get('/singleTrainSchedule', async(req,res) =>{
  try {

    trainData = []
    const {trainNumber} = req.query
    await axios.get(`http://20.244.56.144/train/trains/${trainNumber}` , {headers:{'Authorization': 'Bearer ' + logCreds.access_token}, }).then((res) => {
        trainData = res.data})
    res.send(trainData)
  }
      catch(err){
        console.log(err)
        res.send(err)
    }
})


app.get('/get', (req, res) => {
  console.log("Hello")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
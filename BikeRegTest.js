const axios = require('axios');
const fs = require('fs');
const stringify = require('csv-stringify');

const triRegUrl = 'http://www.SkiReg.com/api/search';
let startPage = 0;

let eventsArray = [];

function getEvents(startPage){
  axios.get(triRegUrl, {
    params: {
      startpage: startPage
    }
  })
  .then(response => {
    let resultsCount = response.data.ResultCount;
    let eventResults = response.data.MatchingEvents;

    for(let i = 0; i < eventResults.length; i++) {
      let rawDate = eventResults[i].EventDate;
      let timestampInt = rawDate.replace(/[^0-9\-]/g,'');
      let prepDate = parseInt(timestampInt);
      let dateObject = new Date(prepDate);
      let date = dateObject.toLocaleString();
      let eventName = eventResults[i].EventName;
      let eventTypes = eventResults[i].EventTypes;
      let eventWebsite = eventResults[i].EventWebsite;
      let eventUrl = eventResults[i].EventUrl;
      let eventAddress = eventResults[i].EventAddress;
      let eventCity = eventResults[i].EventCity;
      let eventState = eventResults[i].EventState;
      let eventZip = eventResults[i].EventZip;
      eventsArray.push({
        "Event Name": eventName,
        "Event Date": date,
        "Event Types": eventTypes,
        "Event Website": eventWebsite,
        "Event URL": eventUrl,
        "Event Address": eventAddress,
        "Event City": eventCity,
        "Event State": eventState,
        "Event Zip": eventZip
      });
      // console.log(eventsArray);
    }
    if(resultsCount == 100) {
      startPage = startPage + 1;
      getEvents(startPage);
    }else{
      console.log(eventsArray);
      stringify(eventsArray, { header: true}, (err, output) => {
        if (err) return console.error(err);
        fs.writeFile('SkiRegEvents.csv', output, (err) => {
          if (err) return console.error(err);
          console.log("csv saved");
        });
      })
    }
  })
  .catch(error => {
    console.log(error);
  })
}

getEvents(startPage);




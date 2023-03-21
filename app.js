require('dotenv').config()   // for .env file
const express= require('express')
const app= express();
const _ = require('lodash')
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const dateMonthYear = require(__dirname+"/date.js") // requiring a created inbuilt module


//no need to add package/module of https if we install node  bcoz it is included in  a node module
const https= require('https');

app.set('view engine','ejs')
app.use(express.static("public"))

const Date= dateMonthYear.getsDate()
const appKey = process.env.APP_KEY;
const unit = "metric";


app.get("/", (req, res) => {


   const query = 'Delhi';

   const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appKey}&units=${unit}`;
 
   https.get(url, (response) => {
     console.log(response.statusCode);
     let data = '';
 
     response.on("data", (chunk) => {
       data += chunk;
     });
 
     response.on("end", () => {
       const weatherData = JSON.parse(data);
       console.log(weatherData);
       
       // You can now use the weatherData to get the specific pieces of data that you're interested in, and render it in your response.
       const icons=weatherData.weather[0].icon;

       const iconURL=`http://openweathermap.org/img/wn/${icons}@2x.png`;
       
       res.render("index", {
         city: query,
         minTemp: weatherData.main.temp_min,
         weatherDescription:_.capitalize(weatherData.weather[0].description),date:Date,iconUrl:iconURL,humidity:weatherData.main.humidity,maxTemp:weatherData.main.temp_max,pressure:weatherData.main.pressure,country:weatherData.sys.country
       });
     });
   }).on('error', (error) => {
     console.error(`Error: ${error.message}`);
   });
 });
 

app.post("/",(req,res)=>{
   // console.log(request.body.nameInput);    // "nameInput is the "name" of the input element type text in html file"


//url for  open weather api
const query=_.capitalize(req.body.nameInput);


const url=`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appKey}&units=${unit}`


https.get(url,(response)=>{

console.log(response.statusCode);

if(response.statusCode===200)
{

// how to get hold of the data from the http response?
response.on("data",(data)=>{
console.log(data); // here data in hexadecimal form

// parse an actual  JSON data that we get back into an actual Javascript object
const weatherData= JSON.parse(data);// it will convert any type of data into javascript object
console.log(weatherData);

//  how to dig through  our Javascript object to get these specific pieces of data that we're interested in?
console.log(weatherData.weather[0].description); // weather is a array inside json,that's y index is used
console.log(weatherData.main.temp_min); // main is object inside json
console.log(weatherData.weather[0].id)
/*
const tempObj={name:"preeti",
                age:14,
                location:"india"
}
console.log( JSON.stringify(tempObj)+"// it will convert whole js object into string so that it convert back into js");

*/

//    res.send("<h1>The current temperature of Delhi  is : "+weatherData.main.temp_min);

//though we have only one res.send() to return response on page,
// but for writing multiple line we can use multiple res.write()
//e.g,

const icons=weatherData.weather[0].icon;

const iconURL=`http://openweathermap.org/img/wn/${icons}@2x.png`;


res.render("index", {
   city: query,
   minTemp: weatherData.main.temp_min,
   weatherDescription: _.capitalize(weatherData.weather[0].description),date:Date,iconUrl:iconURL,humidity:weatherData.main.humidity,maxTemp:weatherData.main.temp_max,pressure:weatherData.main.pressure,country:weatherData.sys.country
 });
});}

else
{
res.redirect('/')
}
})
})



app.listen(3000,function(){
    console.log("server is running on port 3000");
   
})


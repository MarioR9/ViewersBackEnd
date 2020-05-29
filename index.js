const express = require('express');  
const cors = require('cors')
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

const serversList = { // https://www.us-proxy.org
  0:"http://50.246.120.125:8080",	
  1:"http://160.2.38.41:8080",
  2:"http://207.144.111.230:8080",	
  3:"http://69.92.133.126:8080",	
  4:"http://50.233.228.147:8080",
  5:"http://144.121.248.114:8080",
  6:"http://205.185.115.100:8080",
  7:"http://209.141.49.11:8080",	
  8:"http://3.84.27.209:8080"
}

const app = express();
const port = process.env.PORT || 8080
app.listen(port)
app.get('/', (req, res) => res.send('Viewers Server'))
app.use(express.json({}), cors())


app.post('/api', (req, res)=>{
  console.log('i got a res');
  console.log(req.body);
 
(async () => {
  
  try { 
    let i = 0
  while(i < req.body.numOfViewers){

    if(req.body.status === "close"){
      res.json({
        status: "Success viewing has stopped!"})
        console.log("Success stop")
        return browser.close()
    } 
  const oldProxyUrl = `${serversList[i]}`;
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
  const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=${newProxyUrl}`,'--no-sandbox', '--disable-setuid-sandbox',`--ignore-certificate-errors`]});
  
  // Prints something like "Connecting to: http://127.0.0.1:45678"
  console.log("Connecting to: " + newProxyUrl);
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(req.body.website, {waitUntil: 'load',timeout: 0});
  console.log("Page Fully Loaded!")
  i++
  }
  res.json({
    status: "Success your connected with " + i + " " +"channels"})
  } catch (e) {
    if (e instanceof puppeteer.errors.TimeoutError) {
      console.log(e)
    }
  }
 
  })();

})



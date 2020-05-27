const express = require('express');  
const cors = require('cors')
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

const serversList = {
  0:"http://190.103.178.15:8080",	
  1:"http://64.227.106.79:8080",
  2:"http://209.97.150.167:8080",	
  3:"http://63.82.52.254:8080",	
  4:"http://198.199.86.11:8080",
  5:"http://102.129.249.120:8080",
  6:"http://157.245.15.86:8080",
  7:"http://45.76.10.20:8080",	
  8:"http://64.225.112.121:8080"
}

const app = express();
app.get('/', (req, res) => res.send('Viewers Server'))
app.use(express.json({}), cors())


app.post('/api', (req, res)=>{
  console.log('i got a res');
  console.log(req.body);
  


(async () => {
  let i = 0
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  while(i < req.body.numOfViewers){
  const oldProxyUrl = `${serversList[i]}`;
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
  
  // Prints something like "Connecting to: http://127.0.0.1:45678"

  console.log("Connecting to: " + newProxyUrl);
  const page = await browser.newPage();
  await page.goto(req.body.website);
  i++
  }

  browser.close();
  console.log("Success your connected with " + i + " " +"channels")
})();
  
})

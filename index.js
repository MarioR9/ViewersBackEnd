const express = require('express');  
const cors = require('cors')

let serverList = []

const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');


const app = express();
const port = process.env.PORT || 8080
app.listen(port)
app.get('/', (req, res) => res.send('Viewers Server'))
app.use(express.json({}), cors())


app.post('/api', (req, res)=>{
  console.log('reques to connect');
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
  const oldProxyUrl = `${serverList[0][i]}`;
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

app.post('/api2',(req, res)=>{
  console.log('reques to server');
  console.log(req.body);
  serverList = []
  if(req.body.server == "active"){
    (async () => {
        console.log("Collecting data...")
        const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox',`--ignore-certificate-errors`]});
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768});
        await page.goto('https://www.us-proxy.org/', {waitUntil: 'load', timeout: 0});
        await page.waitFor(8000);
        await page.focus('input[type="search"]')
        page.keyboard.type("8080") //types in search bar 8080 as the port we are trying to find
        await page.waitFor(2000);
        await page.evaluate(() => { 
          document.getElementsByClassName("ui-state-default")[6].click() //click on Https filter for no
         
        });
        await page.waitFor(2000);
        let serverList1 = []
        let array = await page.evaluate((serverList1) => { 
          let range = document.getElementsByClassName("table table-striped table-bordered dataTable")[0].children[1].children.length
          for(let i =0; i <range; i++){
           serverList1.push("http://" + document.getElementsByClassName("table table-striped table-bordered dataTable")[0].children[1].children[i].children[0].innerText.concat(":8080"))
          i++ 
          }
          return serverList1
       
        },serverList1)
        res.json({
          status: "Success Servers Active",
        data: serverList})
        await browser.close()
        console.log(array)
        serverList.push(array)
        console.log("found servers")
        console.log(serverList)
  
    })();
  }
  
})

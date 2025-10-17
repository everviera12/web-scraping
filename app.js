const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const port = 8080

app.use(cors())

app.get('/', (req, res) => {
    const routes = ["/load", "/extract"]
    res.status(200).send({ message: "Test this routes!", routes })
})

app.get('/load', async (req, res) => {
    const $ = cheerio.load("<h1 class='title'>Hello, world!</h1>");
    try {
        const texto = $('h1.titlee').text();
        res.status(200).send({ message: "Scrape endpoint", data: texto });
    } catch (error) {
        res.status(404).send({ message: "No data found" });
    }
});


app.get("/extract")

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

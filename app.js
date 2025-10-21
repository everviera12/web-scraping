const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8080;

/* app.use(cors()); */

app.get('/', (req, res) => {
    const html = `
        <h1>Test this route!</h1>
        <p>Click here to go to the scrape endpoint:</p>

        <div style="display: grid;">
            <a href="/load" style="text-decoration: none;">
                Go to 
                <span style="text-decoration: underline;">load</span> 
                route
            </a>

            <a href="/extract" style="text-decoration: none;">
                Go to 
                <span style="text-decoration: underline;">extract</span> 
                route
            </a>

            <a href="/extract-url" style="text-decoration: none;">
                Go to 
                <span style="text-decoration: underline;">extract</span> 
                route
            </a>
        </div>
    `;
    res.status(200).send(html);
});

app.get('/load', async (req, res) => {
    const $ = cheerio.load("<h1 class='title'>Hello, world!</h1>");
    try {
        const texto = $('h1.title').text();
        res.status(200).send({ message: "Scrape endpoint", data: texto });
    } catch (error) {
        res.status(404).send({ message: "No data found", error: error.message });
    }
});

app.get("/extract", (req, res) => {
    const $ = cheerio.load(`
        <ul>
            <li>One</li>
            <li>Two</li>
            <li class="blue sel">Three</li>
            <li class="red">Four</li>
            <li class="red">Five</li>
            <li class="red">Six</li>
        </ul>
    `);

    try {
        const data = $.extract({ red: ['.red'], blue: ['.blue'] });
        res.status(200).send({ message: "Scrape endpoint", data: data });
    } catch (error) {
        res.status(404).send({ message: "No data found", error: error.message });
    }
})

app.get("/extract-url", async (req, res) => {
    try {
        const response = await axios.get("https://news.ycombinator.com/");
        console.log(response);
        
        const html = response.data;

        const $ = cheerio.load(html);

        const titles = [];
        $('span.titleline').each((index, element) => {
            titles.push($(element).text());
        });

        const links = [];
        $('span.titleline > a').each((index, element) => {
            links.push($(element).attr('href'));
        });

        const data = titles.map((title, index) => ({ title: title, link: links[index] }));

        res.status(200).send({ message: "Hacker News Titles", data: data });

    } catch (error) {
        res.status(404).send({ message: "No data found", error: error.message });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

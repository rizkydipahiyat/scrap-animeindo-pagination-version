import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import siteConfig from "./lib/siteConfig.js";
import { URL } from "url";

const baseURL = siteConfig.scraptUrl;
const app = express();
const port = process.env.PORT || 5000;

const fetchData = async (page) => {
  try {
    const url = `${baseURL}/pages/episode-terbaru/page/${page || 1}`;
    let res = await axios.get(url);
    let $ = await cheerio.load(res.data);
    let epsTerbaru = [];
    $("#main > div.post-show > article").each((i, e) => {
      epsTerbaru.push({
        title: $(e)
          .find("div.animepost > div > a > div.data > div.titlex")
          .text(),
        image: $(e)
          .find("div.animepost > div > a > div.content-thumb > img")
          .attr("src"),
        eps: $(e)
          .find("div.animepost > div > a > div.content-thumb > div.EPS > span")
          .text(),
        type: $(e)
          .find("div.animepost > div > a > div.content-thumb > div.type")
          .text(),
      });
    });
    epsTerbaru.pop();

    return {
      status: "success",
      statusCode: 200,
      page: page || 1,
      data: epsTerbaru,
    };
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error to be caught later
  }
};

app.get("/pages/episode-terbaru/page/:page", async (req, res) => {
  try {
    const page = req.params.page; // Get the page number from the URL parameter
    const episodeTerbaru = await fetchData(page);
    res.json(episodeTerbaru);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.listen(port, () => console.log("Server is running"));

import axios from "axios";
import siteConfig from "../../lib/siteConfig.js";
import * as cheerio from "cheerio";

const baseURL = siteConfig.scraptUrl;

export const latestEps = async (page) => {
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
        slug: $(e)
          .find("div.animepost > div > a ")
          .attr("href")
          .replace(`${baseURL}`, ""),
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

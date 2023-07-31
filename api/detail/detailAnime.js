import axios from "axios";
import * as cheerio from "cheerio";
import siteConfig from "../../lib/siteConfig.js";

const baseURL = siteConfig.scraptUrl;

export const detailAnime = async (slug) => {
  try {
    const url = `${baseURL}/anime/${slug || ""}`;
    let res = await axios.get(url);
    let $ = await cheerio.load(res.data);
    let detail = $("#infoarea > div.post-body > div.bixbox");
    let datas = [];
    let episodeArray = [];
    let recommendAnime = [];

    let allEpisode = $(
      "#infoarea > div > div:nth-child(4) > div.lsteps > div > ul"
    ).html();
    let $$ = cheerio.load(allEpisode);
    $$("li").each((i, e) => {
      let epsTitle = $(e).find("div.epsleft > span.lchx > a").text();
      let urlDirect = $(e)
        .find("div.epsleft > span.lchx > a")
        .attr("href")
        .replace(`${baseURL}`, "");
      let uploadDate = $(e).find("span.date").text();
      episodeArray.push({
        title: epsTitle,
        url: urlDirect,
        uploadDate: uploadDate,
      });
    });

    let allRecommendAnime = $(
      "#infoarea > div > div.whites.recanim.widget_senction"
    ).html();
    let $$$ = cheerio.load(allRecommendAnime);
    $$$("div.relat > div.animepost > div.animposx").each((i, e) => {
      let title = $(e).find("a > div.data > div.titlex").text();
      let slug = $(e).find("a").attr("href").replace(`${baseURL}`, "");
      let image = $(e).find("a > div.content-thumb > img").attr("src");
      recommendAnime.push({
        title: title,
        slug: slug,
        image: image,
      });
    });

    detail.each((i, e) => {
      datas.push({
        banner: $(e).find("div.bigcover > div > img").attr("src"),
        image: $(e)
          .find("div.bigcontent > div.thumbook > div > img")
          .attr("src"),
        title: $(e).find("div.bigcontent > div.infox > h1").text(),
        title_ml: $(e).find("div.bigcontent > div.infox > h2").text(),
        status: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span:nth-child(1)"
          )
          .text(),
        released: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span.split"
          )
          .text(),
        duration: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span:nth-child(3)"
          )
          .text(),
        season: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span:nth-child(4)"
          )
          .text(),
        type: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span:nth-child(5)"
          )
          .text(),
        episodes: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.spe > span:nth-child(6)"
          )
          .text(),
        genres: $(e)
          .find(
            "div.bigcontent > div.infox > div > div.info-content > div.genxed > a"
          )
          .text()
          .split(/(?=[A-Z])/),
        episode: episodeArray,
        recommendAnime: recommendAnime,
      });
    });

    datas.pop();

    return {
      status: "success",
      statusCode: 200,
      slug: slug || "",
      data: datas,
    };
  } catch (error) {
    console.log(error);
  }
};

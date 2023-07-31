import axios from "axios";
import siteConfig from "../../lib/siteConfig.js";
import * as cheerio from "cheerio";

const baseURL = siteConfig.scraptUrl;

export const watchEps = async (slug) => {
  try {
    const url = `${baseURL}/nonton/${slug || ""}`;
    let res = await axios.get(url);
    let $ = await cheerio.load(res.data);
    let datas = [];

    // let linkUrl = videoSource[0].videoUrl;
    $("article").each((i, e) => {
      let previous = $(e)
        .find("div.naveps > div.nvs.rght > a")
        .attr("href")
        .replace(`${baseURL}`, "");
      let regex = /episode-(\d+)(?:-tamat)?-subtitle-indonesia/;
      let prevUrl = previous.replace(regex, (match, episodeNumber) => {
        let newEpisodeNumber = parseInt(episodeNumber, 10) - 1;
        return (
          "episode-" +
          newEpisodeNumber.toString().padStart(2, "0") +
          "-subtitle-indonesia"
        );
      });

      datas.push({
        title: $(e)
          .find("div.player-area > header.entry-header > h1.entry-title")
          .text(),
        embedUrl: $(e).find("#player_embed > iframe.playeriframe").attr("src"),
        views: $(e)
          .find(
            "div.player-area > div.plarea > div.video-nav > div.itemright > div.views"
          )
          .text(),
        prev: prevUrl,
        detail: $(e)
          .find("div.naveps > div.nvs.nvsc > a")
          .attr("href")
          .replace(`${baseURL}`, ""),
        next: $(e)
          .find("div.naveps > div.nvs.rght > a")
          .attr("href")
          .replace(`${baseURL}`, ""),
      });
    });

    return {
      status: "success",
      statusCode: 200,
      slug: slug,
      data: datas,
    };
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error to be caught later
  }
};

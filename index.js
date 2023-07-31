import express from "express";
import { detailAnime } from "./api/detail/detailAnime.js";
import { latestEps } from "./api/latestEps/latestEps.js";
import { watchEps } from "./api/watch/watch.js";

const app = express();
const port = process.env.PORT || 5000;

// GET Watch Anime
// Example => https://example.com/nonton/{slug}
app.get("/nonton/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const watchAnime = await watchEps(slug);
    res.json(watchAnime);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

// GET Anime Detail
// Example => https://example.com/anime/{slug}
app.get("/anime/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const animeDetail = await detailAnime(slug);
    res.json(animeDetail);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

// GET Latest Anime
// Example => https://example.com/pages/episode-terbaru/page/1
app.get("/pages/episode-terbaru/page/:page", async (req, res) => {
  try {
    const page = req.params.page; // Get the page number from the URL parameter
    const episodeTerbaru = await latestEps(page);
    res.json(episodeTerbaru);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

app.listen(port, () => console.log("Server is running"));

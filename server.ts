import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB

const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

//GET requests
app.get("/recommendations", async (req, res) => {
  try {
    const dbres = await client.query(
      "select * from recommendations order by time desc"
    );
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

app.get("/tags", async (req, res) => {
  try {
    const dbres = await client.query("select * from tags");
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const dbres = await client.query("select * from comments");
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

app.get("/stages", async (req, res) => {
  try {
    const dbres = await client.query("select * from stages");
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

app.get("/users", async (req, res) => {
  try {
    const dbres = await client.query("select * from users");
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

app.get("/study_list/:user_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "select * from study_list where user_id = $1",
      [req.params.user_id]
    );
    res.status(200).json({ status: "success", data: dbres.rows });
  } catch (err) {
    res.status(404).json({ status: "failed", error: err });
  }
});

//POST requests
app.post("/recommendations", async (req, res) => {
  const {
    title,
    author,
    url,
    description,
    content,
    recommended_description,
    recommended,
    stage_id,
    user_id,
  } = req.body;
  try {
    const dbres = await client.query(
      `insert into recommendations (  title,
    author,
    url,
    description,
    content,
    recommended_description,
    recommended,
    stage_id,
    user_id) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        title,
        author,
        url,
        description,
        content,
        recommended_description,
        recommended,
        stage_id,
        user_id,
      ]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.post("/users", async (req, res) => {
  const { name, is_faculty } = req.body;
  try {
    const dbres = await client.query(
      "insert into users(name, is_faculty) values ($1, $2)",
      [name, is_faculty]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.post("/comments/:recommendation_id", async (req, res) => {
  const { body, user_id } = req.body;
  try {
    const dbres = await client.query(
      "insert into comments(body, user_id, recommendation_id) values ($1, $2, $3) ",
      [body, user_id, req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.post("/tags/:recommendation_id", async (req, res) => {
  const { name } = req.body;
  try {
    const dbres = await client.query(
      "insert into tags(name, recommendation_id) values ($1, $2) ",
      [name, req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.post("/study_list/:user_id/:recommendation_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "insert into study_list(user_id, recommendation_id) values ($1, $2) ",
      [req.params.user_id, req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

// Delete requests
app.delete("/study_list/:user_id/:recommendation_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "delete from study_list where user_id = $1 and recommendation_id = $2",
      [req.params.user_id, req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.delete("/recommendations/:recommendation_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "delete from recommendations where recommendation_id = $1",
      [req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

//Put request
app.put("/dislike/:recommendation_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "update recommendations set dislikes = dislikes + 1 where recommendation_id = $1",
      [req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

app.put("/like/:recommendation_id", async (req, res) => {
  try {
    const dbres = await client.query(
      "update recommendations set likes = likes + 1 where recommendation_id = $1",
      [req.params.recommendation_id]
    );
    res.status(201).json({
      status: "success",
      data: dbres.rows[0],
    });
  } catch (err) {
    res.status(400).json({ status: "failed", error: err });
  }
});

//Start the server on the given port
let port = process.env.PORT;
if (!port) {
  port = "4000";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123456",
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];


app.get("/", async (req, res) => {
  try {
    const result = await db.query('select * from items order by id ASC');
    items = result.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query('insert into items (title) values ($1)', [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  try {
    await db.query('Update items set title = $2 where id = $1', [id, title]);
    res.redirect('/');
  } catch (error) {
    console.error("Lol", error);
  }
});

app.post("/delete", async (req, res) => { 
  const id  = req.body.deleteItemId;
  try {
    await db.query('delete from items where id = $1', [id]);
    res.redirect('/');
  } catch (error) {
    console.error("Lol", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



const dotenv=require("dotenv");
const cors = require('cors');
const express = require('express');
const app = express();

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 8000;

//for mongodb connection
require("./connection");

//for cross error used that middelwers
app.use(cors());

//connect all router
app.use(require("./routers/router"));

app.listen(port,()=>{
    console.log(`connect my backend surver at ${port} port`);
})
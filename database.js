const msql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");





const db =msql.createConnection({
  host: 'localhost',
  database: 'australia_scholarchip',
  user: 'root',
  password: 'MAS$$UM',
});
const app = express();
const PORT =5000;


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))


app.listen(PORT ,()=>{
  console.log( `Server: http://localhost:${PORT}` );
  db.connect((err)=>{
    if(err) throw err;
    console.log('DATABASE Connected')
  })
});

app.use('/api/users',(req, res)=>{
  const sql_query= `select * from users`
  db.query(sql_query,(err, result)=>{
    if(err) throw err;
    res.send(result)
  })
})



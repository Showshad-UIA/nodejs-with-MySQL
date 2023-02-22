const msql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const colors = require('colors');





const db =msql.createConnection({
  host: 'localhost',
  database: 'australia_scholarship',
  user: 'root',
  password: 'raihanul2019',
});
const app = express();
const PORT =5000;

//middleware 
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))


app.listen(PORT ,()=>{
  console.log( `Server: http://localhost:${PORT}`.yellow.bold );
  db.connect((err)=>{
    if(err) throw err;
    console.log('DATABASE Connected'.red .bold)
  })
});

// for get users
app.get('/api/users',(req, res)=>{
  const email = req.query.email;
  console.log(email )
const sql_query= `select * from users WHERE user_email= ?  `
  db.query(sql_query,email ,  (err, result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//for added users
app.post('/api/users',(req, res)=>{
  const {user_name,user_email,user_pass} =req.body;
  const sqlPost=`INSERT INTO users (user_name,user_email,user_pass) VALUES(?,?,?)`
  db.query(sqlPost,[user_name,user_email,user_pass],(err, result)=>{
    if(err) {
      console.log(err)
    }
    res.status(200).send({
      status:'success',
      message:'Data saved successfully',
      data:result
    })
  })
})
// for delete users
app.delete('/api/users/:user_id',(req, res)=>{
  const {user_id}=req.params;
  const userDelete ="DELETE FROM users WHERE user_id = ? ";
  db.query(userDelete,user_id,(err, result)=>{
    if(err) {
      res.status(400).send({
        status:"Field",
        message:"Couldn't delete users form database",
        data:err.message
        
      })
    }
    else{
      res.status(200).send({
        status:'success',
        message:'Data Delete form database',
        data:result
      })
    }
  })
})

// for update users
app.patch('/api/users/:user_id',(req, res)=>{
  const {user_id}=req.params;
  const {user_name,user_email,user_pass} =req.body;
  const usersUpdate=`UPDATE users SET user_name= ? , user_email= ? , user_pass= ? WHERE user_id = ?`
  db.query(usersUpdate,[user_name,user_email,user_pass,user_id],(err,result)=>{
    if(err) {
      res.status(400).send({
        status:"Field",
        message:"Couldn't update users",
        data:err.message
        
      })
    }
    else{
      res.status(200).send({
        status:'success',
        message:'Updated data',
        data:result
      })
    }
  })
})


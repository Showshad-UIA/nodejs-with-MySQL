const msql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const colors = require("colors");

const db = msql.createConnection({
  host: "localhost",
  database: "australia_scholarchip",
  user: "root",
  password: "MAS$$UM",
});
const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`.yellow.bold);
  db.connect((err) => {
    if (err) throw err;
    console.log("DATABASE Connected".red.bold);
  });
});

// for get users
app.get("/api/users", async (req, res) => {
  const email = req.query.email;
  const sql_query = `select * from users WHERE user_email= ?  `;
  db.query(sql_query, email, (err, result) => {
    if (err) {
      res.status(400).send({
        status: "failed",
        message: "Not gets you data.",
        error: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Yes gets you data.",
        data: result,
      });
    }
  });

});

//for added users
app.post("/api/users", (req, res) => {
  const { user_name, user_email, user_pass } = req.body;
  const sqlPost = `INSERT INTO users (user_name,user_email,user_pass) VALUES(?,?,?)`;
  db.query(sqlPost, [user_name, user_email, user_pass], (err, result) => {
    if (err) {
      res.status(400).send({
        status: "Field",
        message: "Couldn't save user on database",
        data: err.message,
      });
    }
    res.status(200).send({
      status: "success",
      message: "Data saved successfully",
      data: result,
    });
  });
});
// for delete users
app.delete("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;
  const userDelete = "DELETE FROM users WHERE user_id = ? ";
  db.query(userDelete, user_id, (err, result) => {
    if (err) {
      res.status(400).send({
        status: "Field",
        message: "Couldn't delete users form database",
        data: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Data Delete form database",
        data: result,
      });
    }
  });
});

// for update users
app.patch("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { user_name, user_email, user_pass } = req.body;
  const usersUpdate = `UPDATE users SET user_name= ? , user_email= ? , user_pass= ? WHERE user_id = ?`;
  db.query(
    usersUpdate,
    [user_name, user_email, user_pass, user_id],
    (err, result) => {
      if (err) {
        res.status(400).send({
          status: "Field",
          message: "Couldn't update users",
          data: err.message,
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "Updated data",
          data: result,
        });
      }
    }
  );
});

// get consultant information
app.get("/api/consultantInfo", async (req, res) => {
  const email = req.query.email;
  const sql_query = `select * from consultant WHERE user_email= ?  `;
  // const result = await sql_query
  db.query(sql_query, email, (err, result) => {
    if (err) {
      res.status(400).send({
        status: "Field",
        message: "Could not find consultant information",
        data: err.message,
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Get consultant Information",
        data: result,
      });
    }
  });
});
app.post("/api/consultantInfo", (req, res) => {
  const { profession, summery, user_email } = req.body;
  const sqlPost = `INSERT INTO consultant (profession,summery, user_email) VALUES(?,?,?)`;
  db.query(sqlPost, [profession, summery, user_email], (err, result) => {
    if (err) {
      res.status(400).send({
        status: "Field",
        message: "Couldn't add consultant info on database",
        data: err.message,
      });
    }
    res.status(200).send({
      status: "success",
      message: "Data saved successfully",
      data: result,
    });
  });
});
// update consultant info
app.patch("/api/consultantInfo/:cons_id", async (req, res) => {
  const { cons_id } = req.params;
  const { profession, summery, user_email } = req.body;
  const consUpdate = `UPDATE consultant SET profession= ? , summery= ? , user_email= ? WHERE cons_id = ?`;
  // const result = consUpdate
  db.query(
    consUpdate,
    [profession, summery, user_email, cons_id],
    (err, result) => {
      if (err) {
        res.status(400).send({
          status: "Field",
          message: "Couldn't update consultant profile",
          data: err.message,
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "Updated data",
          data: result,
        });
      }
    }
  );
});

// user types get

app.get("/api/usersTypes",(req, res) => {
    const userTypesGet =` 
    SELECT u.user_name, 
    u.user_email, 
    utm.user_types_method
    FROM users u
    JOIN user_types ut ON u.user_id =ut.user_id
    JOIN user_types_method utm ON  utm.user_type_id = ut.user_type
    `
    db.query(userTypesGet,(err,result)=>{
      if(err){
        res.status(400).send({
          status:"Field",
          message:"Could'nt find userTypes",
          err:err.message
        })
      }
      else{
        res.status(200).send({
          status:"success", 
          message:"successfully get userTypes data",
          data:result
        })
      }
    })

})

//user types add
app.post("/api/usersTypes", (req, res) => {
  const { user_id, user_type } = req.body;
  const userTypeAdd = `INSERT INTO user_types ( user_id, user_type) VALUES(?,?)`;
  db.query(userTypeAdd, [ user_id, user_type], (err, result) => {
    if (err) {
      res.status(400).send({
        status: "Field",
        message: "Couldn't add users types on database",
        data: err.message,
      });
    }
    res.status(200).send({
      status: "success",
      message: "Data users types saved successfully",
      data: result,
    });
  });
});

app.get("/", (req, res) => {
  res.send("your server side is successful readable");
});

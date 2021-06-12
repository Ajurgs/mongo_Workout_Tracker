const path = require("path");
const express = require("express");
const logger  = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models"); 

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workouts",{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// api routes
app.get("/api/workouts", (req,res)=>{
    db.Workout.aggregate([{}])
})
app.get("/api/workouts/range", (req,res)=>{
    
})
app.post("/api/workouts", ({body},res)=>{
    db.Workout.create(body).then(data =>{
        res.json(data);
    }).catch(err =>{
        res.json(err);
    })
})
app.put("/api/workouts/:id", (req,res)=>{

})

// html routes
app.get("/stats", (req,res) =>{
    res.sendFile(path.join(__dirname,"./public/stats.html"));
})
app.get("/exercise", (req,res) =>{
    res.sendFile(path.join(__dirname,"./public/exercise.html"));
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
  
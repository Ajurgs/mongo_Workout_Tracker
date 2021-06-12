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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout",{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// api routes
app.get("/api/workouts", (req,res)=>{
    db.Workout.aggregate([
        {
            $addFields : {
                totalDuration: {
                    $sum: '$exercises.duration'
                }
            }
        }
    ]).then(data =>{
        res.json(data);
    }).catch(err =>{
        res.json(err);
    })
})
app.get("/api/workouts/range", (req,res)=>{
    db.Workout.aggregate([
        {
            $addFields:{
                totalDuration:{
                    $sum: '$exercises.duration'
                }
            }
        }
    ]).limit(7).sort({_id:-1}).then(data =>{
            res.json(data);
        }).catch(err =>{
            res.json(err);
        })
})
app.post("/api/workouts", ({body},res)=>{
    db.Workout.create(body).then(data =>{
        res.json(data);
    }).catch(err =>{
        res.json(err);
    })
})
app.put("/api/workouts/:id", (req,res)=>{
    db.Workout.findByIdAndUpdate(req.params.id,{$push:{
        exercises: req.body,
    }}).then(data =>{
        res.json(data);
    }).catch(err =>{
        res.json(err);
    })
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
  
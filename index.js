
const express = require("express")
const app = express()

const mongoose = require("mongoose");
const {faker} = require("@faker-js/faker");
const methodOverride = require("method-override");


const path = require("path")
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// public folder directri setup
app.use(express.static(path.join(__dirname, "public")))

// post request convert to put or patch or delete request
app.use(methodOverride("_method"));

//
app.use(express.urlencoded({extended:true}));

// MongoDb connection
main().then((res)=>{
    console.log("Connection successfull")
}).catch((err)=>{ console.log(err)})

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/whatsap")
}

// Faker method
function createRandomUser(){
    return {
    
       username : faker.internet.userName(),
       email : faker.internet.email(),  
       password : faker.internet.password(),
    };
  }
 


// Create Schema 
const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required : true,
    },

    email : {
        type:String,
        required :true,
    },
    password : {
        type : String,
        required : true
    }
})

// Model
const User = mongoose.model("User", userSchema);

// ********Insert single data in DB 
// const user1 = new User(
//     {
//         username:"Anuj123", 
//      email: "anuj38900@gmail.com",
//     password : "Anuj@123"
// });

// user1.save().then((res)=>{
//     console.log(res)
// }).catch(err=>{
//     console.log(err)
// })


/// ***** insert in multiple data
// for(let i=1; i<=10; i++){
//     new User(createRandomUser()).save().then(res=>{console.log(res)}).catch(err=>{console.log(err)})
    
// }




// ************Ruter Using **************
// show all data
app.get("/users",async(req, res)=>{
    let users = await User.find();
    res.render("users.ejs", {users})
})

//  New user
app.get("/users/new",(req, res)=>{
    res.render("newUser.ejs")
})

// Add new user
app.post("/users/new/add",(req, res)=>{
    let {username: newUsername, email:newEmail, password:newpassword} = req.body;
    let addNewuser = new User({username: newUsername, email:newEmail, password:newpassword})
    addNewuser.save().then(res=>{console.log(res)}).catch(err=>{console.log(err)})

    res.redirect("/users");

})


// Edit route
app.get("/users/:id/edit", async(req,res)=>{
    let {id} = req.params;
    let user = await User.findById(id);
    // res.send(user);
    res.render("edit.ejs",{user})    
});



//  Update Raute
app.put("/users/:id",async(req, res)=>{
    let {id} = req.params;
    let {username: newUsername} = req.body;
    let updatedUsername =await User.findByIdAndUpdate(id, {username : newUsername}, {runValidators:true, new:true});

    res.redirect("/users");
})

//  Delete Route
app.delete("/users/:id", async(req, res)=>{
    let {id} = req.params;
    let user = await User.findByIdAndDelete(id);
    res.redirect("/users");
})

// set server port
app.listen(8080, ()=>{
    console.log("Server start on port 8080");
})
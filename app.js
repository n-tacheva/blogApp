const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const expressSanitizer = require("express-sanitizer")
const port = process.env.PORT || 4000


mongoose.connect("mongodb://localhost/blog_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

//   App config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))

// Mongoose model config
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:{type:Date, default: Date.now}
})

let Blog = mongoose.model("Blog", blogSchema)

// ============
// Routes
// ============
app.get("/", (req, res)=>{
    res.redirect("/blogs")
})

// Index route
app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if (err) {
            console.log("ERROR")
        } else {
            res.render("index",{blogs:blogs}) 
        }
    })
})

// New route
app.get("/blogs/new",(req, res)=>{
    res.render("new")
})

// Create route
app.post("/blogs", (req,res)=>{
    Blog.create(req.body.blog, (err, newBlog)=>{
    if (err) {
    console.log("ERROR")
    res.render("new")
    } else {
    res.redirect("/blogs")
}
    })
})

// Show route
app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("show", {blog:foundBlog})
        }
    })
})

// Edit route
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog:foundBlog})
        }
    })
})

// Update route
app.put("/blogs/:id", (req,res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

// Delete route
app.delete("/blogs/:id",(req, res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if (err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
})

app.listen(port, ()=>{
    console.log(`App is running on port ${port}`)
})


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", wikiSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

/////////////Requests targeting all Articles
app.route("/articles")
.get((req, res)=>{
    Article.find({})
    .then((foundArticles)=>{
        res.send(foundArticles);
    })
    .catch((error)=>{
        console.log("Error finding the articles:", error);
    })
})

.post((req, res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save()
    .then(()=>{
        res.send("The article was successfully saved");
    })
    .catch(()=>{
        res.send("Error saving the article:", error);
    })
})

.delete((req,res)=>{
    Article.deleteMany({})
    .then(()=>{
        res.send("Successfully deleted all the articles");
    })
    .catch((error)=>{
        res.send("Error deleting the articles:", error);
    })
})
//////Requests targeting a specific article 
app.route("/articles/:articleTitle")
.get((req, res)=>{
    Article.findOne({title: req.params.articleTitle})
    .then((foundArticle)=>{
        res.send(foundArticle);
    })
    .catch((error)=>{
        res.send(error);
    })

})
.put((req, res)=>{
    Article.updateOne({title: req.params.articleTitle}, 
        {title: req.body.title, content:req.body.content},
        {overwrite: true},
        )
    .then(()=>{
        res.send("Successfully updated article.")
    })
    .catch((error)=>{
        res.send(error);
    })
})

.patch((req, res)=>{
    Article.updateOne({title: req.params.articleTitle},
    {$set: req.body}
    )
    .then(()=>{
        res.send("Successfully updated article")
    })
    .catch((error)=>{
        res.send(error)
    })
})

.delete((req, res)=>{
    Article.deleteOne({title: req.params.articleTitle}
        )
    .then(()=>{
        res.send("Successfully deleted the article")
    })
    .catch(()=>{
        res.send(error)
    })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
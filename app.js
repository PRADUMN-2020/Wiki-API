const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const ejs=require("ejs");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema={
  title:String,
  content:String
}

const Article=mongoose.model("Article",articleSchema);

////////////////////////////////////////////// REQUESTS TO ALL ARTICLES ("/articles" route) ///////////////////////////////////////////////

app.route("/articles")

.get(function(req, res)                        // returns all the articles in the articles collection.
{
 Article.find(function(err, foundArticles)
 {
   if(!err)
   {
     res.send(foundArticles);
   }
   else
   {
     res.send(err);
   }
 });
})

.post(function(req, res)    // creates a new article with the sent data in the articles collection.
{

  const newArticle= new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err)
{
  if(!err)
  {
    res.send("Successfully saved to database.");
  }
  else
  {
    res.send(err);
  }
});
})

.delete(function(req, res)        // deletes all the articles from the articles collection.
{
 Article.deleteMany(function(err)
{
if(!err)
{
  res.send("Successfully deleted all articles.");
}
else
{
  res.send(err);
}
});
});

////////////////////////////////////////////// REQUESTS TO A SPECIFIC ARTICLE (eg. "/article/Jack Bauer")///////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res)         //  returns an article on the given title(Jack Bauer).
{
   Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
     if(foundArticle)
     {
       res.send(foundArticle);
     }
     else
     {
       res.send("No article with the given name exists.");
     }
   })
})

.put(function(req, res)    // changes the values of all the properties of the given article(eg. Jack Bauer) to the values which are sent with the request and the values of the properties which are not sent are set to null.
{
  Article.replaceOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, function(err)
{
  if(!err)
  {
    res.send("Successfully updated the article.");
  }
  else
  {
    res.send(err);
  }
})
})

.patch(function(req, res)  // updates the values of only the sent properties with the request for the given article (eg. Jack Bauer)
{
  Article.updateOne({title: req.params.articleTitle},{$set: req.body}, function(err)
    {
      if(!err)
      {
        res.send("Successfully updated the selected article.");
      }
      else
      {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res)             // Deletes an article with the given title (eg. Jack Bauer)
{
  Article.deleteOne({title: req.params.articleTitle}, function(err)
{
  if(!err)
  {
    res.send("Successfully deleted the article.")
  }
  else
  {
    res.send(err);
  }
})
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});

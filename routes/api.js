/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dns = require('dns');

// mongoose.connect(process.env.DB);

const BookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
  commentcount: { type: Number, default: 0 }
});

const Book = mongoose.model("Book", BookSchema);


module.exports = function (app) {

  app.route('/api/books/')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    
      // get all books
      Book.find({}, '_id title commentcount', (err, data) => {
        if (err) { res.send(err); }
        else { res.json(data); }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    
      let newentry = new Book({
        title
      });

      newentry.save((err, data) => {
        if (err) { res.send(err) }
        else { res.send({ _id: data._id, title: data.title }) }
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, data) => {
        if (err) { res.send(err); }
        else { res.send("complete delete successful"); }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
      Book.find({ _id: bookid }, (err, data) => {
        if (err) { res.json("No book exists"); }
        else { res.json(data); }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    
      Book.findOneAndUpdate(
        { _id: bookid },
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 }
        },
        (err, data) => {
        if (err) { res.send(err); }
        else { res.json(data); }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    
      Book.deleteOne({ _id: bookid }, (err, data) => {
        if (err) { res.send("no book exists"); }
        else { res.send("delete successful"); }
      })
    });
  
};

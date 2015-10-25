/**
 * FieldController
 *
 * @description :: Server-side logic for managing Fields
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 async = require('async');

 module.exports = {

  create: function(req, res, next){
    var params = req.params.all();
    delete params.id;
    Field.create(params, function FieldCreated(err, field){
      if(err){
        console.log(err);
        return res.status(406).end();         
      }
      else{
        return res.status(200).json(field);
      }
    });
  },

  deletePrivateField:function(req,res){
    Field.find({related_to: req.param('related_to')}).exec(function(err,fields){
      if(fields && fields.length>0){
        console.log(fields);
        console.log(req.params.all());
        var currentField = _.find(fields, function(field){return field.id == req.param('id')})
        if(currentField){
          currentField.related_to = 0;
          currentField.save();
          return res.status(200).end();
        }
        else
          return res.status(401).end();
      }
    });
  },

  uploadPic: function  (req, res) {
    var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    var S3_BUCKET = process.env.S3_BUCKET_NAME;
    var aws = require('aws-sdk');
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});          
    var s3 = new aws.S3();
    var uploadFile = req.file('file');
    var fs = require('fs');
    var path = require('path');
    uploadFile.upload({ dirname: '../../.tmp/public/images/fields' ,saveAs:req.body.fieldId+".jpg"} ,function(err, files){
      var url = path.join(__dirname,'../../.tmp/public/images/fields/'+req.body.fieldId+'.jpg');
      try{
        var file = fs.readFileSync(url);
      }
      catch(e){
        console.log(e);
        var file = '';
      }
      var params = {
        Bucket: S3_BUCKET,
        Key: "fields/"+req.body.fieldId+".jpg",
        Body: file,
        ACL: 'public-read'
      }; 
      s3.putObject(params, function(err,data){
        if(err){
          console.log(err);
          return res.status(400);
        }
        else res.json({status:200,file:file});
      });
      Field.update(req.body.fieldId, {picture: 'https://'+S3_BUCKET+'.s3.amazonaws.com/fields/'+req.body.fieldId+'.jpg'}, function(err){
        if(err) return res.status(400);
      });
    });
  },


  searchFields: function (req,res) {
    var lat = req.param('lat');
    var longi = req.param('long');
    var params = {};
    if(req.param('word')){
      var word = ToolsService.clean(req.param('word'));
      params = {
        or : [
        {
          cleanname: {'contains': word },
          origin:'public'}
          ,      
          {
            cleanname: {'contains': word },
            origin:'private',
            related_to:req.param('id')
          }
          ]};
        }
        else{
          params = {
            or : [
            {
              origin:'public'}
              ,
              {
                origin:'private',
                related_to:req.param('id')
              }
              ]};
            }

     // to do: improve search result via creating array that tries all the dif combination of words separated with a blank
     var results = [];
     Field.find().where(params).exec(function(err,fields){
      if(err){
        console.log(err);
        return res.status(400).end();
      } 
      if(fields.length>0){
        ToolsService.distCalc(lat, longi, fields, function(results){
          var partners = _.sortBy(_.filter(results, function(result){return result.partner}), 'distance');
          var noPartners = _.sortBy(_.filter(results, function(result){return !result.partner}), 'distance');
          results=_.first(partners.concat(noPartners),40);
          res.status(200).json(results);
        })
      }
      else
        res.status(200).end();
    });    
   },

   getAllFields: function(req,res){
    Field.find({origin: 'public'},function(err,field){
      if(err) res.status(400).end();
      else res.status(200).json(field);
    });
  },

  setPicture: function(req,res){
    Field.find().limit(4000).exec(function(err, fields){
      if(err)
        console.log(err)
      _.each(fields, function(field){

        console.log(field);

        Field.update(field.id, 
        {
            // cleanname:ToolsService.clean(field.name)+ToolsService.clean(field.city), origin:'public',createdAt:moment().format(), updatedAt:moment().format(), partner:false
            picture:"http://wefoot.herokuapp.com/images/fields/"+field.id+".jpg"
          })
        .exec(function(err){
          console.log(err);
        });
      });
    });
  },

  getFieldInfo: function(req,res){
    Field.findOne({name: req.param('name')},function(err,field){
      if(err || !field) res.status(400).end();
      else res.status(200).json(field);
    });
  },

  getStudentDiscount:function(req, res){
    Field.findOne(req.param('id')).exec(function(err,field){
      if(err) return res.status(400).end();
      return res.status(200).json(field.student_discount);
    });
  }

};


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

  uploadPic: function  (req, res) {
    if(req.method === 'GET')
      return res.json({'status':'GET not allowed'});            

    var uploadFile = req.file('file');

    uploadFile.upload({ dirname: '../../assets/images/fields' ,saveAs:req.body.fieldId+".jpg"} ,function onUploadComplete (err, file) {        
      if (err) return res.serverError(err);  
      Field.update(req.body.fieldId, {picture: 'http://62.210.115.66:9000/images/fields/'+req.body.fieldId+'.jpg'}, function(err){
        if(err) return res.status(400);
      });

      res.json({status:200,file:file});
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
        async.each(fields,function(field,callback){
          var radlat1 = Math.PI * lat/180;
          var radlat2 = Math.PI * field.lat/180;
          var radlon1 = Math.PI * longi/180;
          var radlon2 = Math.PI * field.longi/180;
          var theta = longi-field.longi;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          d = dist * 1.609344 ;
          d=parseInt(d.toFixed(1)*10)/10;
          field.distance=d;
          results.push(field);
          callback();
        }, function(err) {

              // results = _.first(_.sortBy(results, 'distance'), 15);
              var partners = _.sortBy(_.filter(results, function(result){return result.partner}), 'distance');
              var noPartners = _.sortBy(_.filter(results, function(result){return !result.partner}), 'distance');
              results=_.first(partners.concat(noPartners),40);
              res.status(200).json(results);
            });
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


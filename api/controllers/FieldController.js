/**
 * FieldController
 *
 * @description :: Server-side logic for managing Fields
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


 module.exports = {

  create: function(req, res, next){
    Field.create(req.params.all(), function FieldCreated(err, field){
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
      Field.update(req.body.fieldId, {picture: 'http://localhost:1337/images/fields/'+req.body.fieldId+'.jpg'}, function(err){
        if(err) return res.status(400);
      });

      res.json({status:200,file:file});
    });
  },

  getFields: function(req, res){
    Field.find().where({
      or : [
      {
        origin:'public'
      }
        ,  
        {
          origin:'private',
          related_to:req.param('id')
        }
        ]}).limit(10).exec(function(err,tabfield){
  // },

  search: function (req,res) {

    var word = ToolsService.clean(req.param('word')); // to do: improve search result via creating array that tries all the dif combination of words separated with a blank
    Field.find().where({
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
        ]}).limit(10).exec(function(err,tabfield){

          if(err){
            console.log(err);
            return res.status(400).end();
          } 
          res.status(200).json(tabfield);
        });     
      }



    };


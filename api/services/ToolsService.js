var moment = require('moment');

module.exports = {

  clean: function(s) {

    var r=s.toLowerCase();
    r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/æ/g),"ae");
    r = r.replace(new RegExp(/ç/g),"c");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/œ/g),"oe");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    r = r.replace(new RegExp(/[ýÿ]/g),"y");
    r = r.replace(new RegExp(/\W/g),"");
    return r;

  },

  fieldarrange:function(){
    Field.find().limit(4000).exec(function(err, fields){
      if(err)
        console.log(err)
      _.each(fields, function(field){
        Field.update(field.id, {cleanname:ToolsService.clean(field.name)+ToolsService.clean(field.city), origin:'public',createdAt:moment().format(), updatedAt:moment().format(), partner:false})
        .exec(function(err){
            console.log(err);
        });
      });
    });
  
}
};
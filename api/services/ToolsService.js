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

        console.log(field);

        Field.update(field.id, {cleanname:ToolsService.clean(field.name)+ToolsService.clean(field.city), origin:'public',createdAt:moment().format(), updatedAt:moment().format(), partner:false})
        .exec(function(err){
          console.log(err);
        });
      });
    });

  },
  distCalc:function(lat, longi, fields, callback){
    var results = [];
      async.each(fields,function(field,cb){
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
        cb();
      }, function(err) {
        callback(results);
      });
    }
};

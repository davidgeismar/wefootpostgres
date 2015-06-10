/**
 * Created by jaumard on 27/02/2015.
 */
 var async = require('async');

 module.exports.schedule = {
  //Everyday at 00:00
  "0 0 * * * *"   : function ()
  {
  	var nowMinus3 = new Date();
  	nowMinus3.setDate(nowMinus3.getDate()-3);
  	var nowMinus4 = new Date();
  	nowMinus4.setDate(nowMinus4.getDate()-4);

          // On sélectionne les gagnants des foots qui ont plus de 3 jours et qui ne sont terminés  		
          Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot group by v.chevre, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:0, user:result.chevre, nbVotes:result.maxVotes});
          		callback();
          	}, function(err){
          	});

          });

          Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot group by v.homme, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:1, user:result.homme, nbVotes:result.maxVotes});
          		callback();
          	}, function(err){

          	});

          });
      },
      
      //Everyday at 2:30AM
      "30 2 * * *"   : function ()
      {
      	var nowMinus3 = new Date();
      	nowMinus3.setDate(nowMinus3.getDate()-3);
      	var nowMinus4 = new Date();
      	nowMinus4.setDate(nowMinus4.getDate()-4);

          // On sélectionne les gagnants des foots qui ont plus de 3 jours et qui ne sont terminés  		
          Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot group by v.chevre, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:0, user:result.chevre, nbVotes:result.maxVotes});
          		callback();
          	}, function(err){
          	});

          });

          Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot group by v.homme, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:1, user:result.homme, nbVotes:result.maxVotes});
          		callback();
          	}, function(err){

          	});

          });
      },




  };

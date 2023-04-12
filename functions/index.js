const functions = require('firebase-functions');
const express = require('express');
const firebase = require('firebase-admin');
const engines = require('consolidate');
const fetch = require("node-fetch");
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
 
const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);


const app = express();
app.engine('hbs',engines.handlebars);
app.set('views','./views')
app.set('views engine','hbs');
app.get('/getRecipes',(request, response) =>{
    response.set('cache-Control' ,'public, max-age=300, s-maxage=600');
    var  url = 'https://yummly2.p.rapidapi.com/feeds/search?';
    var maxEnergy = request.query.maxEnergy;
    var maxFat = request.query.maxFat;
    var protine = request.query.protine;
    var CHOLEMax = request.query.CHOLEMax;
    var query = request.query.query;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET",
        "data": { 
                q: query,
                ENERC_KCALMax : maxEnergy,
                PROCNTMax : protine,
                CHOLEMax : CHOLEMax,
                FAT_KCALMax : maxFat,
               // allowedAttribute :  allergy + ','+diet+','+course
                },
        "headers": {
             "x-rapidapi-host": "yummly2.p.rapidapi.com",
             "x-rapidapi-key": "070f3490fcmsh6f471c6c908fa9cp17a6edjsn28783cce080b"
        }
    }
    
    fetch(settings).then(resp => {
        res.render('index', {
            title: 'Page Title'
          });
        response.send(resp)
       console.log(resp);
       $( "#main").empty();   
       var search = resp
       console.log(search.toString());
       var dishs = search.feed;
       for( var i =0; i<dishs.length; i++){
           var dish = dishs[i];
           var name = dish.display.displayName;
           var videoSrc = dish.content.videos.originalVideoUrl;
           var imagSrc = dish.content.videos.snapshotUrl;
           var steps = dish.content.preparationSteps;
           var ingredients = dish.content.ingredientLines;
           var technic = dish.content.tags.technique;
           var source = dish.content.details.attribution.html;
           var reviews = dish.content.reviews;
           var rating = dish.content.details.rating;
           var tags = dish.content.tags;
           var servs = dish.content.details.numberOfServings
           var cooktime = dish.content.details.totalTime;
           var desc = dish.content.description.text;
           var linkMeta = dish.seo.web["link-tags"]
           var nutsDish = dish.content.nutrition.nutritionEstimates;
           var parsedNut = [];
           var totalEnergy;
           for(var j=0; j<nutsDish.length; j++){
               var nut = nutsDish[j];
               var nutName = nut.attribute;
               if(nutName == 'K'){nutName = 'Potassium';}
               if(nutName == 'NA'){nutName = 'Sodium';}
               if(nutName == 'CHOLE'){nutName = 'Cholesterol';}
               if(nutName == 'FATRN'){nutName = 'Fatty acids,total trans';}
               if(nutName == 'FASAT'){nutName = 'Fatty acids,total saturated';}
               if(nutName == 'CHOCDF'){nutName = 'Carbohydrate, by difference';}
               if(nutName == 'FIBTG'){nutName = 'Fiber,total dietary';}
               if(nutName == 'PROCNT'){nutName = 'Protein';}
               if(nutName == 'VITC'){nutName = 'Vitamin C';}
               if(nutName == 'CA'){nutName = 'Calcium';}
               if(nutName == 'FE'){nutName = 'Iron';}
               if(nutName == 'SUGAR'){nutName = 'Sugars';}
               if(nutName == 'ENERC_KCAL'){nutName = 'Energy';totalEnergy=nut.display.value;}
               if(nutName == 'FAT'){nutName = 'Total lipid (fat)';}
               if(nutName == 'VITA_IU'){nutName = 'Vitamin A';}
               var nutValue = nut.display.value + nut.unit.name;
               var finalNut =  {
                   attribute : nutName,
                   value     : nutValue
                   }
                    parsedNut.push(finalNut);
               }
           var recipe = document.createElement("div");
           recipe.className = "w3-card-4";
           recipe.style.width = "100%";
           var stepTag ='<h4>Cooking Steps : </h4>';
           for(var k=0;k<steps.length;k++){
               var step = steps[k];
               stepTag += '<li class="steps">Step '+ k +' : ' + step + '</li>';
           }
           var likebtn =  '<div class="heart" style="display: none; id="'+name.split(' ').join('_')+ '">Add to favorite</div>';
           var imgTag = '<img src="'+imagSrc+'" alt="Avatar" class="w3-left w3-margin-right" style=" border-radius: 10px; width:334px"></img>'
           var videoTag = '<video width="320" height="240" controls><source src="'+videoSrc +'" type="video/mp4"><source src="movie.ogg" type="video/ogg">Your browser does not support the video tag.</video>'
           var head = '<header> <h3>'+name+'</h3> </header>'
           var nuteTable = '<div class="test" style="width: fit-content;display: inline-table;margin: 20px;min-height: 700px; border-radius: 13px;"><table id="example'+i+'" class="display" style="width="100%";min-height: 700px;"><thead style="background: #3a7ab7;"><tr><th>Nutrients</th><th>Value</th></tr> </thead></table></div>'
           var ingTable = '<div class="test" style="width: fit-content;display: inline-table;margin: 20px;min-height: 700px;border-radius: 13px;"><table id="ingTable'+i+'" class="display" style="width="100%;min-height: 700px;"><thead style="background: #3a7ab7;"><tr><th>INGREDUENTS</th></tr> </thead></table></div>'
           var innerDiv = '<div class="w3-container w3-card-4"><hr>'+imgTag+head+likebtn+'<p>Rating : '+rating +'<span class="star"> &#11088;</span> out of 5 <p>Cook time: <span class="glyphicon glyphicon-time"></span> '+cooktime+'</p><p>Serves: <span class="glyphicon">&#xe008;</span> '+servs+'</p><p>Calories(KCal): <i style="color:red;" class="fas">&#xf7e4;</i> '+totalEnergy+'</p><p>'+desc +'</p></p><br></div>'
           innerDiv += '<div class="collapse" id="examplec'+i+'"><div class="card card-body" style="display: inline-table;">'+nuteTable+ingTable+'<div style="width: fit-content;display: inline-table;margin: 20px;border-radius: 13px;">'+stepTag+source+'</div>'+'</div>';
           recipe.innerHTML += innerDiv;
           recipe.innerHTML += '<button style="width: 100px;" id="'+name.replace(/['"]+/g, '')+'" class="show btn btn-primary" type="button" data-toggle="collapse" data-target="#examplec'+i+'" aria-expanded="false" aria-controls="collapseExample">+ Show more</button>'
           $( "#main").append(recipe);
          var id = name.replace(/['"]+/g, '')
          $("#"+id).click(function (){
              var elem = document.getElementById(name.replace(/['"]+/g, ''));
              if (elem.textContent=="+ Show more"){
               elem.textContent = "- Show less";
              }else{
               elem.textContent = "+ Show more";
              }
          })
         
          document.getElementById('example'+i+'').DataTable( {
               data: parsedNut,
               "searching": true,
               "paging" : false,
               columns: [
                   { data: 'attribute' },
                   { data: 'value' }
               ]
           } );
           document.getElementById('example'+i+'').DataTable( {
               data: ingredients,
               "paging" : false,
               "searching": true,
               columns: [
                   { data: 'wholeLine' }
               ]
           } );
           
       }
      
       response.send(resp)
    })
   .catch(err => {
       response.send(err)
	 
    }); 
    
    //response.send('Hi there')

    //response.render('index',{ recipes });
});

exports.app = functions.https.onRequest(app);


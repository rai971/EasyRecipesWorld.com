
$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyB4DCjCX4oVCCa_ZU3FRNNM-NHV1oj0VlE",
        authDomain: "clever-courier-275508.firebaseapp.com",
        databaseURL: "https://clever-courier-275508.firebaseio.com",
        projectId: "clever-courier-275508",
        storageBucket: "clever-courier-275508.appspot.com",
        messagingSenderId: "934390634278",
        appId: "1:934390634278:web:5501d2214bfb84227c13e7",
        measurementId: "G-22WR746WFB"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
	  firebase.analytics();
    var finalNut;
    var name;
    var pic;
    var sour;
    var dishi; 
    var searchUrl = 'https://yummly2.p.rapidapi.com/feeds/search?q=onion';
    var AllowedAllergyUrl =  'https://yummly2.p.rapidapi.com/metadata/allergy?';
    $(document).ajaxStart(function() {
        load();
    });
    
    $(document).ajaxStop(function() {
         removeLoader();
    });	 
    function addScript( src ) {
        var s = document.createElement( 'script' );
        s.setAttribute( 'src', src );
        document.body.appendChild( s );
      }

    var settingsList = {
        "async": true,
        "crossDomain": true,
        "url": "https://yummly2.p.rapidapi.com/tags/list",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "yummly2.p.rapidapi.com",
            "x-rapidapi-key": "070f3490fcmsh6f471c6c908fa9cp17a6edjsn28783cce080b"
        }
    }
    

    $.ajax(settingsList).done(function (response) {
        console.log(response);
        var diet =response["en-US"]["user-diet"];
        var dropdown = $("#diet");
            $(diet).each(function () {
                var option = $("<option />");
                //Set Category Name in Text part.
                option.html(this.description);
                //Set Category CustomerId in Value part.
                option.val(this.id);
                //Add the Option element to DropDownList.
                dropdown.append(option);

            });
        var course = response["en-US"].course;    
        var dropdown1 = $("#course");
            $(course).each(function () {
                var option = $("<option />");
                //Set Category Name in Text part.
                option.html(this.name);
                //Set Category CustomerId in Value part.
                option.val(this.id);
                //Add the Option element to DropDownList.
                dropdown1.append(option);

            });
        var allergy = response["en-US"]["user-allergy"];    
        var dropdown2 = $("#allergy");
            $(allergy).each(function () {
                var option = $("<option />");
                //Set Category Name in Text part.
                option.html(this.description);
                //Set Category CustomerId in Value part.
                option.val(this.id);
                //Add the Option element to DropDownList.
                dropdown2.append(option);

            });
        var technique = response["en-US"].technique;    
        var dropdown3 = $("#category");
            $(technique).each(function () {
                var option = $("<option />");
                //Set Category Name in Text part.
                option.html(this.name);
                //Set Category CustomerId in Value part.
                option.val(this.id);
                //Add the Option element to DropDownList.
                dropdown3.append(option);

            });    
            //addScript('js/extention/choices.js');
    });
   
    
    $('#submit').click(function(event){
        load();
        event.preventDefault();
        var category = $('#category').find("option:selected").val();
        var allergy = $('#allergy').find("option:selected").val();
        var course = $('#course').find("option:selected").val();
        var diet = $('#diet').find("option:selected").val();
        var maxEnergy = document.getElementById("energy").value;
        var maxFat = document.getElementById("fatty").value;
        var protine = document.getElementById('PROCNT').value;
        var CHOLEMax = document.getElementById('CHOLE').value;
        var query = document.getElementById("search").value;
        var carbsMax = document.getElementById('CHOLE').value;
        var fiberMAx = document.getElementById("search").value;
        url = 'https://yummly2.p.rapidapi.com/feeds/search?';	
        
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

    $.ajax(settings).done(function (response) {
        $( "#main").empty();   
        var search = response
        console.log(search.toString());
        var dishs = search.feed;
        for( var i =0; i<dishs.length; i++){
            var dish = dishs[i];
            var name = dish.display.displayName;
          //  var videoSrc = dish.content.videos.originalVideoUrl;
            var imagSrc = dish.display.images;
            var steps = dish.content.preparationSteps;
            var ingredients = dish.content.ingredientLines;
            var technic = dish.content.tags.technique;
            var source = dish.content.details.attribution.html;
            var reviews = dish.content.reviews;
            var rating = dish.content.details.rating;
            var tags = dish.content.tags;
            var servs = dish.content.details.numberOfServings
            var cooktime = dish.content.details.totalTime;
            if(dish.content.description != null){
                var desc = dish.content.description.text;
            }else{
                var desc = "";
            }
            
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
            if(steps != null){
                for(var k=0;k<steps.length;k++){
                    var step = steps[k];
                    stepTag += '<li class="steps">Step '+ k +' : ' + step + '</li>';
                }
            }
           
          //  var likebtn =  '<div class="heart" style="display: none; id="' + name.trim().replace(/['"]+/g, '') + '">Add to favorite</div>';
            var imgTag = '<img src="'+imagSrc+'" alt="Avatar" class="w3-left w3-margin-right" style=" border-radius: 10px; width:334px"></img>'
          //  var videoTag = '<video width="320" height="240" controls><source src="'+videoSrc +'" type="video/mp4"><source src="movie.ogg" type="video/ogg">Your browser does not support the video tag.</video>'
            var head = '<header> <h2>'+name+' Recipe </h2> </header>'
            var nuteTable = '<div class="test" style="width: fit-content;display: inline-table;margin: 20px;min-height: 700px; border-radius: 13px;"><table id="example'+i+'" class="display" style="width="100%";min-height: 700px;"><thead style="background: #3a7ab7;"><tr><th>Nutrients</th><th>Value</th></tr> </thead></table></div>'
            var ingTable = '<div class="test" style="width: fit-content;display: inline-table;margin: 20px;min-height: 700px;border-radius: 13px;"><table id="ingTable'+i+'" class="display" style="width="100%;min-height: 700px;"><thead style="background: #3a7ab7;"><tr><th><h2>RECIPE INGREDUENTS<h2></th></tr> </thead></table></div>'
            var innerDiv = '<div class="w3-container w3-card-4"><hr>'+imgTag+head+'<p>Rating : '+rating +'<span class="star"> &#11088;</span> out of 5 <p>Cook time: <span class="glyphicon glyphicon-time"></span> '+cooktime+'</p><p>Serves: <span class="glyphicon">&#xe008;</span> '+servs+'</p><p>Calories(KCal): <i style="color:red;" class="fas">&#xf7e4;</i> '+totalEnergy+'</p><p>'+desc +'</p></p><br></div>'
            innerDiv += '<div class="collapse" id="examplec'+i+'"><div class="card card-body" style="display: inline-table;">'+nuteTable+ingTable+'<div style="width: fit-content;display: inline-table;margin: 20px;border-radius: 13px;">'+stepTag+source+'</div>'+'</div>';
           ///innerDiv += '<button style="width: 100%;" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#examplec'+i+'" aria-expanded="false" aria-controls="collapseExample">+ Show more</button>'
           // recipe.innerHTML += '<div class="collapse" id="examplec'+i+'"><div class="card card-body">'+nuteTable+ingTable+'</div>';
            recipe.innerHTML += innerDiv;
            recipe.innerHTML += '<button style="width: 100px;" id="'+name.replace(/['"]+/g, '').replace("\"","")+'" class="show btn btn-primary" type="button" data-toggle="collapse" data-target="#examplec'+i+'" aria-expanded="false" aria-controls="collapseExample">+ Show more</button>'
       //     $( "#main").empty();
            $( "#main").append(recipe);
        //    var id = name.replace(/['"]+/g, '').replace("\"","");
        //    $("#"+id).click(function (){
        //        var elem = document.getElementById(name.replace(/['"]+/g, '').replace("\"",""));
        //        if (elem.textContent=="+ Show more"){
        //         elem.textContent = "- Show less";
        //        }else{
        //         elem.textContent = "+ Show more";
        //        }
        //    })
      //     document.getElementById(i).addEventListener("click",change());
           $('#example'+i+'').DataTable( {
                data: parsedNut,
                "searching": true,
                "paging" : false,
                columns: [
                    { data: 'attribute' },
                    { data: 'value' }
                ]
            } );
            $('#ingTable'+i+'').DataTable( {
                data: ingredients,
                "paging" : false,
                "searching": true,
                columns: [
                    { data: 'wholeLine' }
                ]
            } );
            
        }
       
    });
});
var availableTags;


$('#search').autocomplete({
    minLength: 3,
    source:function ( request, response) {
        removeLoader();
        var query = document.getElementById("search").value
        var settings1 = {
            "async": true,
            "crossDomain": true,
            "url": "https://yummly2.p.rapidapi.com/feeds/auto-complete?",
            "method": "GET",
            "headers": {
                 "x-rapidapi-host": "yummly2.p.rapidapi.com",
		"x-rapidapi-key": "070f3490fcmsh6f471c6c908fa9cp17a6edjsn28783cce080b"
            },
            "data":{
                q : query
            }
        }
        $.ajax(settings1).done(function (data) {
            removeLoader();
            response(data.searches);
        });
      //return availableTags;
    }
});



// $( "#search" ).autocomplete({
//     source: availableTags
//   });
//$("#submit").click();   
});
    
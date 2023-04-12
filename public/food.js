$( document ).ready(function() {
	var dishes;
	var dish ;
	var url;
	var fave =[];
	var userEmail;
	var uid;
	var displayName;
    var emailVerified;
    var photoURL;
    var isAnonymous;
    var providerData;
	var favdishArray =[];
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
	  var firestore = firebase.firestore();
	  var btnLogOut = document.getElementById('logout');
	  var btnLogIn = document.getElementById('login');
	  var btnSignUp = document.getElementById('signup');
	  var updatedfave;
	  btnLogOut.addEventListener('click', e=>{
		firebase.auth().signOut();
	  });

	  firebase.auth().onAuthStateChanged(firebaseUser =>{
		if(firebaseUser){
			console.log(firebaseUser);
			userEmail = firebaseUser.email;
			uid = firebaseUser.uid;
			emailVerified = firebaseUser.emailVerified;
            photoURL = firebaseUser.photoURL;
            isAnonymous = firebaseUser.isAnonymous;
			providerData = firebaseUser.providerData;
			displayName = firebaseUser.displayName;
	        var docName1 = 'UserFavTable/' +uid;
			const docRef1 = firestore.doc(docName1);
			updatedfave = function(){
            docRef1.onSnapshot(function(doc) {
			if (doc.exists) {
				var favdishArray1 = doc.data().favs;
				for(var j=0;j<favdishArray1.length;j++){
                    favdishArray.push(favdishArray1[j].name)
				}
				console.log("fave data:", doc.data());
			} else {
				console.log("No faves!");
				   }
			});
			}	
			updatedfave();
			if(window.location.pathname == '/login/login.html'){
			  window.location.pathname = '/index.html'
			}
			btnLogOut.style.removeProperty('display');
		    btnLogIn.style.setProperty('display','none');
			btnSignUp.style.setProperty('display','none');			
		}else{
			console.log('user not logged in');
			btnLogIn.style.removeProperty('display');
			btnSignUp.style.removeProperty('display');
			btnLogOut.style.setProperty('display','none');
		}
	})
	var urlDishArea = 'https://www.themealdb.com/api/json/v1/1/filter.php?a='
	var urlAreaList ='https://www.themealdb.com/api/json/v1/1/list.php?a=list'	
	var catDishUrl ='https://www.themealdb.com/api/json/v1/1/filter.php?c=';
	var dishByIdUrl ='https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
	var catJson;
	var mealJson;
	var category = 'https://www.themealdb.com/api/json/v1/1/categories.php';
	                
	//var categories = {
		//	idCategory: 1,
			//strCategory: "Beef",
			//strCategoryDescription: "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times"
			//};

			//console.log(Object.values(categories));
		
			//var categories = '<p>' + categories.idCategory+','+categories.strCategory+ ','+categories.strCategoryDescription+'</p>';
    		//console.log('categories');
		
	$.ajax({url: category
		 , success: function(response){
			 //console.log(response);
			var categoryJson = response.categories;
		  //var dropdown = $("#area");
		     $(categoryJson).each(function () {
		         var option = $("<option />");
		         //Set Category Name in Text part.
		         option.html(this.idCategory);
		         //Set Category CustomerId in Value part.
		         option.html(this.strCategory);
		         //Add the Option element to DropDownList.
		         option.html(this.strCategoryThumb);
		         option.html(this.strCategoryDescription);
		         //dropdown.append(option);

		     });
		  }});
	$.ajax({url: urlAreaList
		 , success: function(response){
			// console.log(response);
			var areaJson = response.meals;
		  var dropdown = $("#area");

		     $(areaJson).each(function () {
		         var option = $("<option />");
		         //Set Category Name in Text part.
		         option.html(this.strArea);
		         //Set Category CustomerId in Value part.
		         option.val(this.strArea);
		         //Add the Option element to DropDownList.
		         dropdown.append(option);

		     });
		  }});
	 $('select[name="categoryArea"]').change(function(){
		 var area = $("#area").find("option:selected").text();
		 var finalArea = urlDishArea + area ;
		 $.ajax({url: finalArea
    		 , success: function(response){
    			//console.log(response);
    			var mealJson = response.meals;
    		  var dropdown = $("#areaDish");
    		  dropdown.empty();
    		     $(mealJson).each(function () {
    		         var option = $("<option />");
    		         //Set Category Name in Text part.
    		         option.html(this.strMeal);
    		         //Set Category CustomerId in Value part.
    		         option.val(this.idMeal);
    		         //Add the Option element to DropDownList.
    		         dropdown.append(option);
    		     });
    		  }});   
		    
	 });
	 
	 $('#submit2').click(function(data){
		 url = 'https://www.themealdb.com/api/json/v1/1/search.php?';	
		 var dishName = $('#areaDish').find("option:selected").text();;
		 
	$.ajax(url, {
	    data: { s: dishName },  // data to submit(Parameters)
	    success: function (data) {   //(response)
	    	//console.log(data);
	        dishes = data.meals;
	        $('.meal').remove();
	        $('.meal1').remove();
	        if(dishes == null){
	        	alert('No Dish Found!!');
			}
			
	    	for(var i=0; i < dishes.length; i++){          //Itreating on each dishes(array)
				//updatedfave();
				var d = dishes[i];
				var inghHtml ='';
				for(var j=1;j<10;j++){
					var ingkey = 'strIngredient'+j;
					var mkey = 'strMeasure'+j;
					 inghHtml += '<p class="test1">'+ d[ingkey]+ ' : ' + d[mkey] + '</p>';
				} 
				var name = d.strMeal +'Recipe'; 
					if(favdishArray.includes(name)){
						var likeBtn = '<div style="margin-left: 50%;" class="heart heart-blast" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
					}else{
						var likeBtn = '<div style="margin-left: 50%;" class="heart" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
					}
	    		var str = '<h3>'+d.strIngredient1+'</h3>'
	    		var newElement = document.createElement('div');  //Creating div element using createElement function.
				var video = '<a style="color: white;" class="btn btn-primary btn-sm" target="_blank" href="' +d.strYoutube +'"><span class=" glyphicon glyphicon-play-circle"></span>Watch recipe video on youtube</a></p>';
				var recipeDesc =  '<div class="test" id="'+d.strMeal +'"><p>'+ d.strInstructions+'</p></div>';
	    		var recipeIngHead =  '<h2>Ingredients</h2>'
	    	//	var ingredientDesc = '<div class="test1">'+ '<p>'+ d.strIngredient1+' : '+d.strMeasure1+', '+ d.strIngredient2+' : '+d.strMeasure2+', '+ d.strIngredient3+' : '+d.strMeasure3+', '+ d.strIngredient4+', '+ d.strIngredient5+', '+ d.strIngredient6+', '+ d.strIngredient7+', '+ d.strIngredient8+', '+ d.strIngredient9+', '+	d.strIngredient10+', '+d.strIngredient11+', '+d.strIngredient12+', '+d.strIngredient13+', '+d.strIngredient14+', '+d.strIngredient15+', '+d.strIngredient16+', '+d.strIngredient17+', ' 
	    		var btns2 = '<button type="button" class="btn btn-primary mb-2 filterIng" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Ingredient</button><button type="button"  class="btn btn-primary mb-2 filterHideIng"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Ingredient</button>'
	    		var btns = '<button type="button" class="btn btn-primary mb-2 filter" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Recipe</button><button type="button"  class="btn btn-primary mb-2 filterHide"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Recipe</button>'
	    		newElement.id = d.strMeal; 
	    		var nameElement = '<h2 style="border-radius: 10px; ">'+name+'</h2>'
	    		var videoUrl = d.strYoutube;
	    		var imageUrl= d.strMealThumb;
	    		var str = '/embed'
	    		var position = 23;
	    		var finalVideo = [videoUrl.slice(0, position), str, videoUrl.slice(position)].join('');
	    		//console.log(finalVideo)
	    		newElement.className = "meal1";                 //Adding class attribute to div element(tag)
				var recipeFrame = nameElement+'<div class="singleImg"><img width="450px%" height="350px" class="img" src="'+imageUrl+'" width="100%" height="700" frameborder="0" allowfullscreen></img><div>'+video+likeBtn+btns+recipeDesc
	    		+btns2+inghHtml;  //Preparing HTML for div.
				var ads = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="+3t+pr+27-co+d7" data-ad-client="ca-pub-2701547805719548" data-ad-slot="8762928131"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>'
				//document.body.appendChild(newElement);
				if(i !=0 && i%3==0){
					recipeFrame = recipeFrame + ads;
				}
				if(i == 0){
					recipeFrame = recipeFrame + ads;
				}
				newElement.innerHTML = recipeFrame;   //Adding inner HTML
				newElement.innerHTML = recipeFrame;   //Adding inner HTML
	    		//document.body.appendChild(newElement);
	    		$( ".recipe").append(newElement);
	    		$(".filter").hide();
	    		$(".filterIng").hide();
	    	    $(".filter").click(function () {
	    	    	$(this).next().next(".test").show(500);
	    	       $(".filter").next().show(500);
	    	       $(this).hide();
	    	    });

	    	    $(".filterHide").click(function () {
	    	    	$(this).next(".test").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
	    	    });
	    	    $(".filterIng").click(function () {
	    	    	$(this).next().next(".test1").show(500);
	    	       $(".filterIng").next().show(500);
	    	       $(this).hide();
	    	    });

	    	    $(".filterHideIng").click(function () {
	    	    	$(this).next(".test1").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
				});
				btnFave = document.getElementById(name.split(' ').join('_'));
				btnFave.addEventListener('click', function(e) {
					if(uid == null){
						var favDish = e.target.parentNode.parentNode.parentNode.id;
					   alert("Kindly Login to add to recipes to favorite")
					}else{
					if(favdishArray.includes(favDish)){
						alert('Already added to favorite!,Got to favorite page to remove from your fav list')
					}else{
						var imgUrl = e.target.parentNode.previousElementSibling.src;
						var videoUrl = e.target.previousElementSibling.previousElementSibling.href;
						var faveObj = {
							name: favDish,
							src: imgUrl,
							href:videoUrl
						};		
						var favDishId = favDish.split(' ').join('_');
						var docName = 'UserFavTable/' +uid;
						const docRef = firestore.doc(docName);
						docRef.get().then(function(doc) {
							if (doc.exists) {
								fave = doc.data().favs;
								fave.push(faveObj);
								console.log("Document data:", doc.data());
								docRef.set({
									favs: fave,
									name: userEmail
								 }).then(function(){		
									document.getElementById(favDishId).classList.toggle("heart-blast");		 
									console.log("Blog Submited");
									//alert("Blog Submited");
								 }).catch(function(error){
									console.log("Got an error",error);
								   alert("Got an error",error);
								})
							} else {
								fave.push(favDish);
								docRef.set({
									favs: fave,
									name: userEmail
								 }).then(function(){		
									document.getElementById(favDishId).classList.toggle("heart-blast");		 
									console.log("Blog Submited");
									//alert("Blog Submited");
								 }).catch(function(error){
									console.log("Got an error",error);
								   alert("Got an error",error);
								})
								console.log("No such document!");
							}
						}).catch(function(error) {
							console.log("Error getting document:", error);
						});
					}	
					}
					
            });  
	    	   
	    	}
			$(".filterHide").click();
	    },
	    error: function (jqXhr, textStatus, errorMessage) {
	    	alert('Failed to load recipe');
	    }
	});
	e.preventDefault();
	});
	
	
	 $.ajax({url: "https://www.themealdb.com/api/json/v1/1/categories.php"
		 , success: function(response){
			// console.log(response);
		  catJson = response.categories;
		  var dropdown = $("#category");
		     $(catJson).each(function () {
		         var option = $("<option />");
		         //Set Category Name in Text part.
		         option.html(this.strCategory);
		         //Set Category CustomerId in Value part.
		         option.val(this.idCategory);
		         //Add the Option element to DropDownList.
		         dropdown.append(option);

		     });
		  }});
	 $('select[name="category"]').change(function(){
		 var dishCat = $("#category").find("option:selected").text();
		 var finalDish = catDishUrl + dishCat;
		 $.ajax({url: finalDish
    		 , success: function(response){
    			//console.log(response);
    			mealJson = response.meals;
    		  var dropdown = $("#categoryDish");
    		  dropdown.empty();
    		     $(mealJson).each(function () {
    		         var option = $("<option />");
    		         //Set Category Name in Text part.
    		         option.html(this.strMeal);
    		         //Set Category CustomerId in Value part.
    		         option.val(this.idMeal);
    		         //Add the Option element to DropDownList.
    		         dropdown.append(option);
    		     });
    		  }});   
		    
	 });

	 
	 $("#submit1").click(function (response) {
		 var dishId = document.getElementById("categoryDish").value;
		 var finalId =  dishByIdUrl+dishId;
		 $.ajax({url: finalId
    		 , success: function(data){
    			// console.log(data);
    			 var dishes = data.meals;
    			 $('.meal').remove();
    		        $('.meal1').remove();
    		        if(dishes == null){
    		        	alert('No Dish Found!!');
    		        }
    		    	for(var i=0; i < dishes.length; i++){          //Itreating on each dishes(array)
						var d = dishes[i];
						var ingredientDesc ='';
				    for(var j=1;j<10;j++){
					    var ingkey = 'strIngredient'+j;
					    var mkey = 'strMeasure'+j;
					    ingredientDesc += '<p class="test1">'+ d[ingkey]+ ' : ' + d[mkey] + '</p>';
					} 
					var name = d.strMeal +'Recipe'; 
					if(favdishArray.includes(name)){
						var likeBtn = '<div style="margin-left: 50%;" class="heart heart-blast" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
					}else{
						var likeBtn = '<div style="margin-left: 50%;" class="heart" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
					}
    		    		var newElement = document.createElement('div');  //Creating div element using createElement function.
    		    		newElement.className = "meal1";                 //Adding class attribute to div element(tag)
						newElement.id = d.strMeal; 
						var video= '<a style="color: white;" class="btn btn-primary btn-sm" target="_blank" href="' +d.strYoutube +'"><span class=" glyphicon glyphicon-play-circle"></span>Watch recipe video on youtube</a></p>';
    		    		var recipeDesc =  '<div class="test" id="'+d.strMeal +'"><p>'+ d.strInstructions+'</p></div>';
    		    		var recipeIngHead =  '<h2>Ingredients</h2>'
    		    		var btns2 = '<button type="button" class="btn btn-primary mb-2 filterIng" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Ingredient</button><button type="button"  class="btn btn-primary mb-2 filterHideIng"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Ingredient</button>'
    		    		var btns = '<button type="button" class="btn btn-primary mb-2 filter" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Recipe</button><button type="button"  class="btn btn-primary mb-2 filterHide"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Recipe</button>'
    		    		var nameElement = '<h2 style="border-radius: 10px; ">'+name+'</h2>'
    		    		//console.log(d); //Setting id for new element
    		    		//console.log(d.strYoutube);
    		    		var videoUrl = d.strYoutube;
    		    		var imageUrl= d.strMealThumb;
    		    		var str = '/embed'
    		    		var position = 23;
    		    		var finalVideo = [videoUrl.slice(0, position), str, videoUrl.slice(position)].join('');
    		    		//console.log(finalVideo)
    		    		var recipeFrame = nameElement+'<div class="singleImg"><img width="450px%" height="350px" class="img" src="'+imageUrl+'" width="100%" height="700" frameborder="0" allowfullscreen></img><div>'+video+likeBtn+btns+recipeDesc
    		    		+btns2+ingredientDesc;  //Preparing HTML for div.
						var ads = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="+3t+pr+27-co+d7" data-ad-client="ca-pub-2701547805719548" data-ad-slot="8762928131"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>'
				//document.body.appendChild(newElement);
				if(i !=0 && i%3==0){
					recipeFrame = recipeFrame + ads;
				}
				if(i == 0){
					recipeFrame = recipeFrame + ads;
				}
				newElement.innerHTML = recipeFrame;   //Adding inner HTML
						newElement.innerHTML = recipeFrame;   //Adding inner HTML
    		    		$( ".recipe").append(newElement);
						//document.body.appendChild(newElement);
						
    		    		$(".filter").hide();
	    		        $(".filterIng").hide();
	    	            $(".filter").click(function () {
	    	    	       $(this).next().next(".test").show(500);
	    	               $(this).next().show(500);
	    	               $(this).hide();
	    	            });

	    	    $(".filterHide").click(function () {
	    	    	$(this).next(".test").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
	    	    });
	    	    $(".filterIng").click(function () {
	    	    	$(this).next().next(".test1").show(500);
	    	       $(this).next().show(500);
	    	       $(this).hide();
	    	    });

	    	    $(".filterHideIng").click(function () {
	    	    	$(this).next(".test1").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
	    	    });
				btnFave = document.getElementById(name.split(' ').join('_'));
				btnFave.addEventListener('click', function(e) {
					var favDish = e.target.parentNode.parentNode.parentNode.id;
					if(uid == null){
					   alert("Kindly Login to add to recipes to favorite")
					}else{
						if(favdishArray.includes(favDish)){
							alert('Already added to favorite!,Got to favorite page to remove from your fav list')
						}else{
							var imgUrl = e.target.parentNode.previousElementSibling.src;
							var videoUrl = e.target.previousElementSibling.previousElementSibling.href;
							var faveObj = {
								name: favDish,
								src: imgUrl,
								href:videoUrl
							};		
							var favDishId = favDish.split(' ').join('_');
							var docName = 'UserFavTable/' +uid;
							const docRef = firestore.doc(docName);
							docRef.get().then(function(doc) {
								if (doc.exists) {
									fave = doc.data().favs;
									fave.push(faveObj);
									console.log("Document data:", doc.data());
									docRef.set({
										favs: fave,
										name: userEmail
									 }).then(function(){		
										document.getElementById(favDishId).classList.toggle("heart-blast");		 
										console.log("Blog Submited");
										//alert("Blog Submited");
									 }).catch(function(error){
										console.log("Got an error",error);
									   alert("Got an error",error);
									})
								} else {
									fave.push(favDish);
									docRef.set({
										favs: fave,
										name: userEmail
									 }).then(function(){		
										document.getElementById(favDishId).classList.toggle("heart-blast");		 
										console.log("Blog Submited");
										//alert("Blog Submited");
									 }).catch(function(error){
										console.log("Got an error",error);
									   alert("Got an error",error);
									})
									console.log("No such document!");
								}
							}).catch(function(error) {
								console.log("Error getting document:", error);
							});
						}
					}
					
            });     		
    		}
    	}});
	});
		 
	$('#submit').click(function(data){
		 url = 'https://www.themealdb.com/api/json/v1/1/search.php?';	
		 var textbox = document.getElementById("dishname");
		 dish = textbox.value;
		 
	$.ajax(url, {
	    data: { s: dish },  // data to submit(Parameters)
	    success: function (data) {   //(response)
			//console.log(data);

	        dishes = data.meals;
	        $('.meal').remove();
	        $('.meal1').remove();
	        if(dishes == null){
				removeLoader();
				alert('No Dish Found,please try Somthing else!!');
			}
			        
	    	for(var i=0; i < dishes.length; i++){          //Itreating on each dishes(array)
				var d = dishes[i];
				var ingElement = document.createElement('div');
				ingElement.className = "test1"
				var ingredientDesc ='';
				for(var j=1;j<10;j++){
					var ingkey = 'strIngredient'+j;
					var mkey = 'strMeasure'+j;
					ingredientDesc += '<p>'+ d[ingkey]+ ' : ' + d[mkey] + '</p>';
				}
				var name = d.strMeal +'Recipe';
				
				if(favdishArray.includes(name)){
					var likeBtn = '<div class="heart heart-blast" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
				}else{
					var likeBtn = '<div class="heart" id="'+name.split(' ').join('_')+ '">Add to favorite</div> ';
				}
	    		var video= '<a style="color: white;" class="btn btn-primary btn-sm" target="_blank" href="' +d.strYoutube +'"><span class=" glyphicon glyphicon-play-circle"></span>Watch Video</a></p>';
	    		var newElement = document.createElement('div');  //Creating div element using createElement function.
				var recipeDesc =  '<div class="test" id="'+d.strMeal +'"><p>'+ d.strInstructions+'</p></div>';
				var svgTag = '<svg class="card__svg" viewBox="0 0 800 500"><path d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400 L 800 500 L 0 500" stroke="transparent" fill="#333"/><path class="card__line" d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400" stroke="pink" stroke-width="3" fill="transparent"/></svg>';
	    		var recipeIngHead =  '<h2>Ingredients</h2>'
	    		var btns2 = '<button type="button" class="btn btn-primary mb-2 filterIng" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Ingredient</button><button type="button"  class="btn btn-primary mb-2 filterHideIng"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Ingredient</button>'
	    		var btns = '<button type="button" class="btn btn-primary mb-2 filter" > <span class="glyphicon glyphicon-collapse-down" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Show Recipe</button><button type="button"  class="btn btn-primary mb-2 filterHide"><span class="glyphicon glyphicon-collapse-up" style="color: white;vertical-align: sub;margin: 4px;font-size: initial;"></span>Hide Recipe</button>'
				ingElement.innerHTML =  btns2+recipeIngHead+ingredientDesc;
				newElement.id = d.strMeal; 
	    		var nameElement = '<h2 style="border-radius: 10px; ">'+name+'</h2>'
	    		var videoUrl = d.strYoutube;
				var imageUrl= d.strMealThumb;
				var videoTag = '<h1>Watch video</h1><video width="320" height="240" controls><source src="'+ videoUrl + '" >Your browser does not support the video tag.</video>';
	    		newElement.className = "meal";                 //Adding class attribute to div element(tag)
	    		var recipeFrame = '<img '+'alt="'+ name+'" class="img" src="'+imageUrl+'" width="290" height="175"  frameborder="0" allowfullscreen></img>'+nameElement+video+likeBtn+btns+recipeDesc+ingElement.outerHTML;  //Preparing HTML for div.
				
				var ads = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="+3t+pr+27-co+d7" data-ad-client="ca-pub-2701547805719548" data-ad-slot="8762928131"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>'
				//document.body.appendChild(newElement);
				if(i !=0 && i%3==0){
					recipeFrame = recipeFrame + ads;
				}
				if(i == 0){
					recipeFrame = recipeFrame + ads;
				}
				newElement.innerHTML = recipeFrame;   //Adding inner HTML
				
	    		$( ".recipe").append(newElement);
	    		$(".filter").hide();
	    		$(".filterIng").hide();
	    	    $(".filter").click(function () {
	    	    	$(this).next().next(".test").show(500);
	    	       $(this).next().show(500);
	    	       $(this).hide();
	    	    });

	    	    $(".filterHide").click(function () {
	    	    	$(this).next(".test").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
	    	    });
	    	    $(".filterIng").click(function () {
	    	    	$(this).next().show();
	    	       $(this).parent().find("p").show(500);
	    	       $(this).hide();
	    	    });

	    	    $(".filterHideIng").click(function () {
	    	    	$(this).parent().find("p").hide(500);
	    	    	this.previousElementSibling.style.display = "unset";
	    	       $(this).hide();
	    	    });
				btnFave = document.getElementById(name.split(' ').join('_'));
				btnFave.addEventListener('click', function(e) {
					var favDish = e.target.parentNode.id;
					var imgUrl = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.src;
					var videoUrl = e.target.previousElementSibling.previousElementSibling.href;
					if(uid == null){
					   alert("Kindly Login to add to recipes to favorite")
					}else{
						if(favdishArray.includes(favDish)){
							alert('Already added to favorite!,Got to favorite page to remove from your fav list,Got to favorite page to remove from your fav list')
						}else{
							var faveObj = {
								name: favDish,
								src: imgUrl,
								href:videoUrl
								};	
								var favDishId = favDish.split(' ').join('_');
								var docName = 'UserFavTable/' +uid;
								const docRef = firestore.doc(docName);
								docRef.get().then(function(doc) {
									if (doc.exists) {
										fave = doc.data().favs;
										fave.push(faveObj);
										console.log("Document data:", doc.data());
										docRef.set({
											favs: fave,
											name: userEmail
										 }).then(function(){		
											document.getElementById(favDishId).classList.toggle("heart-blast");		 
											//console.log("Blog Submited");
											//alert("Blog Submited");
										 }).catch(function(error){
											console.log("Got an error",error);
										   alert("Got an error",error);
										})
									} else {
										fave.push(favDish);
										docRef.set({
											favs: fave,
											name: userEmail
										 }).then(function(){		
											document.getElementById(favDishId).classList.toggle("heart-blast");		 
											console.log("Blog Submited");
											//alert("Blog Submited");
										 }).catch(function(error){
											console.log("Got an error",error);
										   alert("Got an error",error);
										})
										console.log("No such document!");
									}
								}).catch(function(error) {
									console.log("Error getting document:", error);
								});
						}
					}		
            });        		
	    	}
	    },
	    error: function (jqXhr, textStatus, errorMessage) {
	    	alert('Failed to load recipe');
	    }
	});
	
	});
	//$("#submit").click();
	$(".filter").hide();
	$(".filterIng").hide();
	$(".filter").click(function () {
		$(this).next().next(".test").show(500);
	   $(this).next().show(500);
	   $(this).hide();
	});

	$(".filterHide").click(function () {
		$(this).next(".test").hide(500);
		this.previousElementSibling.style.display = "unset";
	   $(this).hide();
	});
	$(".filterIng").click(function () {
		$(this).next().next(".test1").show(500);
	   $(this).next().show(500);
	   $(this).hide();
	});

	$(".filterHideIng").click(function () {
		$(this).next(".test1").hide(500);
		this.previousElementSibling.style.display = "unset";
	   $(this).hide();
	});
	// $(".heart").click(function() {
	// 	$(this).toggleClass("heart-blast");
	// 	 var favDish = $(this).parent().attr('id');
	// 	 var docName = 'UserFavTable/' +uid;
	// 	  fave.push(favDish);
	// 	  var dish = fave.toString();
	// 	  const docRef = firestore.doc(docName); 
	// 	  docRef.set({
	// 			favs: dish,
	// 			name: userEmail
	// 		 }).then(function(){				 
	// 			  console.log("Blog Submited");
	// 			   alert("Blog Submited");
	// 		   }).catch(function(error){
	// 			   console.log("Got an error",error);
	// 			  alert("Got an error",error);
	// 		   })
	// });
	
	$(".filterHide").click();
	$(document).ajaxStart(function() {
		load();
	});

    $(document).ajaxStop(function() {
	     removeLoader();
	});	
});









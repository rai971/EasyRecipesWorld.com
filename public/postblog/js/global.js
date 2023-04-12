$( document ).ready(function() {
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
      const auth = firebase.auth();
      var btnLogOut = document.getElementById('logout');
      var btnSend =  document.getElementById('Send');
      var displayName;
      var email;
      var emailVerified;
      var photoURL;
      var isAnonymous;
      var uid;
      var providerData;
      var user = firebase.auth().currentUser;
      btnSend.addEventListener('click', function(){
        if(uid == null){
            alert("Kindly Login to submit your blog");
         }else{
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var content = document.getElementById('content').value;
            var title = document.getElementById('title').value;
            //conect with database
            var docName = 'submitedBlogs/' +title;
            const docRef = firestore.doc(docName); 
            docRef.set({
                name: name,
                email: email,
                content:content
            }).then(function(){
                console.log("Blog Submited");
                alert("Blog Submited");
            }).catch(function(error){
                console.log("Got an error",error);
                alert("Got an error",error);
            })
         }          
      });

      btnLogOut.addEventListener('click', e =>{
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
            btnLogOut.style.setProperty('display','none');          
          }, function(error) {
            console.error('Sign Out Error', error);
          }); 
      });

      firebase.auth().onAuthStateChanged(firebaseUser =>{
        var btnLogOut = document.getElementById('logout');
        var btnLogIn = document.getElementById('login1');
        var btnSignUp = document.getElementById('signup1');
          if(firebaseUser){
              console.log(firebaseUser);
              displayName = firebaseUser.displayName;
              email = firebaseUser.email;
              emailVerified = firebaseUser.emailVerified;
              photoURL = firebaseUser.photoURL;
              isAnonymous = firebaseUser.isAnonymous;
              uid = firebaseUser.uid;
              providerData = firebaseUser.providerData;
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
});
$(document).ajaxStart(function() {
    load();
  });

  $(document).ajaxStop(function() {
     removeLoader();
  });	

(function ($) {
    'use strict';

    /*[ File Input Config ]
        ===========================================================*/
    
    try {
    
        var file_input_container = $('.js-input-file');
    
        if (file_input_container[0]) {
    
            file_input_container.each(function () {
    
                var that = $(this);
    
                var fileInput = that.find(".input-file");
                var info = that.find(".input-file__info");
    
                fileInput.on("change", function () {
    
                    var fileName;
                    fileName = $(this).val();
    
                    if (fileName.substring(3,11) == 'fakepath') {
                        fileName = fileName.substring(12);
                    }
    
                    if(fileName == "") {
                        info.text("No file chosen");
                    } else {
                        info.text(fileName);
                    }
    
                })
    
            });
    
        }
    
    
    
    }
    catch (e) {
        console.log(e);
    }

})(jQuery);
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
      const auth = firebase.auth();
      //Getting All three button of nav bar
      var btnLogIn = document.getElementById('login');
      var btnSignUp = document.getElementById('signup');
      var btnLogOut = document.getElementById('logout');
      var displayName;
      var email;
      var emailVerified;
      var photoURL;
      var isAnonymous;
      var uid;
      var providerData;
      var user = firebase.auth().currentUser;
      var btnReset = document.getElementById('resetpass');
      btnLogIn.addEventListener('click', e=>{
        //var name = document.getElementById('name').value;
       var email = document.getElementById('email').value;
       var pass = document.getElementById('pass').value;
       const promise = auth.signInWithEmailAndPassword(email,pass);
       
       promise
       .then(user => console.log(user))
       .catch(e =>{
        btnLogOut.style.setProperty('display','none');
        alert(e.message)
        });   
      });

      btnSignUp.addEventListener('click', e=>{
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var pass = document.getElementById('pass').value;
        if(email == '' || pass ==''){
          alert('kindly Enter an Email and password of your choice to signup')
        }else{
          const promise = auth.createUserWithEmailAndPassword(email,pass);
        promise
       .then(user => alert('User created succesfuly'))
       .catch(e => alert(e.message));   
        }
          
      });
      btnLogOut.addEventListener('click', e =>{
        firebase.auth().signOut()
        .then(function() {
            console.log('Signed Out');
            if(window.location.href == 'http://www.easyrecipesworld.com/blog.html')
            btnLogOut.style.setProperty('display','none');          
          }, function(error) {
            console.error('Sign Out Error', error);
          }); 
      });
      var updateUserInfo = function(name,DisplayUrl){
        user.updateProfile({
            displayName: "Jane Q. User",
            //photoURL: "https://example.com/jane-q-user/profile.jpg"
          }).then(function() {
              alert("Profile updated Successfully!")
            // Update successful.
          }).catch(function(error) {
            alert("Failed to update profile")
            console.log('Failed to update profile:' +e);
            // An error happened.
          });
      }

      var verifyEmail = function(){
            user.sendEmailVerification().then(function() {
                alert('A link for email verification have been sent to email,Kindly verify its you by opening your eamil app');
              }).catch(function(error) {
                alert("Failed to send verification email");
              });
      }

      var l = function(newPassword){
        user.updatePassword(newPassword).then(function() {
            // Update successful.
            alert('Password Updated Successfuly!')
          }).catch(function(error) {
            alert('Failed to update the password: '+ error);
            // An error happened.
          });
      }
      
      var resetPass = function(email){
        auth.sendPasswordResetEmail(email).then(function() {
            alert('A password recovery link has been sent to your email');
          }).catch(function(error) {
            // An error happened.
            alert('Falied to send recovery email : '+error);
          });
      }
      
      btnReset.addEventListener('click', e=>{
        var email = document.getElementById('email').value;
        resetPass(email);
      });


      firebase.auth().onAuthStateChanged(firebaseUser =>{
        var btnLogOut = document.getElementById('logout');
        var btnLogIn = document.getElementById('login');
        var btnSignUp = document.getElementById('signup');
          if(firebaseUser){
              console.log(firebaseUser);
               displayName = firebaseUser.displayName;
               email = firebaseUser.email;
               emailVerified = firebaseUser.emailVerified;
               photoURL = firebaseUser.photoURL;
               isAnonymous = firebaseUser.isAnonymous;
               uid = firebaseUser.uid;
               providerData = firebaseUser.providerData;
              if(window.location.pathname == '/login/login.html'){
                window.location.pathname = '../index.html'
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


});

 $(".navbar-toggle").click(function(){
    $(".navbar-toggle")
    if ($('.navbar-toggle').attr('class') == 'collapse navbar-collapse') {
    $(".navbar-toggle").addClass("in");
    }
  })
  $(document).ajaxStart(function() {
    load();
  });

  $(document).ajaxStop(function() {
     removeLoader();
  });	
(function ($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
    
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
    
        $(window).on('click',function(){
            isClick = 0;
        });
    
        $(myCalendar).on('apply.daterangepicker',function(ev, picker){
            isClick = 0;
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
    
        });
    
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
    
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
    
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
    
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });
    
    
    } catch(er) {console.log(er);}
    /*[ Select 2 Config ]
        ===========================================================*/
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    

})(jQuery);
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDvCXFCipOcB5dXVGyDu0VXTA71_Gc14z0",
    authDomain: "beerville-70847.firebaseapp.com",
    databaseURL: "https://beerville-70847.firebaseio.com",
    projectId: "beerville-70847",
    storageBucket: "beerville-70847.appspot.com",
    messagingSenderId: "182244955437"
  };
firebase.initializeApp(config);

database = firebase.database();

// Create Array for push inside all address and name 
var addressAray = [];
var nameArray = []
// function if you want appear all breweries from your dataBase
database.ref("brewery/").on("child_added", function(childSnapshot) {    
//console.log(childSnapshot.val());
    
    var newRecord=childSnapshot.val();
    var name = newRecord.name;
    var city = newRecord.city;
    var zipCode = newRecord.zipCode;
    var address = newRecord.address;
    var key = newRecord.key;  // added GS 2/1
    var beers = childSnapshot.val().beers;// added GS 2/1
    var comments = childSnapshot.val().comments;// added GS 2/1
    console.log(comments)
     
    // concatenate
    var completeAdress = address +" "+ city+" "+ zipCode; 
    
    // push address inside my array 
    addressAray.push(completeAdress)
    nameArray.push(name)
    // make loop for each Address and name class function codeAddress from google map. 
    for (i = 0; i < addressAray.length; i++) {
        codeAddress(addressAray[i], nameArray[i]);
       console.log(nameArray[i]); 
    }
    // added GS 2/1 button and info modal Beers and comments
    $(".breweryResults").append("<div class='card brewery-card'><div class='card-body'><h5 id='nameBrewery' class='card-titleBewery'><i class='fas fa-user-circle'></i> "+name+"</h5><p id='addressBrewery' class='card-text'><i class='fas fa-map-pin'></i> "+address+"</p><span id='city' class='card-link'><i class='fas fa-city'></i> "+city+"</span><span id='zipcode' class='card-link'>ZipCode: "+zipCode+"</span> <hr><div><button type='button' class='btn btn-warning cardBtn brewInfo' data-toggle='modal' data-target='.bd-example-modal-lg"+key+"' id='"+key+"' style='font-size:16px; padding-left:4px; padding-right:4px;'>More Info</button></div> </div></div>  <!-- start of modal --> <div class='modal fade bd-example-modal-lg"+key+"' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'><div class='modal-dialog modal-lg'><div class='modal-content'>   <!-- -->   <div class='card brewery-card'><div class='card-body infoBody'><div class='infoHeader'><button type='button' class='close modalclose' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5 id='nameBrewery' class='card-titleBewery'><i class='fas fa-bookmark'></i> "+name+"</h5><p id='addressBrewery' class='card-text'><i class='fas fa-map-pin'></i> "+address+", "+city+", "+zipCode+"</span></div> <hr><div> <a class='modalLinks ourBeerLink' href='#breweryResults'>Our Craft Beer</a> || <a class='modalLinks commentsLink' href='#breweryResults'>Comments</a></div><hr> <!--beer list to be shown on modal --> <div class='beerList beerList"+key+"'> </div> <!--comments / hidden until clicked --> <div class='brewComments brewComments"+key+"'>Leave a comment! <hr><form><div class='form-group'><label for='comment'></label><textarea type='text' class='form-control commentInput commentInput"+key+"' id='commentInput"+key+"' placeholder='Your comment' style='height:80px; width:100%'></textarea></div><button id='"+key+"' type='submit' class='btn btn-warning submitComment'>Comment</button></form> <hr> Comments: </div> <!-- -->   </div></div></div>");

    //added beers to info modal GS 2/1
    if(beers!=""){
        var beerArr = Object.values(beers)

        for(i=0; i<beerArr.length; i++){
            $(".beerList"+key).append("<div><i class='fas fa-beer'></i> "+beerArr[i].beerName+". <p class='beerType'>Type: "+beerArr[i].type+"</p><p class='details'>The Details: "+beerArr[i].description+"</div><br>");
        }
    }
    //added comments to info modal GS 2/1
    if(comments!=""){
        var commentArr = Object.values(comments)
        //console.log(commentArr)
        for(i=0; i<commentArr.length; i++){
            $(".brewComments"+key).append("<div><i class='fas fa-comment-alt'></i> <span class='commentHead'>by: "+commentArr[i].name+", on "+commentArr[i].date+"</span><p class='comment'>&quot;"+commentArr[i].comment+"&quot;</p></div><br>");
        }
    }
});
// added GS 2/1 submit comment button
$(document).on("click", ".submitComment", function(event){
    event.preventDefault();
    brewId = $(this).attr('id'); 
    var comment = $(".commentInput"+brewId).val().trim();
    var date = moment().format("llll");
    console.log(date)

    var newComment = {
        comment:comment,
        name: "Guest",
        date: date,
    }
    console.log(newComment)
    var key = database.ref("brewery/"+brewId+"/comments/").push(newComment).getKey();
    database.ref("brewery/"+brewId+"/comments/"+key).update({key:key});

    $(".commentInput"+brewId).val("")
});
// added GS 2/1 switch between beers and comments
$(document).on("click", ".ourBeerLink", function(event){
    event.preventDefault();
    $(".beerList").show();
    $(".brewComments").hide()
});
$(document).on("click", ".brewInfo", function(event){
    event.preventDefault();
    $(".beerList").show();
    $(".brewComments").hide()
});
// added GS 2/1 switch between beers and comments
$(document).on("click", ".commentsLink", function(event){
    event.preventDefault();
    $(".beerList").hide();
    $(".brewComments").show()
});
// added GS 2/1 to show new comments when posting
database.ref("brewery/").on("child_changed", function(childSnapshot) { 
    var newRecord=childSnapshot.val();
    var comments = childSnapshot.val().comments;
    var key = newRecord.key;
    var commentArr = Object.values(comments)
    
    $(".brewComments"+key).append("<div><i class='fas fa-comment-alt'></i> <span class='commentHead'>by: "+commentArr[i].name+", on "+commentArr[i].date+"</span><p class='comment'>&quot;"+commentArr[i].comment+"&quot;</p></div><br>");
});

// API beer detail
$("#submitButtonTypes").on("click", function(event){
    event.preventDefault();
    beerName = $("#userInputTypes").val().trim();

    var queryURL = 'https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beers?name=' + beerName + '&key=442d82061216d902ec97f9787c20dd1b';
    $("#userInputTypes").val("");
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
        var beer = response.data[0]; 
        $("#beerResults").html("<div class='card'><div class='card-header beer-card'><img class='resultImage' src="+ beer.labels.contentAwareMedium+" alt=''><h3>"+ beer.name+"</h3></div><div class='card-body'><h5>"+beer.style.name+"</h5><p class='card-text'>"+beer.description+"</p><h1>Similar Beers</h1><div class='row' id='otherResults'></div></div></div>")
            
        // Result all Other Beer Similar
            styleId = response.data[0].styleId ;
            console.log(styleId);
            var queryURL = 'https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beers?styleId='+ styleId +'&key=442d82061216d902ec97f9787c20dd1b';
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function(response){
                console.log(response);
                var newbeer = response.data;
                // Random showing of the beer  
                var ArrayRandom = [];
                var j = 0;
                while(j < 6){
                    var ranNum = Math.floor(Math.random() * (newbeer.length));
                    if (!ArrayRandom.includes(ranNum)){
                        ArrayRandom.push(ranNum);
                        j++;
                        if (newbeer[ranNum].labels && newbeer[ranNum].name != beerName){
                            $("#otherResults").append("<div class='col-3 text-center showMe' id='"+newbeer[ranNum].name+"'><img class='resultImage' src="+ newbeer[ranNum].labels.contentAwareMedium+" alt=''><p>"+newbeer[ranNum].name+"</p></div>");
                        } 
                    }
                }
            });
    });
})

// Show the Detail of the Beer was in the list of the other Beer  
$(document).on("click",".showMe", function(){
    var otherBeer = $(this).attr("id");
    console.log(otherBeer);
    
    var queryURL = 'https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beers?name=' + otherBeer + '&key=442d82061216d902ec97f9787c20dd1b';

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
        var beer = response.data[0]; 
        if(!beer.description){
            beer.description = "Sorry We could not find description"
        }
        $("#beerResults").html("<div class='card'><div class='card-header beer-card'><img class='resultImage' src="+ beer.labels.contentAwareMedium+" alt=''><h3>"+ beer.name+"</h3></div><div class='card-body'><h5>"+beer.style.name+"</h5><p class='card-text'>"+beer.description+"</p><h1>Similar Beers</h1><div class='row' id='otherResults'></div></div></div>")

        styleId = response.data[0].styleId ;
        console.log(styleId);
        var queryURL = 'https://cors-anywhere.herokuapp.com/https://sandbox-api.brewerydb.com/v2/beers?styleId='+ styleId +'&key=442d82061216d902ec97f9787c20dd1b';
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response){
            console.log(response);
            var beer = response.data;
            var ArrayRandom = [];
            var j = 0;
            // Random showing of the beer
            while(j < 6){
                var ranNum = Math.floor(Math.random() * (beer.length));
                if (!ArrayRandom.includes(ranNum)){
                    ArrayRandom.push(ranNum);
                    j++;
                    if (beer[ranNum].labels){
                        $("#otherResults").append("<div class='col-3 text-center showMe' id='"+beer[ranNum].name+"'><img class='resultImage' src="+ beer[ranNum].labels.contentAwareMedium+" alt=''><p>"+beer[ranNum].name+"</p></div>");
                    } 
                }
            }
        });
    });
})
  
// Note: This example requires that you consent to location sharing when
    // prompted by your browser. If you see the error "The Geolocation service
    // failed.", it means you probably did not give permission for the browser to
    // locate you.
    var map, infoWindow;
    // Function to make annimation
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    function initMap() {
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 25.767, lng: -80.203},
            zoom: 11
        });
        // Search by zip code
        document.getElementById('zoom').addEventListener('click', function() {
            geocodeAddress(geocoder, map);
        });

        function geocodeAddress(geocoder, resultsMap) {
            var zip = document.getElementById('userInput').value;
            geocoder.geocode({'address': zip}, function(results, status) {
                if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                } else {
                alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Marker for current location. 
            var currentImage = 'assets/images/here.png'
            var marker = new google.maps.Marker({
                map: map,
                position: pos,
                draggable: true,
                animation: google.maps.Animation.DROP,
                icon: currentImage
            }); 
            // animation marker
            marker.addListener('click', toggleBounce);


            }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }
    // Function lat to long Make maker
    function codeAddress(strAddress, name, ) {
        geocoder.geocode( { 'address': strAddress}, function(results, status) {
        // Maker Custom 
        var image = 'assets/images/locationMarker.png'

        if (status == 'OK') {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                draggable: true,
                animation: google.maps.Animation.DROP,
                icon: image
            });
            var contentString = '<h1>'+name+'</h1>';

            var infowindow = new google.maps.InfoWindow({
            content: contentString
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
        });
  }

//more and less buttons for beer types
function readMoreLess(x) {
    var dots = document.getElementById("dots"+x);
    var moreText = document.getElementById("more"+x);
    var btnText = document.getElementById("readMore"+x);
    
    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more"; 
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less"; 
        moreText.style.display = "inline";
    }
};
    
//NYT api
$(window).on("load", function() {
    var api = "e9IuPwrMUuoQRNYHl1fspWvKAgL1En74";
    var search = "craft beer"
    console.log(search);

    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + '&api-key='+ api    ;
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        console.log(response);
        var data = response.response.docs
        var value = 3;
        

        console.log(value);

        for(i=0 ; i < value ;i++){           
            var title = response.response.docs[i].headline.main;
            var url = response.response.docs[i].web_url;
            var snippet = response.response.docs[i].snippet;
            var image = response.response.docs[i].multimedia[0].legacy.xlarge;
            $(".articles").append("<div class='card'><img class='card-img-top mvpImage' src='https://www.nytimes.com/"+image+"' alt='Card image cap'><div class='card-body'><h5><a href='"+url+"' target='_blank'><i class='fas fa-newspaper'></i> "+title+"</a></h5><p>"+snippet+"</p></div></div>")
            
        }
    });
});

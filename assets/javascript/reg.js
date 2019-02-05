// Initialize Firebase  (changed to new)
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

//Submit button on push Brewery Shop.
$("#submit").on("click", function(event){
    event.preventDefault();
    var name = $("#nameInput").val().trim();
    var address = $("#addressInput").val().trim();
    var city = $("#cityInput").val().trim();
    var zipCode = $("#zipCodeInput").val().trim();
        
    if (name==""||address==""||city==""||zipCode=="") {
        return false;
      }

    else{
    var breweries = {
        name: name,
        address: address,
        zipCode: zipCode,
        city: city
    }
    // pushing each brewery under breweries in db
    var key = database.ref("brewery/").push(breweries).getKey();
    database.ref("brewery/"+key).update({key:key});

    console.log(breweries.name);
    console.log(breweries.address);
    console.log(breweries.city);
    console.log(breweries.zipCode);
    $("#resultBrewery").html(" <div class='card border-dark'><div class='card-heading bg-dark'><h4 class='card-title text-center'>Your bewery has been registered <i class='far fa-check-circle'></i></h4></div><div class='card-body'><h5 id='nameBrewery' class='card-titleBewery'><i class='fas fa-user-circle'></i> "+breweries.name+"</h5><p id='addressBrewery' class='card-text'><i class='fas fa-map-pin'></i> "+breweries.address+"</p><span id='city' class='card-link'><i class='fas fa-city'></i> "+breweries.city+"</span><span id='zipcode' class='card-link'>ZipCode: "+breweries.zipCode+"</span></div>");

    $("#nameInput").val("")
    $("#addressInput").val("")
    $("#cityInput").val("")
    $("#zipCodeInput").val("")
    
    clearResult = setTimeout(function(){ 
        $("#resultBrewery").empty(); }, 3000);
    }
});

// display registered breweries
database.ref("brewery/").on("child_added", function(childSnapshot) {    
//console.log(childSnapshot.val());
    
    var newRecord=childSnapshot.val();
    var name = newRecord.name;
    var city = newRecord.city;
    var zipCode = newRecord.zipCode;
    var address = newRecord.address;
    var key = newRecord.key;
    var beers = childSnapshot.val().beers;

    
    $(".breweryResults").append("<div class='card brewery-card "+key+"'><div class='card-body'><h5 id='nameBrewery' class='card-titleBewery'> "+name+"</h5><p id='addressBrewery' class='card-text'>"+address+"</p><span id='city' class='card-link'>"+city+",</span><span id='zipcode' class='card-link'> "+zipCode+"</span> <br><br> <div class='beerList beerList"+key+"'><p>Beers in our Database:</p><hr> </div> <br><br> <p><button type='button' class='btn btn-warning cardBtn beerInput' data-toggle='modal' data-target='#beerModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Update Beers</button><button type='button' class='btn btn-warning cardBtn update' data-toggle='modal' data-target='#infoModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Update Info</button><button type='button' class='btn btn-outline-secondary cardBtn remove' data-toggle='modal' data-target='#removeModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Remove Brewery</button></p>  </div></div> ");

    if(beers!=""){
        var beerArr = Object.values(beers)
        console.log(beerArr)

        for(i=0; i<beerArr.length; i++){
            $(".beerList"+key).append("<div>- "+beerArr[i].beerName+", "+beerArr[i].type+"</div>")
            console.log('logged object for the ' + i + 'loop:')
            console.log( beerArr[i])
        }
    }

   /*  //modal --- called by update info button
    updateModal = $(".modals").append("<div class='modal fade' id='infoModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Update Brewery Info</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'> <form><div class='form-group'><input type='text' class='form-control' id='nameUpdate' placeholder='Brewery Name'></div><div class='form-group'><input type='text' class='form-control' id='addressUpdate' placeholder='Address'></div><div class='form-group'><input type='text' class='form-control' id='cityUpdate' placeholder='City'></div><div class='form-group'><input type='text' class='form-control' id='zipUpdate' placeholder='5 Digit Zip'></div> <button type='submit' class='btn btn-warning updateBrewery' data-dismiss='modal'>Confirm changes</button></div></div> </form> </div></div>") */

    //modal --- for confirm remove brewery
    removeModal = $(".modals").append("<div class='modal fade' id='removeModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Confirm Remove Brewery</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'>Are you sure you wouldike to remove your brewery from our Database? <br><br><p><button type='submit' class='btn btn-danger confirmRemove' data-dismiss='modal' >Remove Brewery</button></div></div> </div></div>")

});

//update info button on card  --- 
$(document).on("click", ".update", function(event){
    event.preventDefault();
     var updateId = $(this).attr('id'); 
    console.log(updateId)
    $(".updateBrewery").attr('id', updateId) // adds brewery ID in modal submit button

});

//modal update button  --- 
$(document).on("click", ".updateBrewery", function(event){
    event.preventDefault();
    var name = $("#nameUpdate").val().trim();
    var address = $("#addressUpdate").val().trim();
    var city = $("#cityUpdate").val().trim();
    var zipCode = $("#zipUpdate").val().trim();
    
    brewId = $(this).attr('id'); 
    console.log(brewId)

    //only updates each key if not empty
    if (name!=="") { 
        database.ref("brewery/"+brewId).update({name:name});
      }
    if (address!=="") {
        database.ref("brewery/"+brewId).update({address:address});
      }
    if (city!=="") {
        database.ref("brewery/"+brewId).update({city:city});
      }
    if (zipCode!=="") {
        database.ref("brewery/"+brewId).update({zipCode:zipCode});
      }

    $("#nameUpdate").val("")
    $("#addressUpdate").val("")
    $("#cityUpdate").val("")
    $("#zipUpdate").val("")
});

database.ref("brewery/").on("child_changed", function(childSnapshot) {    
    //console.log(childSnapshot.val());
    //console.log(childSnapshot.val().beers);
    
    var newRecord=childSnapshot.val();
    var name = newRecord.name;
    var city = newRecord.city;
    var zipCode = newRecord.zipCode;
    var address = newRecord.address;
    var key = newRecord.key;
    var beers = childSnapshot.val().beers;
    console.log(beers)

    

    //adding beer list before the buttons <div class='beerList beerList"+key+"'><p>Beers in our Database:</p><br> </div>
    $("."+brewId).replaceWith("<div class='card brewery-card "+key+"'><div class='card-body'><h5 id='nameBrewery' class='card-titleBewery'> "+name+"</h5><p id='addressBrewery' class='card-text'>"+address+"</p><span id='city' class='card-link'>"+city+",</span><span id='zipcode' class='card-link'> "+zipCode+"</span> <br><br> <div class='beerList beerList"+key+"'><p>Beers in our Database:</p><hr> </div>  <br><br> <p><button type='button' class='btn btn-warning cardBtn beers' data-toggle='modal' data-target='#beerModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Update Beers</button><button type='button' class='btn btn-warning cardBtn update' data-toggle='modal' data-target='#infoModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Update Info</button><button type='button' class='btn btn-outline-secondary cardBtn remove' data-toggle='modal' data-target='#removeModal' id='"+key+"' style='font-size:12px; padding-left:4px; padding-right:4px'>Remove Brewery</button></p>  </div></div> ");

    if(beers!=""){
        var beerArr = Object.values(beers)
        console.log(beerArr)
        for(i=0; i<beerArr.length; i++){
            $(".beerList"+key).append("<div>- "+beerArr[i].beerName+", "+beerArr[i].type+"</div>")
        }
    }
});

//remove button for each brewery
$(document).on("click", ".remove", function(event){
    event.preventDefault();
    brewId = $(this).attr('id'); 
    console.log(brewId)
    $(".confirmRemove").attr('id', brewId) // adds brewery ID in modal confirm remove button
});

//confirm remove button in modal
$(document).on("click", ".confirmRemove", function(event){
    event.preventDefault();
    brewId = $(this).attr('id'); 
    $("."+brewId).remove();
    console.log(brewId)
    database.ref("brewery/"+brewId).remove();
});

//update beer button on card  --- 
$(document).on("click", ".beerInput", function(event){
    event.preventDefault();
    brewId = $(this).attr('id'); 
    console.log(brewId)
    $(".updateBeer").attr('id', brewId) // adds brewery ID in modal submit button

});

//modal beer update button  --- 
$(document).on("click", ".updateBeer", function(event){
    event.preventDefault();
    var beerName1 = $("#beerName1").val().trim();
    var description1 = $("#beerDesc1").val().trim();
    var type1 = $("#beerType1").val().trim();

    var beerName2 = $("#beerName2").val().trim();
    var description2 = $("#beerDesc2").val().trim();
    var type2 = $("#beerType2").val().trim();

    var beerName3 = $("#beerName3").val().trim();
    var description3 = $("#beerDesc3").val().trim();
    var type3 = $("#beerType3").val().trim();
    
    brewId = $(this).attr('id'); 
    /* console.log(brewId)
    console.log(beerName1)
    console.log(description1)
    console.log(type1) */

    var newBeer1 = {
        beerName: beerName1,
        description: description1,
        type: type1,
    }
    var newBeer2 = {
        beerName: beerName2,
        description: description2,
        type: type2,
    }
    var newBeer3 = {
        beerName: beerName3,
        description: description3,
        type: type3,
    }
    if (beerName1!==""&&type1!=="") { 
        var key1 = database.ref("brewery/"+brewId+"/beers/").push(newBeer1).getKey();
        database.ref("brewery/"+brewId+"/beers/"+key1).update({key:key1});
    }
    if (beerName2!==""&&type2!=="") { 
        var key2 = database.ref("brewery/"+brewId+"/beers/").push(newBeer2).getKey();
        database.ref("brewery/"+brewId+"/beers/"+key2).update({key:key2});
    }
    if (beerName3!==""&&type3!=="") { 
        var key3 = database.ref("brewery/"+brewId+"/beers/").push(newBeer3).getKey();
        database.ref("brewery/"+brewId+"/beers/"+key3).update({key:key3});
    }
    
    $("#beerName1, #beerDesc1, #beerName2, #beerDesc2, #beerName3, #beerDesc3, #beerName4, #beerDesc4, #beerType1, #beerType2, #beerType3, #beerType4").val("")
});
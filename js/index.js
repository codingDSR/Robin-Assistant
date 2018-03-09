
var load_JSON;
function setup(){
  console.log(loadJSON);
  load_JSON = loadJSON;
}
angular.module('ionicApp', ['ionic'])

.run(['$rootScope', function($rootScope) {
  $rootScope.messages = [];
  $rootScope.recognizing = true;
  $rootScope.api_keys = ["AIzaSyC02URANwpMffw5rvgQRlre-XNfpDVpPYE","AIzaSyCZQYu8cBp-OlnGYHbF82TdejPCs6omvfo"];
  $rootScope.cxs = ["012900217122796657555%3Art5stxtpnzk","013966323610994812727:39ie4uvck28"];
  var rnd = Math.floor(Math.random()*2);
  $rootScope.api_key = $rootScope.api_keys[rnd];
  $rootScope.cx = $rootScope.cxs[rnd];
  $rootScope.news_api_key = "2b4cfdeb9fa44aa4bd37df551cd76fff";
  //$rootScope.pc = "http://codingflag.com/PC/index.php";
  $rootScope.pc = "http://localhost/PC/index.php";
  $rootScope.bot = new RiveScript();
  $rootScope.bot.loadFile("brain/main.rive?time="+Math.random(), function(){
    console.log("he");
    $rootScope.bot.sortReplies();
    $rootScope.pcdir = "/home/dsr/";
  }, function(){
    alert("loading error");
  });
  window.alert = function(){}
  
  // FingerprintAuth.isAvailable(function(){
  //   FingerprintAuth.encrypt({
  //     clientId: "myAppName",
  //     username: "root",
  //     password: "qwerty"
  //   }, function(result){
  //     console.log("successCallback(): " + JSON.stringify(result));
  //     if (result.withFingerprint) {
  //         alert("Successfully encrypted credentials.");
  //         alert("Encrypted credentials: " + result.token);  
  //     } else if (result.withBackup) {
  //         alert("Authenticated with backup password");
  //     }
  //   }, function(error){
  //     if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
  //         alert("FingerprintAuth Dialog Cancelled!");
  //     } else {
  //         alert("FingerprintAuth Error: " + error);
  //     }
  //   });

  // }, function(){
  //   alert("Fingerprint Error");
  // });


}])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('pda', {
      url: "/pda",
      abstract: true,
      templateUrl: "templates/pda-menu.html"
    })
    .state('pda.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('pda.functions', {
      url: "/pc",
      views: {
        'menuContent' :{
          templateUrl: "templates/pc.html",
          controller: "PCFCtrl"
        }
      }
    })
    .state('pda.checkin', {
      url: "/pc_explorer",
      views: {
        'menuContent' :{
          templateUrl: "templates/pc_explorer.html",
          controller: "PCCtrl"
        }
      }
    })
    .state('pda.pc_task_mgr', {
      url: "/pc_task_mgr",
      views: {
        'menuContent' :{
          templateUrl: "templates/pc_task_mgr.html",
          controller: "PCTaskMgrCtrl"
        }
      }
    })
    .state('pda.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
  
  $urlRouterProvider.otherwise("/pda/home");
})




.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})



.service("core",function($http,$rootScope){
  this.ajax = function(url,type,data,success_f,error_f){
    // var ajaxObj = {
    //   url: url,
    //   method: type,
    //   headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    // };
    // if(type == "POST"){
    //   ajaxObj.data = data;
    // }
    // $http(ajaxObj).success(function(response){
    //   success_f(response);
    // }).error(function(error){
    //   error_f(error);
    // });

    $.ajax({
      url: url,
      type: type,
      contentType: "application/json; charset=utf-8",
      async: true,
      dataType: "json",
      success: function(data, status, jqXHR) {
        success_f(data);
      }
    })
    .done(function() {
      //alert("success");
    })
    .fail(function() {
      //alert("error");
    })
    .always(function() {
      //alert("complete");
    });


    // load_JSON(url,function(response){
    //   console.log("Got response",response);
    //   success_f(response);
    // },"jsonp");


  };
  this.map = function(latd,lngd,find){
    var map;
    var infowindow;
    var pyrmont = {lat: latd, lng: lngd};   
    var dk = [];
    dk.push(find);
    map = new google.maps.Map(document.getElementsByClassName('map')[document.getElementsByClassName('map').length-1], {
      center: pyrmont,
      zoom: 17
    });
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: pyrmont,
      radius: 500,
      type: dk
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          place = results[i];
          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });              
        }
      }
    })
  };

  this.htmlDecode = function(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes[0].nodeValue;
  };
})

.service("bot",function($http, $rootScope, core, $ionicScrollDelegate, $injector, $sce){
  var device;
  this.reply = function(message){
    if (!device) { device = $injector.get('device'); }
    var reply = $rootScope.bot.reply("local-user", message);
    console.log("The bot says: " + reply);
    this.botWork(JSON.parse(reply),message);
    //this.sendReply(response);
  };
  this.botWork = function(data,ogmsg){
    var sendReply = this.sendReply;
    switch(data.task){
      case "noprocess":
        sendReply({
          layout: "basic",
          data: data.term
        },data.term);
        break;
      case "torch":
        sendReply({
          layout: "basic",
          data: "torch "+data.term
        },data.term);
        device.torch(data.term);
        break;
      case "remember_add":
        sendReply({
          layout: "basic",
          data: "OK, I'll remember that"
        },"OK, I'll remember that");
        device.remember("add",data.term);
        break;
      case "remember_flush":
        device.remember("flush");
        sendReply({
          layout: "basic",
          data: "OK, I won't mention again if you dont."
        },"OK, I won't mention again if you dont.");
        break;  
      case "remember_all":
        var rep = device.remember("all");
        var htm = "You didn't told me to remember anything";
        var say = htm;
        if(rep.length > 0){
          htm = "";
          say = "Here's what you told me to remember          ";
          for(var i=0;i<rep.length;i++){
            htm += `<p>[${rep[i].time}] ${rep[i].data}</p>`;
            say+= `  ${rep[i].data}  `;
          }
        }
        sendReply({
          layout: "basic",
          data: htm
        },say);
        break;  
      case "remember_search":
        var rep = device.remember("search",data.term.trim());
        console.log("rep",rep);
        if(rep == "no-match-found"){
          sendReply({
            layout: "basic",
            data: "Sorry, I don't know."
          },"Sorry, I don't know.");
        } else {
          sendReply({
            layout: "basic",
            data: `[${rep.time}] ${rep.data}`
          },rep.data);
        }
        break;    
      case "camera":
        device.camera(data.term);
        break; 
      case "instagram":
        device.openGallery();
        break;                
      case "lastSMS":
        device.sms();
        break;  
      case "whatsappmsg":
        //alert(data.msg);
        sendReply({
          layout: "basic",
          data: `whatsapp ${data.term} to ${data.msg}`
        },"");
        device.contacts(data.term,function(contacts){
          if(contacts.length == 1){
            device.sendWhatsapp(data.msg,contacts[0].phoneNumbers[0].value); 
          } else {
            sendReply({
              layout: "list",
              data: contacts
            },"Which "+data.term);
            setTimeout(function(){
              device.listen(contacts,function(name){
                for(var i=0;i<contacts.length;i++){
                  if(contacts[i].displayName == name){
                    device.sendWhatsapp(data.msg,contacts[i].phoneNumbers[0].value); 
                    return;
                  }
                }
                device.speak("Contact not found");
              });
            },1000);
          }
          //device.sendWhatsapp(data.term,contacts[0].phoneNumbers[0].value);
        });
        break; 
      case "call":
        //alert(data.msg);
        sendReply({
          layout: "basic",
          data: `call ${data.term}`
        },"");
        device.contacts(data.term,function(contacts){
          if(contacts.length == 1){
            device.phone(contacts[0].phoneNumbers[0].value); 
          } else {
            sendReply({
              layout: "list",
              data: contacts
            },"Which "+data.term);
            setTimeout(function(){
              device.listen(contacts,function(name){
                for(var i=0;i<contacts.length;i++){
                  if(contacts[i].displayName == name){
                    device.phone(contacts[i].phoneNumbers[0].value); 
                    return;
                  }
                }
                device.speak("Contact not found");
              });
            },1000);
          }
          //device.sendWhatsapp(data.term,contacts[0].phoneNumbers[0].value);
        });
        break;   
      case "wikisearch":
        var url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search="+data.term;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "card",
            data: {
              title:data[1][0],
              desc:data[2][0]
            }
          },data[2][0]);
        },function(error){

        });
        break;

      case "youtubeSearch":
        var yts = data.term;
        var url = "https://www.googleapis.com/youtube/v3/search?part=id&q="+yts+"&type=video&key=%20AIzaSyCD0ebkT8cLz2HXn6chIQY4FpZiv2FeD5Y";
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          for(var i=0;i<data.items.length;i++){
            data.items[i].id.videoId = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+data.items[i].id.videoId);
          }
          sendReply({
            layout: "youtubevideos",
            data: data
          },"Here are videos of "+yts);
        },function(error){

        });
        break;  
      case "context":
        //alert("context")
        var url = "http://codingflag.com/ai/bing.php?q="+data.context+"+"+data.term;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "basic",
            data: data.answer
          },data.answer);
        },function(error){

        });
        break;  
      case "newssearch":
        var url="";
        if(data.type=="normal"){
          url = "https://newsapi.org/v2/top-headlines?sources=google-news-in&apiKey="+$rootScope.news_api_key;
        } else if(data.type=="topic") {
          url = "https://newsapi.org/v2/everything?q="+data.term+"&sortBy=publishedAt&apiKey="+$rootScope.news_api_key;         
        }
        console.log(url);
        core.ajax(url,"GET",null,function(data){
          console.log("news",data);
          sendReply({
            layout: "swipenewscard",
            data: data
          },"here are news!");
        },function(error){

        });
        break;
      case "wordnicksearch":
        var url = "http://api.wordnik.com:80/v4/word.json/"+data.term+"/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "card",
            data: {
              title:data[0].partOfSpeech + " | " + data[0].word,
              desc:data[0].text
            }
          },data[0].text);
        },function(error){
          
        });
        break;
      case "googleimagesearch":
        var url = "https://www.googleapis.com/customsearch/v1?cx="+$rootScope.cx+"&searchType=image&num=9&key="+$rootScope.api_key+"&q="+data.term;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "grid",
            data: data.items
          },"here are some images");
        },function(error){
          
        });
        break;
      case "weatherreport":
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+data.term+"&key="+$rootScope.api_key;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          var url = "http://api.openweathermap.org/data/2.5/weather?lat="+data.results[0].geometry.location.lat+"&lon="+data.results[0].geometry.location.lng+"&APPID=0442e553754e22dd2e70deb96cfcf1ae"; 
          core.ajax(url,"GET",null,function(res){
            //console.log(data);
            sendReply({
              layout: "weathercard",
              data: {
                title:res.weather[0].description,
                info:res.main
              }
            },"weather in "+res.name+" is "+res.weather[0].description);
          },function(error){
            
          });    
        },function(error){
          
        });
        break;
      case "mapsearch":
        var mpd = data.term;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+data.place+"&key="+$rootScope.api_key;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "map"
          });
          core.map(data.results[0].geometry.location.lat,data.results[0].geometry.location.lng,mpd);   
        },function(error){
          
        });
        break;

      case "pc_file_explorer":
        var url;
        if(data.start == "1"){
          $rootScope.pcdir = "/";
          url = $rootScope.pc+"?type=ls&command=ls "+$rootScope.pcdir;
        } else {
          $rootScope.pcdir=$rootScope.pcdir+data.term+"/";
          url = $rootScope.pc+"?type=ls&command=ls "+$rootScope.pcdir;
        }
        console.log("URL",url);
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          sendReply({
            layout: "pc_list_dir",
            data: data
          },"");
        },function(error){

        });        
        break;
      default:
        var url = "http://codingflag.com/ai/bing.php?q="+data.term;
        core.ajax(url,"GET",null,function(data){
          console.log(data);
          try{
            if(data.type != undefined && data.type=="slider"){
              var wrapper = document.createElement('div');
              wrapper.innerHTML = core.htmlDecode(data.answer);
              alert(wrapper.innerHTML);
              var raw_slides = wrapper.getElementsByClassName('_GCg');
              alert("sides"+raw_slides.length);
              var slides = new Array();
              for(var i=0;i<raw_slides.length;i++){
                var src = raw_slides[i].getElementsByTagName("img")[0].getAttribute("data-key");
                var name = raw_slides[i].getElementsByClassName("kltat")[0].innerText;
                if(src == null){
                  src = raw_slides[i].getElementsByTagName("img")[0].getAttribute("data-src");
                }
                if(src != null){                
                  slides.push({
                    "src": src,
                    "name": name
                  });
                }
              }
              sendReply({
                layout: "g-card",
                data: slides
              },data.answer);
            } else if(data.type != undefined && data.type=="converter"){
              var wrapper = document.createElement('div');
              wrapper.innerHTML = core.htmlDecode(data.answer);
              sendReply({
                layout: "converter",
                data: {
                  "label_1":wrapper.getElementsByTagName("select")[1].value,
                  "label_2":wrapper.getElementsByTagName("select")[2].value,
                  "value_1":wrapper.getElementsByTagName("input")[0].value,
                  "value_2":wrapper.getElementsByTagName("input")[1].value,
                }
              }," "+wrapper.getElementsByTagName("input")[0].value + " " + wrapper.getElementsByTagName("select")[1].value + " is equal to " + wrapper.getElementsByTagName("input")[1].value + " " + wrapper.getElementsByTagName("select")[2].value);
              //alert(wrapper.innerHTML);
              //alert(wrapper.getElementsByTagName("select")[1].value);
            } else if(typeof data.answer!= undefined && data.type=="basic"){
              sendReply({
                layout: "basic",
                data: data.answer
              },data.answer);
            } else {
              //alert("G-search");
              var url = "https://www.googleapis.com/customsearch/v1?cx="+$rootScope.cx+"&searchType=image&num=9&key="+$rootScope.api_key+"&q="+ogmsg;
              core.ajax(url,"GET",null,function(data){
                //alert(JSON.stringify(data));
                sendReply({
                  layout: "g-search-slider",
                  data:data.items
                });                
              },function(error){
                
              });              
            }
          } catch(msg){}
        },function(error){
          alert("Error");
        });
        break;
    }
  };
  this.sendReply = function(data,say){

    device.speak(say);
    //alert(JSON.stringify(data));
    $rootScope.messages.push({
      userId: $rootScope.alternate ? '12345' : '54321',
      data: data.data,
      time: Math.random()*1000,
      side:false,
      layout:data.layout,
      "$$hashKey":Math.round(Math.random()*1000)
    });   
    console.log("messages",$rootScope.messages);
    //if(data.layout != "basic")
      $rootScope.$digest();
    $ionicScrollDelegate.scrollBottom(true); 
  };
})

.service("device",function(bot, $rootScope){
  this.listen = function(status,func_exec_success){
    var options = {
      language:"en-US",
      matches:5,
      prompt:"Speak",
      showPopup:false,
      showPartial:false
    }
    window.plugins.speechRecognition.startListening(function(d){
      //alert(JSON.stringify(d));
      $rootScope.$digest();
      $rootScope.recognizing = true;      
      if(typeof status != "string"){
        func_exec_success(d[0]);
      } else {
        $rootScope.messages.push({
          userId: $rootScope.alternate ? '54321' : '12345',
          data: d[0],
          time: d,
          side:true,
          layout:"basic"
        });
        $rootScope.$digest();
        bot.reply(d[0]);
      }
    }, function(e){
      //alert("Speech error");
      $rootScope.$digest();
      $rootScope.recognizing = true;
      $rootScope.$digest();
    },options);    


    // var maxMatches = 5;
    // var promptString = "Speak now"; 
    // var language = "en-US";
    // window.plugins.speechrecognizer.startRecognize(function(d){
    //   $rootScope.$digest();
    //   $rootScope.recognizing = true;      
    //   if(typeof status != "string"){
    //     func_exec_success(d[0]);
    //   } else {
    //     $rootScope.messages.push({
    //       userId: $rootScope.alternate ? '54321' : '12345',
    //       data: d[0],
    //       time: d,
    //       side:true,
    //       layout:"basic"
    //     });
    //     $rootScope.$digest();
    //     bot.reply(d[0]);
    //   }        
    // }, function(errorMessage){
    //   $rootScope.$digest();
    //   $rootScope.recognizing = true;
    //   $rootScope.$digest();
    // }, maxMatches, promptString, language);

  };
  this.speak = function(msg,preexec){
    TTS.speak({
      text: msg,
      locale: 'en-UK',
      rate: 0.92
    }, function () {
    }, function (reason) {
      alert(reason);
    });
  };

  this.torch = function(status){
    window.plugins.flashlight.available(function(isAvailable) {
      if (isAvailable) {
        if(status=="on" || status=="start")
          window.plugins.flashlight.switchOn();
        else 
          window.plugins.flashlight.switchOff();
      } else {
        this.speak("Flashlight not available on this device");
      }
    }); 
  };

  this.info = function(){

  };

  this.phone = function(no){
    window.plugins.CallNumber.callNumber(function(){
      //alert("called");
    }, function(){
      //alert("call error");
    }, no, true);
  };

  this.sms = function(){
    if(SMS) {
      SMS.listSMS({}, function(dt){
        if(Array.isArray(dt)) {
          bot.sendReply({
            layout: "card",
            data: {
              title:dt[0].address,
              desc:dt[0].body
            }
          },dt[0].body);
        }
      }, function(err){
        alert('error list sms: ' + err);
      });
    }
  };

  this.contacts = function(name,func_exec_success){
    var options      = new ContactFindOptions();
    options.filter   = ""+name;
    options.multiple = true;
    options.desiredFields = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName,navigator.contacts.fieldType.phoneNumbers];
    options.hasPhoneNumber = true;
    var fields       = [navigator.contacts.fieldType.displayName];
    navigator.contacts.find(fields, function(contacts){
      //alert(JSON.stringify(contacts));
      if(contacts.length == 0 ){
        device.speak("No such person found.Please try different name");
      } else if(contacts.length == 102012) {
        //this.sendWhatsapp(msgdata,contacts[0].phoneNumbers[0].value);
      } else {
          func_exec_success(contacts);
          // for(var i=0;i<contacts.length;i++){
          //     //alert(contacts[i].id+"-"+contacts[i].displayName);     
          //     dhtml+="<p style='padding-bottom:2px;border-bottom:1px solid #999'>";
          //     dhtml+="<div>"+contacts[i].displayName+"</div>";
          //     // if(contacts[i].displayName.toLowerCase() == name.toLowerCase()){
                  
          //     //     break;
          //     // }
          //     dhtml+="&nbsp;&nbsp;&nbsp; -<div>"+contacts[i].phoneNumbers[0].value+"</div>";
          //     dhtml+="<p>";
          // }
          // ansref.innerHTML += "<div class='ans'><main>"+dhtml+"</main></div>";
          // tts("Which "+name,null);
          // setTimeout(function(){
          //     innerStartSpeechRecongition(null,getContacts,contacts,msgdata); 
          // },3217);
          // }
      }
    }, function(){
      alert('onError!');
    },options);  
      
          // for(var i=0;i<data.length;i++){
          //     if(data[i].displayName == name){
          //         sendWhatsapp(msgdata,data[i].phoneNumbers[0].value);
          //         break;
          //     }
          // }
  };

  this.sendWhatsapp = function(msg,no){
    window.location.assign("https://api.whatsapp.com/send?phone="+no+"&text="+msg);
  };


  this.remember = function(task,data){
    if(window.localStorage["remember_db"] == undefined){
      window.localStorage["remember_db"] = {};
    }
    var db;
    try{ 
      db = JSON.parse(localStorage.getItem("remember_db")); 
    } catch(msg){
      db = {};
      db.list = [];
    }      
    if(task=="add"){
      var date = new Date();      
      db.list.push({
        "data":data,
        "time": `${date.toLocaleString("en-us", {month: "long"})} ${date.getDate()},${date.getFullYear()}`,
        "date": date.getDate(),
        "year": date.getFullYear()     
      });
    } else if(task=="flush"){
      db.list.length = 0;
    } else if(task=="search"){
      for(var i=0;i<db.list.length;i++){
        var item = db.list[i].data;
        console.log("list-item",item,data);
        if(item.indexOf(data) >= 0){
          return db.list[i];
        }
      }
      return "no-match-found";
    } else if(task=="all"){
      return db.list;
    }
    localStorage.setItem("remember_db",JSON.stringify(db));
  };

  this.reminder = function(){
    
  };


  this.openGallery = function(){
    ImagePicker.getPictures(function(result) {
        alert(result);
    }, function(err) {
        alert(err);
    }, { 
      maximumImagesCount : 1, 
      width : 1920, 
      height : 1440, 
      quality : 100 
    });
  };

  this.camera = function(side){
    // var options = {
    //   quality: 100,
    //   destinationType: Camera.DestinationType.DATA_URL
    // };

    // navigator.camera.getPicture(function(imageUri) {
    //   alert(imageUri);
    //   bot.sendReply({
    //     layout: "camera",
    //     data: imageUri
    //   },"");
    // }, function(error) {
    //     console.debug("Unable to obtain picture: " + error, "app");
    // }, options);    

    // CameraPreview.takePicture({width:640, height:640, quality: 85}, function(base64PictureData){
    //   var imageSrcData = 'data:image/jpeg;base64,' +base64PictureData;
    //   alert(imageSrcData);
    //   bot.sendReply({
    //     layout: "camera",
    //     data: imageSrcData
    //   },"");
    // });    

    CameraPreview.startCamera({x: 0, y: 65, width: window.innerWidth, height: window.innerHeight-65, toBack: false, previewDrag: false, tapPhoto: true});
    if(side =="back")   {
      CameraPreview.switchCamera();
    }
    var timer = document.getElementById("timer");
    timer.classList.remove("hide");
    timer.classList.add("start");

    setTimeout(function(){
      CameraPreview.takePicture(function(imgData){
        //CameraPreview.hide();
        CameraPreview.stopCamera();
        bot.sendReply({
          layout: "camera",
          data: 'data:image/jpeg;base64,' + imgData
        },"");
        document.getElementById("timer").classList.remove("start");
        document.getElementById("timer").classList.add("hide");
      });
    },3217);    
    // var options = {
    //   limit: 1
    // };
    // navigator.device.capture.captureImage(function(mediaFiles) {
    //   var i, path, len;
    //   for (i = 0, len = mediaFiles.length; i < len; i += 1) {
    //      path = mediaFiles[i].fullPath;
    //      alert(mediaFiles);
    //   }
    // }, function(error) {
    //   alert('Error code: ' + error.code, null, 'Capture Error');
    // }, options);

        

  };

  this.browse = function(url){
    cordova.InAppBrowser.open(url, '_blank', 'location=yes');
  };

})

.filter('trustAsResourceUrl', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}])


.controller('PCCtrl', function($rootScope, $scope, $timeout, $ionicScrollDelegate, core, bot, device, $ionicActionSheet, $ionicPopup, $ionicModal) {
  $scope.cmd = "";
  $scope.exout = "";
  $scope.downloadFile = function(path,name){
    console.log(downloadFiles);
    if(downloadFiles != null){
      downloadFiles(host+'notes/'+path,name);
    } else {
      core.unexpectedError();
    }
  };
  $scope.exec = function(keyEvent){
    if (keyEvent.which !== 13)
      return;
    var url = url = $rootScope.pc+"?type=ls&command="+keyEvent.target.value;
    console.log("url",url);
    core.ajax(url,"GET",null,function(data){
      console.log(data);
      $scope.exout = data;
    },function(error){

    });
  };
  $scope.cdir = "/";
  $scope.file_explorer = [];
  $scope.file = {
    "name":"",
    "data":"",
    "type":""
  };
  $scope.explorer = function(type,dir,isdir){
    if(type != "dir"){
      $scope.showFileOperations(dir);
      return;
    }
    var url = "";
    if(dir == "")
      url = $rootScope.pc+"?type=ls&command="+$scope.cdir;
    else {
      if(isdir != undefined || isdir != null){
        url = $rootScope.pc+"?type=ls&command="+$scope.cdir;
      } else {
        $scope.cdir += dir+"/";
        url = $rootScope.pc+"?type=ls&command="+$scope.cdir;        
      }
    }
    console.log("url",url);
    core.ajax(url,"GET",null,function(data){
      //alert(JSON.stringify(data));
      document.getElementById("loading_file_explorer").style.display = "block";
      var fd = [];
      var flag = false;
      var tdir = "";
      if($scope.cdir != "/"){
        fd.push({
            "name":"..",
            "type":"dir"
        });
      }
      for(var i=0;i<data.data.fd.length;i++){        
        for(var j=0;j<data.data.d.length;j++){
          tdir = ""+data.data.d[j];
          tdir = tdir.replace($scope.cdir,"");
          if(data.data.fd[i] == tdir){
            flag = true;
            break;
          }
        }
        if(flag){
          fd.push({
            "name":data.data.fd[i],
            "type":"dir"
          });
        } else {
          fd.push({
            "name":data.data.fd[i],
            "type":"file"
          });
        }  
        flag = false;  
      }
      fd.pop();
      $scope.file_explorer = [];
      $scope.file_explorer = fd;
      $scope.$apply();
      document.getElementById("loading_file_explorer").style.display = "none";
    },function(error){
      document.getElementById("loading_file_explorer").style.display = "none";
    });

  };
  $scope.explorer("dir","");

  $scope.showFileOperations = function(filename) {

    var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<div class="bt-item">Open</div>' },
       { text: '<div class="bt-item">Print</div>' },
       { text: '<div class="bt-item">Delete</div>' },
       { text: '<div class="bt-item">Properties</div>' }
     ],
     titleText: ''+filename,
     cancelText: 'Cancel',
     cancel: function() {
          
     },
     buttonClicked: function(index) {
       //alert(index);
       if(index == 3){
          core.ajax($rootScope.pc+"?type=properties&command=stat "+$scope.cdir+filename,"GET",null,function(data){
            console.log(data);
            $scope.showProperties(data.data);
          },function(error){

          });        
       } else if(index == 0){
          var ext = filename.substr(filename.lastIndexOf('.') + 1);
          $scope.file.name = filename;
          if(ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gif"){
            $scope.file.type = "image";
            $scope.file.data = $rootScope.pc+$scope.cdir+filename;
            alert($scope.file.data);
            $scope.open();
          } else if(ext == "mp3" || ext == "ogg"){

          } else if(ext == "mp4"){

          } else if(ext == "zip" || ext == "7z" || ext == "gz"){

          } else if(ext == "img"){

          } else {
            core.ajax($rootScope.pc+"?type=head&command=head -n -1 "+$scope.cdir+filename,"GET",null,function(data){
              //alert(JSON.stringify(data));
              $scope.file.type = "text";
              $scope.file.data = core.htmlDecode(data.data);
              $scope.open();
            },function(error){

            });
          }
       } else if(index == 1){

       } else if(index == 2){
          core.ajax($rootScope.pc+"?type=delete&command=/var/www/html/PC/delete.sh "+$scope.cdir+filename,"GET",null,function(data){
            console.log(data);
            if(data.data == "done"){
              $scope.explorer("dir",$scope.cdir,true);
            } else {

            }
          },function(error){

          });
       }
       return true;
     }
    });
  };
  
  $scope.showProperties = function(data) {
    var html = "";
    for(var i=0;i<data.length;i++){
      html+= "<p>"+data[i]+"</p>";
    }
    var alertPopup = $ionicPopup.alert({
      title: 'Properties',
      template: html
    });
    alertPopup.then(function(res) {
    });
  };
  
  $ionicModal.fromTemplateUrl('templates/file_edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.open = function(data){
    //alert("Modal");
    $scope.modal.show();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  

  $scope.clear = function(){
    document.getElementById("file-edit-textarea").value = "";
  };
  $scope.save = function(){
    var data = document.getElementById("file-edit-textarea").value;
    core.ajax($rootScope.pc+"?type=save&command="+$scope.cdir+filename+"&data="+$scope.cdir+filename,"POST",null,function(data){
      console.log(data);
      $scope.showProperties(data.data);
    },function(error){

    });
  };
})


.controller('SettingsCtrl', function($rootScope, $scope, $timeout, $ionicScrollDelegate, core, bot, device) {

})

.controller('PCFCtrl', function($rootScope, $scope, $timeout, $ionicScrollDelegate, core, bot, device) {

})

.controller('PCTaskMgrCtrl', function($rootScope, $scope, $timeout, $ionicScrollDelegate, core, bot, device) {
  $scope.tasklist = [];
  $scope.loadTaskList = function(){
    core.ajax($rootScope.pc+"?type=taskmgr&command=ps -A","GET",null,function(data){
      console.log(data);
      var task = "";
      var raw_task = "";
      for(var i=1;i<data.data.length;i++){
        raw_task = data.data[i];
        task = raw_task.split(/\s+/);
        $scope.tasklist.push({
          "pid":task[1],
          "time":task[3],
          "name":task[4]
        });
      }
      $scope.$apply();
    },function(error){

    });
  };
  $scope.loadTaskList();

  $scope.kill = function(pid){
    alert(pid);
    core.ajax($rootScope.pc+"?type=kill&command=kill "+pid,"GET",null,function(data){
      if(data.data == "done")
        $scope.loadTaskList();
      else 
        alert("unexpected Error");
    },function(error){
    });
  };
})


.controller('Messages', function($rootScope, $scope, $timeout, $ionicScrollDelegate, core, bot, device) {

  $scope.hideTime = true;

  $scope.getYoutubeVideoSrc = function (videoId) {
    return 'https://www.youtube.com/embed/' + videoId;
  };

  $scope.browse = function(url){
    device.browse(url);
  };

  $rootScope.alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $rootScope.sendMessage = function() {
    //alternate = !alternate;

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    //console.log("---"+$scope.data.message);
    $rootScope.messages.push({
      userId: $rootScope.alternate ? '54321' : '12345',
      data: $scope.data.message,
      time: d,
      side:true,
      layout:"basic"
    });
    var dt = $scope.data.message;
    delete $scope.data.message;
    bot.reply(dt);
    
    //$ionicScrollDelegate.scrollBottom(true);

  };
  (function() {
    document.addEventListener("deviceready", onDeviceReady, false);
  }());
  function onDeviceReady() {
        cordova.plugins.autoStart.enable();
        document.addEventListener("volumedownbutton", function(){
          if($rootScope.recognizing!=false){
            //alert("vol");
            document.getElementById("recognizeBtn").click();
          }
        }, false);
  }
  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 26;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };

  $scope.recognize = function(){
    $rootScope.recognizing = false;
    device.listen("random");
  }

  $scope.recognizing = $rootScope.recognizing;
  $scope.data = {};
  $scope.myId = '12345';

  $scope.messages = $rootScope.messages;

  $rootScope.$watch(function(old,newv){
    console.log("old",old,"new",newv);
    $scope.recognizing = !old.recognizing;
  });

});
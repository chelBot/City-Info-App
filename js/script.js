
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    String.prototype.properCapitalize = function(){
      return this.charAt(0).toUpperCase() + this.slice(1); 
    };

    // load streetview
    var street = $("#street").val() ;
    if(street){
        street = street.properCapitalize() + ",";
    }
    var city = $("#city").val().properCapitalize();
    var address = street + city; 

    var location = city;

    //WHY DOESN"T THIS WORK?!?!?! have to push buttom twice to see correct greeting.   
    $('#street-btn, #city-btn').click(function(e) {
        e.preventDefault();
        if(this.id == 'street-btn') {
            // console.log('street');
            // loadData.location = address;
            $greeting.text("Information about: " + address);
            // return location;
            // console.log(location);
        }
        else if (this.id == 'city-btn'){
            // alert('city');
            $greeting.text("Information about: " + city);
            // console.log('city');
            // loadData.location = city;
            // return location;
            // console.log(location);
        }   
    });
   
  
    // $greeting.text("Information about: " + street  + " " + city);
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location + '">');

    //NY times AJAX request
    
    var nytUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + location + "&api-key=e76feb03ae17bd533a0343f3ae88e251:13:74249074";
    $.getJSON(nytUrl, function(data){
        var urls = [];
        $.each(data.response.docs, function(index){
            var url = data.response.docs[index]["web_url"];
            var headline = data.response.docs[index]["headline"]["main"];
            var snippet = data.response.docs[index]["snippet"];
            //urls.push("<li id='" + index + "'><a href='" + url + "'>"  + headline +  "</a></li>");
           // url.push("<li class='url'>" + data.response.docs["web url"] + "</li>");
           $nytElem.append("<li id='" + index + "'><a href='" + url + "'>"  + headline +  "</a><p>" + snippet + "</p></li>")

        });
    }).error(function(){
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    var timer = setTimeout(function(){
        $wikiElem.text("Wikipedia Articles Could Not Be Loaded");
    }, 4000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + location + "&format=json&callback=wikiCallback";
    $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp', 
        success: function(response) { 
            var articles = response[1];
            for(var i = 0; i < articles.length; i++){
                var urlStr = "https://en.wikipedia.org/wiki/" + articles[i];
                var urlElem = "<li><a href='" + urlStr + "'>" + articles[i] + "</a></li>";
                $wikiElem.append(urlElem);
            }
            console.log(articles);
            clearTimeout(timer);
        },
        //^^^*********why does clearTimeout need to be in a function to work?
        
    });
    return false;
    
};

$('#form-container').submit(loadData);


$(document).ready(function(){
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    String.prototype.properCapitalize = function(){
      return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    };
    function loadData(){
        var nytHasLI, wikiHasLI;
        // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");

        // load streetview
        var street = $("#street").val() ;
        if(street){
            street = street.properCapitalize() + ", ";
        }
        var city = $("#city").val().properCapitalize();
        var address = street + city;

        $greeting.text("Information about: " + address);

        //Check if background images exists. If so remove existing image and set new image.
        if($(".bgimg").length === 0){
            $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '">');
        }
        else{
            $(".bgimg").remove();
            $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '">');
        }

        //NY times AJAX request
        var nytUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + address + "&api-key=76e50180e2854206a9ae827b38cc183a";
        function ajax1(){
            return $.getJSON(nytUrl, function(data){
                var urls = [];
                $.each(data.response.docs, function(index){
                    var url = data.response.docs[index]["web_url"];
                    var headline = data.response.docs[index]["headline"]["main"];
                    var snippet = data.response.docs[index]["snippet"];
                   $nytElem.append("<li id='" + index + "'><a href='" + url + "'>"  + headline +  "</a><p>" + snippet + "</p></li>")
                });
                if($nytElem.find("li").length > 0){
                    nytHasLI = true;
                }
            }).error(function(){
                $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
            });
        };


        //Wikipedia Ajax request
        var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + address + "&format=json&callback=wikiCallback";
        function ajax2(){
            return $.ajax({
                url: wikiUrl,
                dataType: 'jsonp',
                success: function(response){
                    var articles = response[1];
                    for(var i = 0; i < articles.length; i++){
                        var urlStr = "https://en.wikipedia.org/wiki/" + articles[i];
                        var urlElem = "<li><a href='" + urlStr + "'>" + articles[i] + "</a></li>";
                        $wikiElem.append(urlElem);
                    }
                    if($wikiElem.find("li").length > 0){
                        wikiHasLI = true;
                    }
                }
                }).error(function(){
                    $wikiElem.text("Wikipedia Articles Could Not Be Loaded");
                });
        };
        //A Promise: when both ajax requests return:
        $.when(ajax1(), ajax2()).done(function(){
            if(!(wikiHasLI && nytHasLI)){
                $nytElem.text("No articles found. Try broadening your scope and searching for articles within your city of interest instead.");
            }
        });
        return false;
    };
    $('#form-container').submit(loadData);
});

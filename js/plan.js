var map;
var markers;
var geoJSON = {
    "type": "FeatureCollection",
    "features": [
    ]};

    //// Code doesn't work!
    // $(document).on('change', 'input:radio[name=mode-select]', function (event) {
    //     alert("click fired");
    // });

function mapClick(e){
  console.log(e)
  var point = map.unproject(e.point)
  console.log(point);
  if ($( "#planner-options-from-latlng" ).val() == ''){
    console.log("origin")
    
    $( "#planner-options-from-latlng" ).val(point.lat + ',' + point.lng);
    reverseGeocode(point, "#planner-options-from")
    


  }
  else if ($( "#planner-options-dest-latlng" ).val() == ''){
    console.log("dest")
    dest = point;
    $( "#planner-options-dest-latlng" ).val(point.lat + ',' + point.lng);
    reverseGeocode(point, "#planner-options-dest")
    
  }

}
function getDisplay(data){
  var display;
  if (data.address.house)
    display = data.address.house;
  else if (data.address.building)
    display = data.address.building;
  else if (data.address.house_number)
    display = data.address.house_number + " " + data.address.road
  else if (data.address.road)
    display = data.address.road + ', ' + data.address.city
  else if (data.address.neighborhood)
    display = data.address.neighborhood + ', ' + data.address.city + ', ' + data.address.state
  else if (data.address.city)
    display = data.address.city + ', ' + data.address.state
  return display;
}

function reverseGeocode(point, id){
  this.url = 'http://nominatim.openstreetmap.org/reverse?';
  var params = {};
  params.lat = point.lat;
  params.lon = point.lng;
  params.zoom = '18'
  params.countrycodes = 'US'
  params.format = 'json'
  // params.key = this.key;
  // params.components = 'administrative_area:GA|country:US';
  // params.sensor = 'false';

  $.ajax(this.url, {
    data : params,
    success: function( data ) {
      console.log(data);
      var display = getDisplay(data)
      
      $(id).val(display);
      
      var symbol = "circle-stroked";
      if (id == "#planner-options-dest"){
        symbol = "circle";
        setTimeout(function(){submit();}, 100)
      }
      addMarker(point, display, symbol)
    }
  })
}
function getBoundingBox (data) {
    var bounds = {}, coords, point, latitude, longitude;

    // We want to use the “features” key of the FeatureCollection (see above)
    data = data.features;

    // Loop through each “feature”
    for (var i = 0; i < data.length; i++) {

        // Pull out the coordinates of this feature
        coords = data[i].geometry.coordinates[0];

        // For each individual coordinate in this feature's coordinates…
        for (var j = 0; j < coords.length; j++) {

            longitude = coords[j][0];
            latitude = coords[j][1];

            // Update the bounds recursively by comparing the current
            // xMin/xMax and yMin/yMax with the coordinate 
            // we're currently checking
            bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
            bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
            bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
            bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }

    }

    // Returns an object that contains the bounds of this GeoJSON
    // data. The keys of this object describe a box formed by the
    // northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
    return bounds;
}
function maxBounds(bounds1, bounds2){
  var bounds = {};
  bounds.xMin = Math.max(bounds1.xMin, bounds2.xMin);
  bounds.xMax = Math.max(bounds1.xMax, bounds2.xMax);
  bounds.yMin = Math.max(bounds1.yMin, bounds2.yMin);
  bounds.yMax = Math.max(bounds1.yMax, bounds2.yMax);
  return bounds;
}
function addMarker(point, title, symbol){
  title = truncate(title, 60);
  console.log(title)
  if (geoJSON.features.length > 0){
    map.removeSource('markers', markers);
  }
  geoJSON.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [point.lng, point.lat]
          },
          "properties": {
            "title": title,
            "marker-symbol": symbol
          }
        });
  
  markers = new mapboxgl.GeoJSONSource({ data: geoJSON });

  
  map.addSource('markers', markers);
  // if (geoJSON.features.length < 2){
    map.flyTo(point, 13, 0, {duration:1000})
  // }
  // else{
  //   geoJSON
  //   // map.fitBounds(
  //   //   [
  //   //     [Math.min(geoJSON.features[0].geometry.coordinates[1],geoJSON.features[1].geometry.coordinates[1]),
  //   //     Math.min(geoJSON.features[0].geometry.coordinates[0], geoJSON.features[1].geometry.coordinates[0])],
  //   //     [Math.max(geoJSON.features[0].geometry.coordinates[1], geoJSON.features[1].geometry.coordinates[1]),
  //   //     Math.max(geoJSON.features[0].geometry.coordinates[0], geoJSON.features[1].geometry.coordinates[0])]
  //   //     ], {duration:1000})
  //   map.setZoom(map.getZoom()-1)
  // }
}

$(document).ready(function(){

mapboxgl.accessToken = 'pk.eyJ1IjoiYXRscmVnaW9uYWwiLCJhIjoiQmZ6d2tyMCJ9.oENm3NSf--qHrimdm9Vvdw';
mapboxgl.util.getJSON('https://www.mapbox.com/mapbox-gl-styles/styles/bright-v4.json', function (err, style) {
  if (err) throw err;

  

  style.layers.push(
  {
    "id": "RED",
    "source": "RED",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#FF0000",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "GOLD",
    "source": "GOLD",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#ffd700",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "BLUE",
    "source": "BLUE",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#0000FF",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "GREEN",
    "source": "GREEN",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#009933",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "MARTA",
    "source": "MARTA",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#f79044",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "GRTA",
    "source": "GRTA",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#47bad5",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "CCT",
    "source": "CCT",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#a53895",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "GCT",
    "source": "GCT",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#9a0e34",
      "line-width": 5
    },
    "type": "line"
  },
  {
    "id": "route",
    "source": "route",
    "render": {
      "$type": "MultiLineString",
      "line-join": "round",
      "line-cap": "round"
    },
    "style": {
      "line-color": "#888",
      "line-dasharray":[10, 4],
      "line-width": 5,
      "line-opacity":.5
    },
    "type": "line"
  }
  );
style.layers.push({
    "id": "markers",
    "source": "markers",
    "type": "symbol",
    "render": {
      "icon-image": "{marker-symbol}-12",
      "text-field": "{title}",
      "text-font": "Open Sans Semibold, Arial Unicode MS Bold",
      "text-offset": [0, 0.6],
      "text-vertical-align": "top"
    },
    "style": {
      "text-size": 12
    }
  });
map = new mapboxgl.Map({
  container: 'map', // container id
  style: style, //stylesheet location
  center: [33.7677129,-84.420604], // starting position
  minZoom: 8,
  zoom: 11 // starting zoom
});

  map.on('click', mapClick);
  initializeForms();
  if(window.location.hash) {
    restoreFromHash(window.location.hash);
  }
});





 opt = {
    autoOpen: false,
    position: { my: "center", at: "left top+130", of: window },
    dialogClass: "no-close noTitleStuff transparent-bg",
    width: 320,
    maxHeight: 600,
    // minHeight: 233,
    resizable: false,
    title: "Plan a trip"

  };
   itinOpt = {
    autoOpen: false,
    position: { my: "center", at: "left center-80", of: window },
    dialogClass: "no-close",
    width: 400,
    maxHeight: 400,
    // minHeight: 233,
    buttons: [
      {
        text: "Close",
        click: function() { 
           $(this).dialog("close");
        }
      }
    ],

    title: "Trip Itinerary"

  };
  // $('#modal-simple').dialog(opt).dialog('open');

});

//////////////////////////////////////////




var whitelabel_prefix = 'http://opentrip.atlantaregion.com/otp-rest-servlet/';

var whitelabel_minDate = new Date(2014, 02, 08);
var whitelabel_maxDate = new Date(2020, 03, 30);

var Locale = {}

Locale.dateFormat = 'mm-dd-yy';
Locale.timeFormat = 'h:mma';
Locale.dateAriaLabel = 'Date, use Ctrl en arrow keys to navigate, enter to choose';
Locale.loading = "Loading...";
Locale.edit = "Change trip";
Locale.plan = "Plan trip";
Locale.geocoderInput = "Train station, stop or address";
Locale.startpointEmpty = "No starting point entered";
Locale.noStartpointSelected = "No starting point selected";
Locale.destinationEmpty = "No destination entered";
Locale.noDestinationSelected = "No destination selected";
Locale.noValidDate = "Enter a valid date";
Locale.noValidTime = "Enter a valid time";
Locale.dateTooEarly = function ( minDate8601 ) { return "This trip planner works for travel dates starting "+minDate8601.split('-').reverse().join('-'); }
Locale.dateTooLate = function ( maxDate8601 ) { return "This trip planner works for travel dates till "+maxDate8601.split('-').reverse().join('-'); }
Locale.from = "From";
Locale.via = "Via";
Locale.to = "To";
Locale.date = "Date";
Locale.time = "Time";
Locale.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
Locale.days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
Locale.daysMin = ['Su','Mo','Tu','We','Th','Fr','Sa'];
Locale.earlier = 'Earlier';
Locale.later = 'Later';
Locale.noAdviceFound = 'No valid trips found';
Locale.walk = 'Walk';
Locale.platformrail = 'Platform';
Locale.platform = 'Platform';
Locale.amountTransfers = function ( transfers ) { if (transfers == 0) { return 'Direct'; } else { return transfers+ ' transfers';} }
Locale.autocompleteMessages = {
        noResults: "No results found.",
        results: function( amount ) {
            return amount + ( amount > 1 ? " results are " : " result is" ) + " available, use the up and down arrow keys to navigate them.";
        }
}



var planningserver = whitelabel_prefix+'ws/plan?';

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

jQuery.unparam = function (value) {
    if (value.length > 1 && value.charAt(0) == '#'){
        value = value.substring(1);
    }
    var
    // Object that holds names => values.
    params = {},
    // Get query string pieces (separated by &)
    pieces = value.split('&'),
    // Temporary variables used in loop.
    pair, i, l;

    // Loop through query string pieces and assign params.
    for (i = 0, l = pieces.length; i < l; i++) {
        pair = pieces[i].split('=', 2);
        // Repeated parameters with the same name are overwritten. Parameters
        // with no value get set to boolean true.
        params[decodeURIComponent(pair[0])] = (pair.length == 2 ?
            decodeURIComponent(pair[1].replace(/\+/g, ' ')) : true);
    }
    return params;
};

var currentTime = moment();

var bag42 = function( request, response ) {
  $.ajax({
    url: "http://bag42.nl/api/v0/geocode/json",
    dataType: "json",
    data: {
      address : request.term
    },
    success: function( data ) {
      response( $.map( data.results, function( item ) {
      return {
        label: item.formatted_address,
        value: item.formatted_address,
        latlng: item.geometry.location.lat+','+item.geometry.location.lng
        }
      }));
    }
  });
};


var bliksem_geocoder = function( request, response ) {
  $.ajax({
    url: whitelabel_prefix+"/geocoder/" + request.term + '*',
    dataType: "json",
    success: function( data ) {
      response( $.map( data.features, function( item ) {
      return {
        label: item.properties.search,
        value: item.properties.search,
        latlng: item.geometry.coordinates[1]+','+item.geometry.coordinates[0]
        }
      }));
    }
  });
};


var google_geocoder = function( request, response ) {
  var google_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  var key = 'AIzaSyCSEnj3req-uXzLNeFuEgY-57M-AL1nq50'
  $.ajax({
    url: google_url + request.term + '&components=administrative_area:GA|country:US&sensor=false&key=' + key,
    dataType: "json",
    success: function( data ) {
      response( $.map( data.results, function( item ) {
      return {
        label: item.formatted_address,
        value: item.formatted_address,
        latlng: item.geometry.location.lat+','+item.geometry.location.lng
        }
      }));
    }
  });
};

var nominatim_geocoder = function(request, response) {
  this.url = 'http://open.mapquestapi.com/nominatim/v1/search.php?';
  var params = {};
  params.q = request.term
  params.viewbox = '-84.828,33.316,-83.864,34.297'
  params.countrycodes = 'US'
  params.format = 'json'
  // params.key = this.key;
  // params.components = 'administrative_area:GA|country:US';
  // params.sensor = 'false';

  $.ajax(this.url, {
    data : params,
    success: function( data ) {

      response( $.map( data, function( item ) {
      return {
        label: item.display_name.split(', Georgia, United States of America')[0],
        value: item.display_name.split(', Georgia, United States of America')[0],
        latlng: item.lat+','+item.lon
        }
      }));
    }
  })

}


var Geocoder = Geocoder || {};
Geocoder.geocoder = nominatim_geocoder;

switchLocale();

function initializeForms(){
    setupAutoComplete();
    setupDatetime();
    setupSubmit();
    if ($( "#planner-options-from" ).val() == ''){
        $( "#planner-options-from-latlng" ).val('');
    }
    if ($( "#planner-options-dest" ).val() == ''){
        $( "#planner-options-dest-latlng" ).val('');
    }
    $('.mode-option').removeClass('active');
    $('#train').parent().addClass('active');
    $('.popover-dismiss').popover({
        container: 'body',
        html: true,
        content: '<p>ARC\'s <a target="_blank" href="http://oneclick-arc.camsys-apps.com/">One-Click</a> combines data from this trip planner with services like <strong>MARTA Mobility</strong>, transport for veterans and disabled persons, and other on-demand services.</p><a target="_blank" href="http://oneclick-arc.camsys-apps.com/" type="button" class="center-block btn btn-primary">Visit the One-Click!</a>',
        trigger: 'click',
        title: 'Looking for specialized services?' + '<button type="button" onclick="$(\'.popover-dismiss\').popover(\'hide\');" class="close">&times;</button>'
    });
    $('.close').trigger('click', function(e){
        $(".popover-dismiss").popover("hide");
    });


}

function validate(){
    var valid = true;

    if ($( "#planner-options-from" ).val() == ''){
        $( "#planner-options-from-latlng" ).val('');
    }
    if ($( "#planner-options-dest" ).val() == ''){
        $( "#planner-options-dest-latlng" ).val('');
    }
    $( "#planner-options-from-error" ).remove();
    if ($( "#planner-options-from" ).val() == ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-from-error\" for=\"planner-options-from\">"+Locale.startpointEmpty+"</div>").insertAfter("#planner-options-inputgroup-from");
        $( "#planner-options-from" ).attr('aria-invalid',true);
        valid = false;
    }else if ($( "#planner-options-from-latlng" ).val() == ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-from-error\" for=\"planner-options-from\">"+Locale.noStartpointSelected+"</div>").insertAfter("#planner-options-inputgroup-from");
        $( "#planner-options-from" ).attr('aria-invalid',true);
        valid = false;
    }
    $( "#planner-options-dest-error" ).remove();
    if ($( "#planner-options-dest" ).val() == ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-dest-error\" for=\"planner-options-dest\">"+Locale.destinationEmpty+"</div>").insertAfter("#planner-options-inputgroup-dest");
        $( "#planner-options-dest" ).attr('aria-invalid',true);
        valid = false;
    }else if ($( "#planner-options-dest-latlng" ).val() == ''){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-dest-error\" for=\"planner-options-dest\">"+Locale.noDestinationSelected+"</div>").insertAfter("#planner-options-inputgroup-dest");
        $( "#planner-options-dest" ).attr('aria-invalid',true);
        valid = false;
    }
    if (!valid){return valid;};
    $( "#planner-options-from" ).attr('aria-invalid',false);
    $( "#planner-options-dest" ).attr('aria-invalid',false);
    $( "#planner-options-time-error" ).remove();
    if (!getTime()){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-time-error\" for=\"planner-options-time\">"+Locale.noValidTime+"</div>").insertAfter("#planner-options-inputgroup-time");
        valid = false;
        $( "#planner-options-time" ).attr('aria-invalid',true);
    }
    $( "#planner-options-date-error" ).remove();
    if (!getDate()){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.noValidDate+"</div>").insertAfter("#planner-options-inputgroup-date");
        $( "#planner-options-date" ).attr('aria-invalid',true);
        return false;
    }
    var minDate = $( "#planner-options-date" ).attr('min');
    var maxDate = $( "#planner-options-date" ).attr('max');
    if (getDate() < minDate){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.dateTooEarly(minDate)+"</div>").insertAfter("#planner-options-inputgroup-date");
        valid = false;
        $( "#planner-options-date" ).attr('aria-invalid',true);
    }else if (getDate() > maxDate){
        $( "<div class=\"alert alert-danger\" role=\"alert\" id=\"planner-options-date-error\" for=\"planner-options-date\">"+Locale.dateTooLate(maxDate)+"</div>").insertAfter("#planner-options-inputgroup-date");
        $( "#planner-options-date" ).attr('aria-invalid',true);
        valid = false;
    }
    if (valid){
        $( "#planner-options-time" ).attr('aria-invalid',false);
        $( "#planner-options-date" ).attr('aria-invalid',false);
    }
    return valid;
}
var itinDialog;
function hideForm(){
  // $('.plannerpanel.planner-options').removeClass('planner-form').addClass('planner-summary');
  // $('#planner-options-form').attr('aria-hidden',true);
  // $('#planner-options-form').hide();
  // $('#planner-options-desc-row').show();
  // $('#planner-options-desc-row').attr('aria-hidden',false);
  // $('#planner-options-desc-row').removeClass('hidden');
  // showResults();
    $('#planner-advice-div').show();
  $('#planner-advice-div').attr('aria-hidden',false);
  $('#planner-advice-div').removeClass('hidden');
  $('#hide-results').show();
  // opens modal on map
  // if (typeof itinDialog == 'undefined'){
  //   itinDialog = $('.planner-advice-modal').dialog(itinOpt).dialog('open');

  // }
  // else{
  //   if (!$('.planner-advice-modal').dialog('isOpen')){
  //     itinDialog = $('.planner-advice-modal').dialog(itinOpt).dialog('open');
  //   }
  // }

  $('#hide-results').removeClass('hidden');
}

function showForm(){
  $('.plannerpanel.planner-options').removeClass('planner-summary').addClass('planner-form');
  $('#planner-options-form').attr('aria-hidden',false);
  $('#planner-options-form').show();
  $('#planner-options-desc-row').hide();
  if ($( ".planner-advice-modal" ).dialog()){
    $('.planner-advice-modal').dialog('close');
  }
  hideResults();
    $('#planner-advice-div').find('.alert').remove();
  $('#planner-advice-div').hide();
  $('#planner-advice-div').attr('aria-hidden',true);
  $('#planner-advice-div').addClass('hidden');
  $('#planner-options-desc-row').attr('aria-hidden',true);
  $('#planner-options-desc-row').addClass('hidden');
  $('#hide-results').hide();
  $('#planner-options-submit').button('reset');
}
function hideResults(){
  $('#planner-advice-container').find('.alert').remove();
  $('#planner-advice-container').hide();
  $('#planner-advice-container').attr('aria-hidden',true);
  $('#planner-advice-container').addClass('hidden');

}
function showResults(){
  $('#planner-advice-container').show();
  $('#planner-advice-container').attr('aria-hidden',false);
  $('#planner-advice-container').removeClass('hidden');

}
function toggleResults(){
  if (!$('#planner-options-desc-row').hasClass('hidden')){
    if ($('#planner-advice-container').hasClass('hidden')){
      showResults();

    }
    else{
      hideResults();
    }
  }
}
function getPrettyDate(){
   var date = getDate().split('-');
   console.log(date)
   date = new Date(date[0],date[1]-1,date[2]);
   console.log(Locale.days[date.getDay()])
   return Locale.days[date.getDay()] + ' ' + Locale.months[date.getMonth()] + ' ' + date.getDate();
}

function makeBliksemReq(plannerreq){
  req = {}
  bliksemReq = {}
  if (plannerreq['arriveBy']){
    bliksemReq['arrive'] = true
  }else{
    bliksemReq['depart'] = true
  }

  bliksemReq['from-latlng'] = plannerreq['fromLatLng'];
  bliksemReq['to-latlng'] = plannerreq['toLatLng'];
  bliksemReq['date'] = plannerreq['date'] + 'T' + plannerreq['time'];
  bliksemReq['showIntermediateStops'] = true;
  return bliksemReq;
}

function epochtoIS08601date(epoch){
  var d = new Date(epoch);
  var date = String(d.getFullYear())+'-'+String((d.getMonth()+1)).lpad('0',2)+'-'+String(d.getDate()).lpad('0',2);
  return date;
}

function epochtoIS08601time(epoch){
  var d = new Date(epoch);
  var time = d.getHours().toString().lpad('0',2)+':'+d.getMinutes().toString().lpad('0',2)+':'+d.getSeconds().toString().lpad('0',2);
  return time;
}
function earlierAdvice(){
  if (!itineraries){
     return false;
  }
  $('#planner-advice-earlier').button('loading');
  var minEpoch = 9999999999999
  $.each( itineraries , function( index, itin ){
      if (itin.endTime < minEpoch){
          minEpoch = itin.endTime;
      }
  });
  var plannerreq = makePlanRequest();
  plannerreq.arriveBy = true;
  minEpoch -= 60*1000;
  console.log(minEpoch);
  plannerreq.date = epochtoIS08601date(minEpoch);
  plannerreq.time = epochtoIS08601time(minEpoch);
  var url = planningserver + jQuery.param(plannerreq);
  $.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp", 
      success: function( data ) {
        if (!('itineraries' in data.plan) || data.plan.itineraries.length == 0){
          return;
        }
        // var startDate = $('#planner-advice-list').find('.planner-advice-dateheader').first().html();
        $.each( data.plan.itineraries , function( index, itin ){
            // var prettyStartDate = prettyDateEpoch(itin.startTime);
            // if (startDate != prettyStartDate){
            //     $('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>').insertAfter('#planner-advice-earlier');
            //     startDate = prettyStartDate;
            // }
            // itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-dateheader').first());
        });
        $('#planner-advice-earlier').button('reset');
      }
  });
  return false;
}

function laterAdvice(){
  if (!itineraries){
     return false;
  }
  $('#planner-advice-later').button('loading');
  var maxEpoch = 0
  $.each( itineraries , function( index, itin ){
      if (itin.startTime > maxEpoch){
          maxEpoch = itin.startTime;
      }
  });
  maxEpoch += 120*1000;
  var plannerreq = makePlanRequest();
  plannerreq.arriveBy = false;
  plannerreq.date = epochtoIS08601date(maxEpoch);
  plannerreq.time = epochtoIS08601time(maxEpoch);
  var url = planningserver + jQuery.param(plannerreq);
  console.log(decodeURIComponent(url));
  $.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp", 
      success: function( data ) {
        if (!('itineraries' in data.plan) || data.plan.itineraries.length == 0){
            return;
        }
        // var startDate = $('#planner-advice-list').find('.planner-advice-dateheader').last().html();
        $.each( data.plan.itineraries , function( index, itin ){
            // var prettyStartDate = prettyDateEpoch(itin.startTime);
            // if (startDate != prettyStartDate){
            //     // $(('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>')).insertAfter($('#planner-advice-list').find('.planner-advice-itinbutton').last());
            //     // itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-dateheader').last());
            //     // startDate = prettyStartDate;
            // }else{
            //     itinButton(itin).insertAfter($('#planner-advice-list').find('.planner-advice-itinbutton').last());
            // }
        });
        $('#planner-advice-later').button('reset');
      }
  });
  return false;
}

function prettyDateEpoch(epoch){
  var date = new Date(epoch);
  return Locale.days[date.getDay()] + ' ' + date.getDate() + ' ' + Locale.months[date.getMonth()];
}

function timeFromEpoch(epoch){
  var date = moment(epoch);
  return date.format('hh:mm a');
}

var itineraries = null;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      if (/LCI|CTP|TDM|CSX|MARTA|^FY$|^ARC$|^SR$|^II$|^STP$|^III$|^US$|CMAQ/g.test(txt))
        return txt
      else if (/^IN$|^OF$|^AND$|^FOR$/g.test(txt)){
        return txt.toLowerCase()
      }
      else
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function legItem(leg){
    var legItem = $('<li class="list-group-item advice-leg"><div></div></li>');
    

    console.log(leg)
    if (leg.mode == 'WALK' || leg.mode == 'CAR' || leg.mode == 'BICYCLE'){
        if (leg.from.name == leg.to.name){
            return;
        }
        if (leg.mode == 'CAR'){
          leg.mode = 'Drive';
        }
        else if (leg.mode == 'BICYCLE'){
          leg.mode = 'Bike';
        }
        legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+toTitleCase(leg.mode)+'</b></h4></div>');
    } else {
      var headsign = leg.routeLongName;
      if (leg.headsign !== null)
        headsign = toTitleCase(leg.headsign);
      else{
        headsign = "";
      }
      var headsignParts = headsign ? headsign.split(" ") : ""
      if (headsignParts[0] === leg.route || headsignParts[0] === "MARTA"){
        headsign = headsign.slice(headsignParts[0].length, headsign.length)
      }
      legItem.append('<div class="list-group-item-heading"><h4 class="leg-header"><b>'+leg.route+'</b> '+headsign+'<span class="leg-header-agency-name"><small>'+leg.agencyId+'</small></span></h4>');
    }
    var startTime = moment(leg.startTime-(leg.departureDelay ? leg.departureDelay : 0)).format("hh:mm a");
    var delayMin = (leg.departureDelay/60)|0;
    if ((leg.departureDelay%60)>=30){
        delayMin += 1;
    }
    if (delayMin > 0){
        startTime += '<span class="delay"> +'+ delayMin+'</span>';
    }else if (delayMin > 0){
        startTime += '<span class="early"> '+ delayMin+'</span>';
    }else if (leg.departureDelay != null){
        startTime += '<span class="ontime"> ✓</span>';
    }

    var endTime = moment(leg.endTime-(leg.arrivalDelay ? leg.arrivalDelay : 0)).format("hh:mm a");
    var delayMin = (leg.arrivalDelay/60)|0;
    if ((leg.arrivalDelay%60)>=30){
        delayMin += 1;
    }
    if (delayMin > 0){
        endTime += '<span class="delay"> +'+ delayMin+'</span>';
    }else if (delayMin > 0){
        endTime += '<span class="early"> '+ delayMin+'</span>';
    }else if (leg.arrivalDelay != null){
        endTime += '<span class="ontime"> ✓</span>';
    }

    if (leg.from.platformCode && leg.mode == 'RAIL'){
        legItem.append('<div><b>'+startTime+'</b> '+toTitleCase(leg.from.name)+' <small class="grey">'+Locale.platformrail+'</small> '+leg.from.platformCode+'</div>');
    }else if (leg.from.platformCode && leg.mode != 'WALK'){
        legItem.append('<div><b>'+startTime+'</b> '+toTitleCase(leg.from.name)+' <small class="grey">'+Locale.platform+'</small> '+leg.from.platformCode+'</div>');
    }else{
        legItem.append('<div><b>'+startTime+'</b> '+toTitleCase(leg.from.name)+'</div>');
    }
    if (leg.to.platformCode && leg.mode == 'RAIL'){
        legItem.append('<div><b>'+endTime+'</b> '+toTitleCase(leg.to.name)+' <small class="grey">'+Locale.platformrail+'</small> '+leg.to.platformCode+'</div>');
    }else if (leg.to.platformCode && leg.mode != 'WALK'){
        legItem.append('<div><b>'+endTime+'</b> '+toTitleCase(leg.to.name)+' <small class="grey">'+Locale.platform+'</small> '+leg.to.platformCode+'</div>');
    }else{
        legItem.append('<div><b>'+endTime+'</b> '+toTitleCase(leg.to.name)+'</div>');
    }
    return legItem;
}
var lines;
function renderItinerary(idx,moveto){
  $.each(map.sources, function(key, val){
    if (key !== "mapbox" && key !=="markers"){map.removeSource(key);}
  });
    $('#planner-leg-list').html('');
    lines = {};
    var itin = itineraries[idx];
    var generic = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "MultiLineString",
            "coordinates": []
          }
      };
    $.each( itin.legs , function( index, leg ){
      var line = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "MultiLineString",
            "coordinates": []
          }
      };
        var points = polyline.decode(leg.legGeometry.points)
        line.geometry.coordinates.push(points);
        
        
        
        var name = 'route';
        if(leg.route === "BLUE" || leg.route === "GREEN" || leg.route === "RED" || leg.route === "GOLD") {
          name = leg.route;
          if ( lines[name]){
            lines[name].geometry.coordinates.push(points)
          }
          else{
            lines[name] = line;
          }
        }
        else if (leg.agencyId == 'MARTA' || leg.agencyId == 'GRTA' || leg.agencyId == 'GCT' || leg.agencyId == 'CCT'){
          name = leg.agencyId;
          if ( lines[name]){
            lines[name].geometry.coordinates.push(points)
          }
          else{
            lines[name] = line;
          }
        }
        else{
          name = 'route';
          if ( lines[name]){
            lines[name].geometry.coordinates.push(points)
          }
          else{
            lines[name] = line;
          }
        }
        console.log(name)
        
        // map.addSource(name, route);
        
        $('#planner-leg-list').append(legItem(leg));
        var bounds;
        var max;
        if (index == itin.legs.length - 1){
          console.log("HERE!")
          $.each(lines, function(i, line){
            
            // if (typeof bounds == undefined){
            //   console.log(line)
            //   bounds = getBoundingBox(line);
            // }
            // else{
            //   console.log(line)
            //   bounds = maxBounds(bounds, getBoundingBox(line));
            // }
            console.log(i)
            var route = new mapboxgl.GeoJSONSource({ data: line });
            map.addSource(i, route);
            // map.fitBounds([[bounds.minLat, bounds.minLng],[bounds.maxLat, bounds.maxLng]])
          });
          
        }
    });

    $('#planner-advice-list').find('.btn').removeClass('active');
    $(this).addClass('active');
}
$(document).on('ready', function(){
      var win = $(this); //this = window
      if (win.width() >= 750) { $('.planner-options-form').removeClass('form-inline'); }
      else { $('.planner-options-form').addClass('form-inline'); }
});
$(window).on('resize', function(){
      var win = $(this); //this = window
      if (win.width() >= 750) { $('.planner-options-form').removeClass('form-inline'); }
      else { $('.planner-options-form').addClass('form-inline'); }
});
function itinButton(itin){
    var itinButton = $('<button type="button" class="btn btn-xs btn-default planner-advice-itinbutton" onclick="renderItinerary('+itineraries.length+',true)"></button>');
    itineraries.push(itin);
    var start = moment(itin.startTime)
    var end = moment(itin.endTime)
    var diff = end.diff(start, 'minutes')
    var minutes = diff%60;
    var hours = Math.floor(diff/60)
    var diffDisplay = hours ? hours + ' hr ' + minutes + ' min' : minutes + ' min'
    var itinSummary = '';
    $.each(itin.legs, function(i, leg){
      var text = leg.mode == 'WALK' ? leg.mode : leg.agencyId
      itinSummary += i == itin.legs.length - 1 ? text : text + '<span class="glyphicon glyphicon-arrow-right"></span>';
    });
    itinButton.append('<div class="text-left"><b>'+timeFromEpoch(itin.startTime)+'</b>  <span class="glyphicon glyphicon-arrow-right"></span> <b>'+timeFromEpoch(itin.endTime)+'</b> | '+Locale.amountTransfers(itin.transfers)+ ' | ' + diffDisplay + " | " + itinSummary + '</div>');
    // itinButton.append('<div class="text-left">'+Locale.amountTransfers(itin.transfers)+ ' | ' + diffDisplay + '</div>');
    return itinButton;
}

function planItinerary(plannerreq){
  var url = planningserver + jQuery.param(plannerreq);
  console.log(url)
  $('#planner-advice-container').prepend('<div class="progress progress-striped active">'+
  '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="100" aria-valuemax="100" style="width: 100%">'+
  '<span class="sr-only">'+Locale.loading+'</span></div></div>');
  $('#planner-advice-list').html('');
  $('#planner-leg-list').html('');

  $.ajax({
      url: url,
      type: "GET",
      dataType: "jsonp", 
      success: function( data ) {
        console.log(data)
        $('#planner-leg-list').html('');
        itineraries = []
        $('#planner-advice-list').html('');
        $('.progress.progress-striped.active').remove();
        if (!('itineraries' in data.plan) || data.plan.itineraries.length == 0){
            $('#planner-advice-container').prepend('<div class="row alert alert-danger" role="alert">'+Locale.noAdviceFound+'</div>');
            return;
        }
        $('#planner-advice-container').find('.alert').remove();
        var startDate = null;
        // $('#planner-advice-list').append('<button type="button" class="btn btn-primary" id="planner-advice-earlier" data-loading-text="'+Locale.loading+'" onclick="earlierAdvice()">'+Locale.earlier+'</button>');
        $.each( data.plan.itineraries , function( index, itin ){
            // var prettyStartDate = prettyDateEpoch(itin.startTime);
            // if (startDate != prettyStartDate){
            //     $('#planner-advice-list').append('<div class="planner-advice-dateheader">'+prettyStartDate+'</div>');
            //     startDate = prettyStartDate;
            // }
            $('#planner-advice-list').append(itinButton(itin));
        });
        // $('#planner-advice-list').append('<button type="button" class="btn btn-primary" id="planner-advice-later" data-loading-text="'+Locale.loading+'" onclick="laterAdvice()">'+Locale.later+'</button>');
        $('#planner-advice-list').find('.planner-advice-itinbutton').first().click();
        $('#planner-options-submit').button('reset');
        earlierAdvice();
        laterAdvice();
      }
  });

}
function getColor(leg){
        if(mode === "WALK") return '#bbb';
        else if(leg.route === "BLUE") return 'rgb(0, 0, 255)';
        else if(leg.route === "GREEN") return 'rgb(0, 153, 51)';
        else if(leg.route === "RED") return 'rgb(255, 0, 0)';
        else if(leg.route === "GOLD") return 'rgb(255, 215, 0)';
        else if(/MARTA/g.test(leg.agencyId)) return 'rgb(247, 144, 68)';
        else if(/CCT/g.test(leg.agencyId)) return 'rgb(165, 56, 149)';
        else if(/GCT/g.test(leg.agencyId)) return 'rgb(154, 14, 52)';
        else if(leg.agencyId === "0") return 'rgb(154, 14, 52)';
        else if(/GRTA/g.test(leg.agencyId)) return 'rgb(71, 168, 213)';
        else if(mode === "BICYCLE") return 'rgb(68, 15, 0)';
        else if(mode === "SUBWAY") return 'rgb(255, 0, 0)';
        else if(mode === "RAIL") return 'rgb(176, 0, 0)';
        else if(mode === "BUS") return 'rgb(0, 255, 0)';
        else if(mode === "TRAM") return 'rgb(255, 0, 0)';
        return '#aaa';
}
function makePlanRequest(){
  plannerreq = {}
  plannerreq.fromPlace = $('#planner-options-from-latlng').val();
  plannerreq.fromName = $('#planner-options-from').val();
  plannerreq.toPlace = $('#planner-options-dest-latlng').val();
  plannerreq.toName = $('#planner-options-dest').val();
  plannerreq.mode = $('input[name=mode-select]:checked').val()
  plannerreq.time = getTime();
  plannerreq.date = getDate();
  plannerreq.arriveBy = false;
  return plannerreq;
}
function truncate(word, num){
  if (word.length > num){
    return word.substring(0, num) + '...';
  }
  else{
    return word
  }
}
function submit(){
  // Remove lines when redrawing 
  $.each(map.sources, function(key, val){
    if (key !== "mapbox" && key !=="markers"){map.removeSource(key);}
  });
  $('#planner-options-submit').button('loading');
  hideForm();
  $('#planner-options-desc').html('');
  var plannerreq = makePlanRequest();
  var summary = $('<p></p>');
  summary.append('<b>'+Locale.from+'</b> '+truncate(plannerreq.fromName, 42)+'</br>');
  summary.append('<b>'+Locale.to+'</b> '+truncate(plannerreq.toName, 42));
  $('#planner-options-desc').append(summary);
  $('#planner-options-desc').append('<p>'+getPrettyDate() +', '+getTime()+'</p>');
  if (parent && Modernizr.history){
    parent.location.hash = jQuery.param(plannerreq);
    history.pushState(plannerreq, document.title, window.location.href);
    planItinerary(plannerreq);
  }
  // $('#planner-options-desc').children()[0].click(function(){
  //   showForm();
  // });
}
function clearHash(){
  history.pushState({id: "base"}, document.title, '{{ site.baseurl }}/plan/otp/');
  $.each(map.sources, function(id, source){
    if (id !== 'mapbox'){
      map.removeSource(id);
    }
    geoJSON = {
    "type": "FeatureCollection",
    "features": [
    ]};
    initializeForms();
    $( "#planner-options-from" ).val('');
    $( "#planner-options-dest" ).val('');
    $('#planner-advice-list').html('');
    showForm();
  })
}
function restoreFromHash(){
    var plannerreq = jQuery.unparam(window.location.hash);
    if ('time' in plannerreq){
      setTime(plannerreq['time']);
    }
    if ('date' in plannerreq){
      setDate(plannerreq['date']);
    }
    if ('fromName' in plannerreq){
        $('#planner-options-from').val(plannerreq['fromName']);
    }
    if ('fromPlace' in plannerreq){
        $('#planner-options-from-latlng').val(plannerreq['fromPlace']);
        var latlng = plannerreq['fromPlace'].split(',')
        console.log(Number(latlng[0]))
        addMarker({lat:Number(latlng[0]),lng:Number(latlng[1])}, plannerreq['fromName'], "circle-stroked")
    }
    if ('toName' in plannerreq){
        $('#planner-options-dest').val(plannerreq['toName']);
    }
    if ('mode' in plannerreq){
        $('#train').parent().removeClass('active')
        $('input[type=radio][value="' + plannerreq.mode + '"]').prop('checked', true).parent().addClass('active');
    }
    if ('toPlace' in plannerreq){
        $('#planner-options-dest-latlng').val(plannerreq['toPlace']);
        var latlng = plannerreq['toPlace'].split(',')
        console.log(Number(latlng[0]))
        addMarker({lat:Number(latlng[0]),lng:Number(latlng[1])}, plannerreq['toName'], "circle")
    }
    if ('arriveBy' in plannerreq && plannerreq['arriveBy'] == "true"){
        $('#planner-options-arrivebefore').click();
    }else{
        $('#planner-options-departureafter').click();
    }
    if (validate()){submit();}
}

function setupSubmit(){
    $(document).on('submit','.validateDontSubmit',function (e) {
        //prevent the form from doing a submit
        e.preventDefault();
        return false;
    });
    $('#planner-options-submit').click(function(e){
       var $theForm = $(this).closest('form');
       if (( typeof($theForm[0].checkValidity) == "function" ) && !$theForm[0].checkValidity()) {
           return;
       }
       if (validate()){submit();}
    });
};
var input;
function setTime(iso8601){
    // if(Modernizr.inputtypes.time){
    //     $('#planner-options-time').val(iso8601.slice(0,5));
    // }else{
      console.log(iso8601)
         input = moment(iso8601, "hh:mm a");
        // var secs = parseInt(val[0])*60*60+parseInt(val[1])*60;
        // var hours = String(Math.floor(secs / (60 * 60)) % 24);
        // var divisor_for_minutes = secs % (60 * 60);
        // var minutes = String(Math.floor(divisor_for_minutes / 60));
        console.log(input.format("HH:mm"))

        $('#planner-options-time').val(input.format("HH:mm"));
    // }
}


function setupDatetime(){
    if(Modernizr.inputtypes.time){
        $('#planner-options-timeformat').hide();
        $('#planner-options-timeformat').attr('aria-hidden',true);
    }
    setTime(currentTime);
    function pad(n) { return n < 10 ? '0' + n : n }
    var date = currentTime.year() + '-' + pad(currentTime.month() + 1) + '-' + pad(currentTime.date());
    setDate(date);
    $("#planner-options-date").datepicker( {
       dateFormat: Locale.dateFormat,
       dayNames: Locale.days,
       dayNamesMin : Locale.daysMin,
       monthNames: Locale.months,
       defaultDate: 0,
       hideIfNoPrevNext: true,
       minDate: whitelabel_minDate,
       maxDate: whitelabel_maxDate
    });

    /* Read aloud the selected dates */
    $(document).on("mouseenter", ".ui-state-default", function() {
        var text = $(this).text()+" "+$(".ui-datepicker-month",$(this).parents()).text()+" "+$(".ui-datepicker-year",$(this).parents()).text();
        $("#planner-options-date-messages").text(text);
    });

    if(Modernizr.inputtypes.date){
        $('#planner-options-dateformat').hide();
        $('#planner-options-dateformat').attr('aria-hidden',true);
    }
};

function setDate(iso8601){
    parts = iso8601.split('-');
    var d = moment(iso8601);
    $('#planner-options-date').val(d.format('MM-DD-YYYY'));
}

function getDate(){
    return moment($('#planner-options-date').val()).format("YYYY-MM-DD");
    console.log(elements)
    var month = currentTime.day();
    var day = currentTime.month();
    var year = String(currentTime.year());
    setDate(year+'-'+month+'-'+day);
    return year+'-'+month+'-'+day;
}

function getTime(){
    // if(Modernizr.inputtypes.time){
        var time = moment($('#planner-options-time').val(), "HH:mm");
        return time.format("hh:mm a")
    // } else {
    //     var val = $('#planner-options-time').val().split(':');
    //     if (val.length == 1 && val[0].length <= 2 && !isNaN(parseInt(val[0]))){
    //         var hours = val[0];
    //         var time = hours.lpad('0',2)+':00';
    //         $('#planner-options-time').val(time);
    //         return time;
    //     }else if (val.length == 2 && !isNaN(parseInt(val[0])) && !isNaN(parseInt(val[1]))){
    //         var secs = parseInt(val[0])*60*60+parseInt(val[1])*60;
    //         var hours = String(Math.floor(secs / (60 * 60)) % 24);
    //         var divisor_for_minutes = secs % (60 * 60);
    //         var minutes = String(Math.floor(divisor_for_minutes / 60));
    //         var time = hours.lpad('0',2)+':'+minutes.lpad('0',2);
    //         $('#planner-options-time').val(time);
    //         return time;
    //     }
    //     return null;
    // }
}

function setupAutoComplete(){
    $( "#planner-options-from" ).autocomplete({
        autoFocus: true,
        minLength: 3,
        //appendTo: "#planner-options-from-autocompletecontainer",
        messages : Locale.autocompleteMessages,
        source: Geocoder.geocoder,
        search: function( event, ui ) {
            $( "#planner-options-from-latlng" ).val( "" );
        },
        focus: function( event, ui ) {
            //$( "#planner-options-from" ).val( ui.item.label );
            //$( "#planner-options-from-latlng" ).val( ui.item.latlng );
            return false;
        },
        select: function( event, ui ) {
            $( "#planner-options-from" ).val( ui.item.label );
            $( "#planner-options-from-latlng" ).val( ui.item.latlng );
            console.log(ui.item)
            var point = ui.item.latlng.split(",")
            addMarker({lat:Number(point[0]),lng:Number(point[1])}, ui.item.label, "circle-stroked")
            return false;
        }
        // ,
        // response: function( event, ui ) {
        //    if ( ui.content.length === 1 &&
        //         ui.content[0].label.toLowerCase().indexOf( $( "#planner-options-from" ).val().toLowerCase() ) === 0 ) {
        //       $( "#planner-options-from" ).val( ui.content[0].label );
        //       $( "#planner-options-from-latlng" ).val( ui.content[0].latlng );
        //    }
        // }
    });
    $( "#planner-options-dest" ).autocomplete({
        autoFocus: true,
        minLength: 3,
        //appendTo: "#planner-options-dest-autocompletecontainer",
        messages : Locale.autocompleteMessages,
        source: Geocoder.geocoder,
        search: function( event, ui ) {
            $( "#planner-options-dest-latlng" ).val( "" );
        },
        focus: function( event, ui ) {
            //$( "#planner-options-dest" ).val( ui.item.label );
            //$( "#planner-options-dest-latlng" ).val( ui.item.latlng );
            return false;
        },
        select: function( event, ui ) {
            $( "#planner-options-dest" ).val( ui.item.label );
            $( "#planner-options-dest-latlng" ).val( ui.item.latlng );
            var point = ui.item.latlng.split(",")
            addMarker({lat:Number(point[0]),lng:Number(point[1])}, ui.item.label, "circle")
            return false;
        }
        // ,
        // response: function( event, ui ) {
        //    if ( ui.content.length === 1 &&
        //         ui.content[0].label.toLowerCase().indexOf( $( "#planner-options-dest" ).val().toLowerCase() ) === 0 ) {
        //       $( "#planner-options-dest" ).val( ui.content[0].label );
        //       $( "#planner-options-dest-latlng" ).val( ui.content[0].latlng );
        //    }
        // }
    });
}

function switchLocale() {
  $(".label-from").text(Locale.from);
  $(".label-via").text(Locale.via);
  $(".label-dest").text(Locale.to);
  $(".label-time").text(Locale.time);
  $(".label-date").text(Locale.date);
  $(".label-edit").text(Locale.edit);
  $(".label-plan").text(Locale.plan);

  $(".planner-options-timeformat").text(Locale.timeFormat);

  // $("#planner-options-date").datepicker('option', {
  //     dateFormat: Locale.dateFormat, 
  //     dayNames: Locale.days,
  //     dayNamesMin : Locale.daysMin,
  //     monthNames: Locale.months
  // });

  $("#planner-options-date").attr('aria-label', Locale.dateAriaLabel);
  $("#planner-options-from").attr('placeholder', Locale.geocoderInput).attr('title', Locale.from);
  $("#planner-options-via").attr('placeholder', Locale.geocoderInput).attr('title', Locale.via);
  $("#planner-options-dest").attr('placeholder', Locale.geocoderInput).attr('title', Locale.to);
  $("#planner-options-submit").attr('data-loading-text', Locale.loading);
}

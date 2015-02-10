// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require handlebars-v2.0.0

$("document").ready(function () {
  L.mapbox.accessToken = 'pk.eyJ1IjoicG9zdGF6dXJlIiwiYSI6IkJYZVBuSjgifQ.YPwaTygKiks84wDu8DuejA';
  var map = L.mapbox.map('map-one', 'examples.map-i86l3621').setView([37.7713,-122.439], 13);
  var myLayer = L.mapbox.featureLayer().addTo(map);

  loadMarkers(myLayer);
  $("#marker_form input[name='submit']").off('.addNewPin');
  $("#marker_form input[name='submit']").on("click.addNewPin", function (e) {
    $.ajax({
      type: "post",
      url: "/add-pin",
      data: {
        marker: {
          location: $("#marker_form input[name='location']").val(),
          name: $("#marker_form input[name='name']").val()
        }
      }
    }).done(function (marker) {
      $('#marker_form')[0].reset();
      addNewPinToMap(marker, map);
    }).fail(function (errors) {
      console.log(errors.responseText)
    });
  });


  $("#pin_list").on("click", "a.item", function (e) {
    var lat = $(this).data("lat");
    var lng = $(this).data("lng");

    map.panTo([lat, lng], 14);
  })

});

function addNewPinToMap(marker, map) {
  var source   = $("#pin-template").html();
  var template = Handlebars.compile(source);
  var context = {lat: marker.lat, lng: marker.lng, id: marker.id, name: marker.name, location: marker.location};
  var pin    = template(context);
  $("#pin_list").append(pin);

  var markerjson = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        marker.lng,
        marker.lat
      ]
    },
    properties: {
      title: marker.name,
      "marker-color": "#9c89cc",
      "marker-size": "medium"
    }
  };

  L.mapbox.featureLayer(markerjson).addTo(map)
}

function loadMarkers(layer) {
  $.ajax({
    type: "get",
    url: "/get-pins"
  }).done(function (pinList) {
    drawPins(pinList, layer);
  }).fail(function () {
    throw "failed to load markers";
  });
}

function drawPins(pinList, layer) {
  $("#pin_list").empty();
  var source   = $("#pin-template").html();
  var template = Handlebars.compile(source);

  var features = [];
  for (var i = 0; i < pinList.length; i++) {
    var context = {lat: pinList[i].lat, lng: pinList[i].lng, id: pinList[i].id, name: pinList[i].name, location: pinList[i].location};
    var html    = template(context);
    $("#pin_list").append(html);


    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          pinList[i].lng,
          pinList[i].lat
        ]
      },
      properties: {
        title: pinList[i].name,
        "marker-color": "#9c89cc",
        "marker-size": "medium"
      }
    });
  }

  var geojson = { type: "FeatureCollection", features: features };
  layer.setGeoJSON(geojson);
}

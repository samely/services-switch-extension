// ==UserScript==
// @name         Services Switch
// @namespace    https://www.mapbox.com
// @match        https://www.openstreetmap.com, https://www.maps.google.com
// @author       samely
// @description  Assign, label and close the issue using shortcuts
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
    var button = document.querySelectorAll('button');
    for (var i = 0; i < button.length; i++) {
        button[i].addEventListener('click', click);
    }
});

function click(e) {
    var servicioId = e.target.id
    chrome.tabs.executeScript(null, {
        code: "switchService('" + servicioId + "');"
    });
}

function switchService(service) {
    var urlService = window.location.href;
    var lat;
    var long;
    var zoom;
    var coords;

    //Get coordinates and zoom
    if (urlService.length != 0) {

        if (urlService.indexOf("google") !== -1) {
            coords = urlService.split("maps")[1].split(",");
            lat = coords[0].replace("/@", "");
            long = coords[1];
            zoom = coords[2].split("z")[0];
        }

        if (urlService.indexOf("mapillary") !== -1) {
            coords = urlService.replace("https://www.mapillary.com/app/?", "").split("&");
            for (var i = 0; i < coords.length; i++) {
                if (coords[i].indexOf("lat=") !== -1) {
                    lat = coords[i].replace("lat=", "");
                }
                if (coords[i].indexOf("lng=") !== -1) {
                    long = coords[i].replace("lng=", "");
                }
                if (coords[i].indexOf("z=") !== -1) {
                    zoom = coords[i].replace("z=", "");
                }
            }
        }
        if (urlService.indexOf("map.project-osrm.org") !== -1 && urlService.indexOf("debug") == -1) {
            coords = urlService.replace("http://map.project-osrm.org/?", "").split("&");
            zoom = coords[0].replace("z=", "");
            var center = coords[1].replace("center=", "");
            if (center.indexOf("%2C") == -1) {
                lat = center.split("%2C")[0];
                long = center.split("%2C")[1];
            } else if (center.indexOf(",") == -1) {
                lat = center.split(",")[0];
                long = center.split(",")[1];
            }
        }

        if (urlService.indexOf("openstreetmap") !== -1 || (urlService.indexOf("map.project-osrm.org") !== -1 && urlService.indexOf("debug") !== -1) || urlService.indexOf("binnacle") !== -1 || urlService.indexOf("get-directions") !== -1) {
            if (urlService.indexOf("openstreetmap") !== -1) {
                coords = urlService.replace("https://www.openstreetmap.org/#map=", "").split("/")
            } else {
                coords = urlService.split("#")[1].split("/")
            }
            zoom = coords[0];
            lat = coords[1];
            long = coords[2];
        }
        return openService(service, lat, long, Math.round(zoom));
    }
}

function openService(service, lat, long, zoom) {
    if (service == "google") {
        newUrl = "https://www.google.com/maps/@" + lat + "," + long + "," + zoom + "z";
    }
    if (service == "mapillary") {
        newUrl = "https://www.mapillary.com/app/?lat=" + lat + "&lng=" + long + "&z=" + zoom;
    }
    if (service == "routerdemoserver") {
        newUrl = "http://map.project-osrm.org/?z=" + zoom + "&center=" + lat + "," + long;
    }
    if (service == "openstreetmap") {
        newUrl = "https://www.openstreetmap.org/#map=" + zoom + "/" + lat + "/" + long;
    }
    if (service == "routerdebugmap") {
        newUrl = "http://map.project-osrm.org/debug/#" + zoom + "/" + lat + "/" + long;
    }
    if (service == "binnacle") {
        newUrl = "https://hey.mapbox.com/binnacle/#" + zoom + "/" + lat + "/" + long;
    }
    if (service == "getdirections") {
        newUrl = "https://www.mapbox.com/get-directions/#" + zoom + "/" + lat + "/" + long;
    }

    console.log(newUrl);
    window.open(newUrl, '_blank');
}

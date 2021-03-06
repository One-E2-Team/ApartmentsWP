function initResults() {
  $("#NoResults").addClass("d-none");
  $("#ResultsOperations").removeClass("d-none");
  $("#ResultsExist").removeClass("d-none");
  initResultsMap(true, [searchResult[0].apartment.location.latitude, searchResult[0].apartment.location.longitude], function(latitude, longitude) {
    var data = getDealMapSummary(latitude, longitude);
    return '<table><tr><td><a href="' + data[2] + '" style="white-space: nowrap;"><label><b>Ponuda ' + data[0] + '</b></label></a></td></tr><tr><td><label style="white-space: nowrap;">' + data[1] + '</label></td></tr></table>'
  });
}

function getDealMapSummary(latitude, longitude) {
  var obj = null;
  for (var result in searchResult)
    if (searchResult[result].apartment.location.latitude == latitude && searchResult[result].apartment.location.longitude == longitude) {
      obj = result;
      break;
    }
  return [(Number(obj) + 1).toString(), (searchResult[obj].deal == null ? searchResult[obj].apartment.nightStayPrice.toString() : searchResult[obj].deal.toString()) +
    ' RSD', 'apartment.html?id=' + searchResult[obj].apartment.id.toString()
  ];
}

function addDeal(imageExists, imgsrc, apartmentIndex /* index + 1 */ , nightCost, dealAvailable, dealPrice, apartmentId) {
  var element = document.getElementById("Results");
  var card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('m-4');
  card.style = 'width: 18rem;';
  var img = document.createElement('img');
  img.classList.add('card-img-top');
  if (imageExists) {
    img.src = imgsrc;
    card.append(img);
  }
  var head = document.createElement('div');
  head.classList.add('card-body');
  var header = document.createElement('h5');
  header.classList.add('card-title');
  header.innerText = 'Ponuda ' + apartmentIndex;
  head.append(header);
  card.append(head);
  var list = document.createElement('ul');
  list.classList.add('list-group');
  list.classList.add('list-group-flush');
  var nightItem = document.createElement('li');
  nightItem.classList.add('list-group-item');
  nightItem.innerHTML = 'Uobičajena cijena noćenja: ' + nightCost + ' RSD';
  list.append(nightItem);
  var dealItem = document.createElement('li');
  if (dealAvailable) {
    dealItem.classList.add('list-group-item');
    dealItem.innerHTML = 'Ponuđena cijena: <b>' + dealPrice + ' RSD</b>';
    list.append(dealItem);
  }
  card.append(list);
  var links = document.createElement('div');
  links.classList.add('card-body');
  links.classList.add('d-flex');
  links.classList.add('flex-column');
  var appartemntLink = document.createElement('a');
  appartemntLink.classList.add('btn');
  appartemntLink.classList.add('btn-primary');
  appartemntLink.innerText = 'Ponuda';
  appartemntLink.href = 'apartment.html?id=' + apartmentId;
  appartemntLink.classList.add('mt-auto');
  links.append(appartemntLink);
  card.append(links);
  element.append(card);
}

function GETReqToJSObject() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

var searchResult = null;

function populateHTMLwithResults() {
  var latLongList = [];
  for (var i in searchResult) {
    addDeal(searchResult[i].apartment.picturePaths.length == 0 ? false : true, searchResult[i].apartment.picturePaths.length != 0 ? searchResult[i].apartment.picturePaths[0] : null, Number(i) + 1, searchResult[i].apartment.nightStayPrice, searchResult[i].deal, searchResult[i].deal, searchResult[i].apartment.id);
    latLongList.push([searchResult[i].apartment.location.latitude, searchResult[i].apartment.location.longitude]);
  }
  addAllApartmentPointsResultMap(latLongList, true);
}

$(document).ready(function() {
  if (location.search)
    $.ajax({
      type: "GET",
      url: "rest/search/apartments" + location.search,
      data: "",
      dataType: "json",
      complete: function(response) {
        if (response.responseText && response.status == 200) {
          searchResult = JSON.parse(response.responseText);
          initResults();
          populateHTMLwithResults();
        }
      }
    });
});

function sortResults(asc) {
  searchResult.sort(function(a, b) {
    var ret;
    if (a.deal != null) {
      ret = a.deal == b.deal ? 0 : a.deal > b.deal ? 1 : -1;
    } else {
      ret = a.apartment.nightStayPrice == b.apartment.nightStayPrice ? 0 : a.apartment.nightStayPrice > b.apartment.nightStayPrice ? 1 : -1;
    }
    return asc ? ret : -1 * ret;
  });
}

$(document).ready(function() {
  $("#ascending").click(function(e) {
    e.preventDefault();
    sortResults(true);
    removeAllApartmentPointsResultMap();
    $("#Results").empty();
    populateHTMLwithResults();
  });
  $("#descending").click(function(e) {
    e.preventDefault();
    sortResults(false);
    removeAllApartmentPointsResultMap()
    $("#Results").empty();
    populateHTMLwithResults();
  });
});

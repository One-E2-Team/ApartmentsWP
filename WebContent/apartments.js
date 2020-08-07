function initResults() {
  $("#NoResults").addClass("d-none");
  $("#ResultsExist").removeClass("d-none");
  initResultsMap(true, function(latitude, longitude) {
    var data = getDealMapSummary(latitude, longitude);
    return '<table><tr><a href="' + data[2] + '"<b>Ponuda ' + data[0] + '<b></a></tr><label>' + data[1] + '</label><tr></tr></table>'
  });
}

function getDealMapSummary(latitude, longitude) {
  return [1, 2, 3];
}

function addDeal(imageExists, imgsrc, appartmentIndex, nightCost, dealAvailable, dealPrice, appartmentId) {
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
  header.innerText = 'Ponuda ' + appartmentIndex;
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
  var appartemntLink = document.createElement('a');
  appartemntLink.classList.add('btn');
  appartemntLink.classList.add('btn-primary');
  appartemntLink.innerText = 'Ponuda';
  appartemntLink.href = 'apartment.html?id=' + appartmentId;
  appartemntLink.classList.add('mt-auto');
  links.append(appartemntLink);
  var mapLink = document.createElement('a');
  mapLink.innerText = 'Prikaži na karti';
  mapLink.classList.add('btn');
  mapLink.classList.add('btn-link');
  mapLink.classList.add('ml-2');
  mapLink.classList.add('SHOWONMAPLINK');
  mapLink.name = appartmentId.toString(10);
  mapLink.href = 'javascript:void(0)';
  mapLink.classList.add('mt-auto');
  links.classList.add('d-flex');
  links.append(mapLink);
  card.append(links);
  element.append(card);
}

$(document).ready(function() {
  initResults();
  addDeal(true, "https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", 1, 930, true, 100300, 7);
  addDeal(false, "https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", 1, 930, true, 100300, 7);
  //addDeal(true,"https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",2,930,false,100300,8);
  addDeal(false, "https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", 3, 930, false, 100300, 9);
  addDeal(true, "https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", 1, 930, true, 100300, 7);
  //addDeal(true,"https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",2,930,false,100300,8);
  addDeal(false, "https://www.google.rs/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", 3, 930, false, 100300, 9);

});

function GETReqToJSObject() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

var searchResult = null;


$.ajax({
  type: "GET",
  url: "rest/search/apartments" + location.search,
  data: "",
  dataType: "",
  success: function(response) {

  }
});
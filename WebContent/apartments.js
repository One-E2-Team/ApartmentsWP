$(document).ready(function () {
  $.ajax({
    url: "rest/apartment/getAllAmenities",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function (data, status) {
      if (status == "success") {
        populateAmenities(JSON.parse(data.responseText));
      }
    },
  });
});

function populateAmenities(amenities) {
  let amenitySelection = document.getElementById("amenities");
  for (let amenity of amenities) {
    let option = document.createElement("option");
    option.text = amenity.name;
    amenitySelection.add(option);
  }
}

$(document).ready(function () {
  $("#addApartmentForm").submit(function (event) {
    event.preventDefault();
    let price = $("#pricePerNight").val();
    let zipcode = $("#zipcode").val();
    let city = $("#city").val();
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();
    let roomNum = $("#roomNum").val();
    let guestNum = $("#guestNum").val();
    let street = $("#street").val();
    let streetNum = $("#streetNum").val();
    if(addApartmentErrorExist(price, zipcode, city, latitude, longitude, roomNum, guestNum, street, streetNum)) return;
    alert("no errors");
  });
});

function addApartmentErrorExist(price, zipcode, city, latitude, longitude, roomNum, guestNum, street, streetNum){
  if (!price || !zipcode || !city || !latitude || !longitude || !roomNum || !guestNum || !street || !streetNum)
    return true;
  return false;
}

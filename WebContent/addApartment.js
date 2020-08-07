var amenities = null;

$(document).ready(function() {
  $.ajax({
    url: "rest/apartment/getAllVisibleAmenities",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        amenities = JSON.parse(data.responseText);
        populateAmenities();
        $("#addApartmentElement").addClass("d-none");
      }
    },
  });
});

function populateAmenities() {
  let amenitySelection = document.getElementById("amenities");
  for (let amenity of amenities) {
    let option = document.createElement("option");
    option.text = amenity.name;
    option.value = amenity.id;
    amenitySelection.add(option);
  }
}

$(document).ready(function() {
  $("#addApartmentForm").submit(function(event) {
    event.preventDefault();
    $("#addApartmentError").addClass("d-none");
    let price = $("#pricePerNight").val();
    let zipcode = $("#zipcode").val();
    let city = $("#city").val();
    let latitude = $("#latitude").val();
    let longitude = $("#longitude").val();
    let roomNum = $("#roomNum").val();
    let guestNum = $("#guestNum").val();
    let street = $("#street").val();
    let streetNum = $("#streetNum").val();
    let country = $("#country").val();
    if (addApartmentErrorExist(price, zipcode, city, latitude, longitude, roomNum, guestNum, street, streetNum, country)) {
      $("#addApartmentError").removeClass("d-none");
      return;
    }
    let address = new Address(street, city, country, streetNum, zipcode);
    let location = new Location(latitude, longitude, address);
    let type = "APARTMENT";
    if ($("#apartmentType").val() == "SOBA") type = "ROOM";
    let apartment = new Apartment(0, "INACTIVE", false, type, parseInt(guestNum, 10), parseInt(roomNum, 10), location, "username", null, price, 2, 10, "PM", "AM",
      getSelectedAmenityIds(), null, null, null, null);
    let json = JSON.stringify(apartment);

    $.ajax({
      url: "rest/apartment/addApartment",
      type: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          document.location.href = "apartment.html?id=" + data.responseJSON.id;
        } else if (status == "nocontent")
          alert("Nemate prava da dodajete apartman!");
      },
    });
  });
});

function addApartmentErrorExist(price, zipcode, city, latitude, longitude, roomNum, guestNum, street, streetNum, country) {
  if (!price || !zipcode || !city || !latitude || !longitude || !roomNum || !guestNum || !street || !streetNum || !country ||
    parseFloat(latitude) != latitude || parseFloat(longitude) != longitude)
    return true;
  return false;
}

function getSelectedAmenityIds() {
  let amenitySelection = document.getElementById("amenities");
  let selectedAmenityIds = [];
  for (let i = 0; i < amenitySelection.length; i++) {
    let amenityOption = amenitySelection.options[i];
    if (amenityOption.selected) selectedAmenityIds.push(amenityOption.value);
  }
  return selectedAmenityIds;
}

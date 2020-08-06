var amenities = null;

$(document).ready(function () {
  $.ajax({
    url: "rest/apartment/getAllVisibleAmenities",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function (data, status) {
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
    amenitySelection.add(option);
  }
}

$(document).ready(function () {
  $("#addApartmentForm").submit(function (event) {
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
    if (
      addApartmentErrorExist(
        price,
        zipcode,
        city,
        latitude,
        longitude,
        roomNum,
        guestNum,
        street,
        streetNum
      )
    ) {
      $("#addApartmentError").removeClass("d-none");
      return;
    }
    let address = new Address(street, city, streetNum, zipcode);
    let location = new Location(latitude, longitude, address);
    let type = "APARTMENT";
    if (document.getElementById("apartmentType").value == "SOBA") type = "ROOM";
    let apartment = new Apartment(
      0,
      "INACTIVE",
      false,
      type,
      parseInt(guestNum, 10),
      parseInt(roomNum, 10),
      location,
      "username",
      null,
      price,
      2,
      10,
      "PM",
      "AM",
      getSelectedAmenityIds(),
      null,
      null,
      null,
      null
    );
    let json = JSON.stringify(apartment);

    $.ajax({
      url: "rest/apartment/addApartment",
      type: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function (data, status) {
        if (status == "success") {
          alert(69);
        }
      },
    });
  });
});

function addApartmentErrorExist(
  price,
  zipcode,
  city,
  latitude,
  longitude,
  roomNum,
  guestNum,
  street,
  streetNum
) {
  if (
    !price ||
    !zipcode ||
    !city ||
    !latitude ||
    !longitude ||
    !roomNum ||
    !guestNum ||
    !street ||
    !streetNum ||
    parseFloat(latitude) != latitude ||
    parseFloat(longitude) != longitude
  )
    return true;
  return false;
}

function getSelectedAmenityIds() {
  let amenitySelection = document.getElementById("amenities");
  let selectedAmenityIds = [];
  for (let i = 0; i < amenitySelection.length; i++) {
    if (amenitySelection.options[i].selected)
      selectedAmenityIds.push(amenities[i].id);
  }
  return selectedAmenityIds;
}

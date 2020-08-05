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

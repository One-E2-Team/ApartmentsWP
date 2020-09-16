var amenities = null;

$(document).ready(function() {
  $.ajax({
    url: "rest/apartment/getAllVisibleAmenities",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      console.log(data.responseText);
      if (status == "success") {
        amenities = JSON.parse(data.responseText);
        populateAmenities();
      }
    },
  });
});

function populateAmenities() {
  let table = document.getElementById("amenities");
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let amenity of amenities) {
    let row = document.createElement("tr");
    row.id = amenity.id;
    let nameTd = document.createElement("td");
    let name = document.createElement("input");
    name.type = "text";
    name.value = amenity.name;
    nameTd.append(name);
    row.append(nameTd);
    row.append(createButtonTd("changeName", "Promeni ime"));
    row.append(createButtonTd("deleteButton", "Obriši"));
    table.append(row);
  }
}

$(document).on("click", "#deleteButton", function() {
  let amenityId = $(this).parent().parent().attr("id");
  $.ajax({
    url: "rest/apartment/deleteAmenity",
    type: "PUT",
    data: amenityId,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        for (let i = 0; i < amenities.length; i++) {
          let amenity = amenities[i];
          if (amenity.id == amenityId) {
            amenities.splice(i, 1);
            break;
          }
        }
        populateAmenities();
      }
    },
  });
});

$(document).on("click", "#changeName", function() {
  let newName = $(this).parent().prev().find("input").val();
  let amenityId = $(this).parent().parent().attr("id");
  let changed = null;
  for (let i = 0; i < amenities.length; i++) {
    let old = amenities[i];
    if (old.id == amenityId) {
      changed = old;
      changed.name = newName;
      amenities[i] = changed;
      break;
    }
  }
  if (changed != null) {
    let json = JSON.stringify(changed);
    $.ajax({
      url: "rest/apartment/editAmenity",
      type: "PUT",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          populateAmenities();
        }
      },
    });
  }
});

$(document).ready(function() {
  $("#addAmenityForm").submit(function(event) {
    event.preventDefault();
    let name = $("#newName").val();
    let amenity = new Amenity(0, name, false);
    var json = JSON.stringify(amenity);
    $.ajax({
      url: "rest/apartment/addAmenity",
      type: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          amenities.push(JSON.parse(data.responseText));
          $("#newName").val("");
          populateAmenities();
        }
      },
    });
  });
});

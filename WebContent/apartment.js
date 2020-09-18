var apartment = null;

// document.addEventListener("gotUser", function() {
//   if (location.search) {
//     getApartment();
//   } else alert("Niste uneli argument putanje!");
// });
document.addEventListener("gotAmenities", function() {
  if (location.search) {
    getApartment();
  } else alert("Niste uneli argument putanje!");
});

function getApartment() {
  $.ajax({
    url: "rest/apartment/getApartment" + location.search,
    type: "GET",
    data: "",
    dataType: "",
    complete: function(data, status) {
      if (status == "nocontent") {
        alert("Pogrešni argumenti putanje");
      } else if (status == "success") {
        apartment = JSON.parse(data.responseText);
        DatePicker();
        showApartmentDetails();
        document.dispatchEvent(new Event("gotApartment"));
        showProperComments();
      }
    },
  });
}

function showApartmentDetails() {
  if (user != undefined && (user.role == "ADMINISTRATOR" || (user.role == "HOST" && apartment.hostId == user.username)))
    enableEdit();
  $("#apartmentType").val(getAppSelectionString(apartment.type));
  $("#pricePerNight").val(apartment.nightStayPrice);
  $("#zipcode").val(apartment.location.address.zipcode);
  $("#city").val(getAppSelectionString(apartment.location.address.city));
  $("#latitude").val(getAppSelectionString(apartment.location.latitude));
  $("#longitude").val(getAppSelectionString(apartment.location.longitude));
  $("#roomNum").val(getAppSelectionString(apartment.roomNum));
  $("#guestNum").val(getAppSelectionString(apartment.guestNum));
  $("#street").val(getAppSelectionString(apartment.location.address.street));
  $("#streetNum").val(getAppSelectionString(apartment.location.address.number));
  $("#country").val(getAppSelectionString(apartment.location.address.country));
  populateAmenitiesForView();
}

function populateAmenitiesForView() {
  let amenitySelection = document.getElementById("amenities");
  if (user == undefined || user.role == "GUEST") {
    for (let amenity of amenities) {
      if (apartment.amenityIds.includes(amenity.id)) {
        let option = document.createElement("option");
        option.text = amenity.name;
        option.value = amenity.id;
        amenitySelection.add(option);
      }
    }
  } else if (user != undefined && ((user.role == "HOST" && apartment.hostId == user.username) || user.role == "ADMINISTRATOR")) {
    for (let amenity of amenities) {
      let option = document.createElement("option");
      option.text = amenity.name;
      option.value = amenity.id;
      if (apartment.amenityIds.includes(amenity.id))
        option.selected = true;
      amenitySelection.add(option);
    }
  }
}

function enableEdit() {
  $("#apartmentType").prop("disabled", false);
  $("#pricePerNight").prop("disabled", false);
  $("#zipcode").prop("disabled", false);
  $("#city").prop("disabled", false);
  $("#latitude").prop("disabled", false);
  $("#longitude").prop("disabled", false);
  $("#roomNum").prop("disabled", false);
  $("#guestNum").prop("disabled", false);
  $("#street").prop("disabled", false);
  $("#streetNum").prop("disabled", false);
  $("#country").prop("disabled", false);
  $("#amenities").prop("disabled", false);
  $("#editButton").removeClass("d-none");
  $("#statusData").removeClass("d-none");
  $("#deleteApartment").removeClass("d-none");
  if (apartment.status == "ACTIVE")
    $("#apartmentStatus").val("AKTIVAN");
  else $("#apartmentStatus").val("NEAKTIVAN");
}

$(document).ready(function() {
  $("#apartmentDetails").submit(function(event) {
    event.preventDefault();
    let apart = getApartmentFromForm();
    if (apart != null) {
      apart.status = "ACTIVE";
      if ($("#apartmentStatus").val() == "NEAKTIVAN")
        apart.status = "INACTIVE";
      apart.id = apartment.id;
      apart.comments = apartment.comments;
      apart.reservationIds = apartment.reservationIds;
      apart.picturePaths = apartment.picturePaths;
      apart.rentableDates = apartment.rentableDates;
      apart.availableDates = apartment.availableDates;
      let json = JSON.stringify(apart);
      $.ajax({
        url: "rest/apartment/editApartment",
        type: "PUT",
        data: json,
        contentType: "application/json",
        dataType: "json",
        complete: function(data, status) {
          if (status == "success") {
            alert("Uspeh");
          }
        },
      });
    }
  });
});

function checkReservations(reservationList) {
  for (let reservation of reservationList) {
    if (reservation.apartmentId == apartment.id && (reservation.status == "COMPLETED" || reservation.status == "DECLINED")) {
      $("#addingComment").removeClass("d-none");
      return;
    }
  }
}

function showProperComments() {
  $("#commentList").addClass("d-none");
  $("#addingComment").addClass("d-none");
  if (user != undefined && user.role == "GUEST")
    getGuestReservations();
  if (apartment.comments.length > 0)
    showComments(apartment.comments);
}

$(document).ready(function() {
  $("#commentForm").submit(function(event) {
    event.preventDefault();
    let commentText = $("#apartmentComment").val();
    let mark = $("#apartmentMark").val();
    let comment = new Comment(user.username, apartment.id, parseInt(mark, 10), commentText, "WAIT");
    let newApartment = new Apartment(apartment.id, "INACTIVE", false, "APARTMENT", 0, 0, null, "", [comment], 0, 0, 0, "PM", "AM", [], [], [], [], []);
    let json = JSON.stringify(newApartment);
    $.ajax({
      url: "rest/apartment/addComment",
      type: "PUT",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          alert("69");
        } else {
          alert(null);
        }
      },
    });
  });
});

function showComments(comments) {
  $("#commentList").removeClass("d-none");
  let table = document.getElementById("commentsTable");
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];
    let row = document.createElement("tr");
    row.id = i;
    let guest = document.createElement("td");
    guest.innerText = comment.guestId;
    row.append(guest);
    let text = document.createElement("td");
    text.innerText = comment.text;
    row.append(text);
    let mark = document.createElement("td");
    mark.innerText = comment.mark + "/5";
    row.append(mark);
    let status = document.createElement("td");
    status.innerText = comment.status;
    row.append(status);
    if (user != null && user.role == "HOST" && user.rentableApartmentIds.includes(apartment.id)) {
      if (comment.status == "WAIT") {
        row.append(createButtonTd("approveButton", "Prikaži"));
        row.append(createButtonTd("hideButton", "Sakrij"));
      } else if (comment.status == "APPROVED")
        row.append(createButtonTd("hideButton", "Sakrij"));
      else if (comment.status == "HIDDEN")
        row.append(createButtonTd("approveButton", "Prikaži"));
    }
    table.append(row);
  }
}

$(document).on("click", "#deleteApartment", function() {
  apartment.deleted = true;
  let json = JSON.stringify(apartment);
  $.ajax({
    url: "rest/apartment/editApartment",
    type: "PUT",
    data: json,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        alert("Uspeh");
        window.location.href = "index.html";
      }
    },
  });
});

$(document).on("click", "#approveButton", function() {
  let i = $(this).parent().parent().attr("id");
  apartment.comments[i].status = "APPROVED";
  editComments();
});

$(document).on("click", "#hideButton", function() {
  let i = $(this).parent().parent().attr("id");
  apartment.comments[i].status = "HIDDEN";
  editComments();
});

function editComments() {
  let json = JSON.stringify(apartment);
  $.ajax({
    url: "rest/apartment/editComments",
    type: "PUT",
    data: json,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        alert("Uspeh");
        showComments(apartment.comments);
      }
    },
  });
}
/*$(document).ready(function() {
  $("#addPicture").submit(function(e) {
    e.preventDefault();
    if ($("#img").val()) {
      //var formData = new FormData();
      //formData.append('file', $("#img").get(0).files[0]);
      $("#img").simpleUpload("rest/apartment/" + apartment.id + "/addPicture", {
        success: function(response) {
          alert(response.responseText);
        }
      });
      let kurac = $("#img").get(0).files[0];
      $.ajax({
        type: "POST",
        url: "rest/apartment/" + apartment.id + "/addPicture",
        data: $("#img").get(0).files[0],
        dataType: "json",
        complete: function(response) {
          alert(response.responseText);
        }
      });
    }
  });
}); */

function DatePicker(disabledDates) {
  $.ajax({
    type: "GET",
    url: "rest/apartment/" + apartment.id + "/getUnavailabeDates",
    dataType: "json",
    complete: function(response) {
      $(".input-daterange input").each(function() {
        let dates = [];
        JSON.parse(response.responseText).forEach(element => dates.push(new Date(parseInt(element))));
        $(this).datepicker({
          startDate: "+0d",
          endDate: new Date((new Date()).getFullYear(), 11, 31),
          datesDisabled: dates
        });
      });
    }
  });
}

$(document).ready(function() {
  $("#reservation").submit(function(e) {
    $("#reservationError").removeClass("d-none");
    e.preventDefault();
    let stay = Math.floor(Math.abs(((new Date($("input[name=dateTo]").val())) - (new Date($("input[name=dateFrom]").val()))) / 1000 / 60 / 60 / 24));
    //let dat = JSON.stringify(new Reservation(0, apartment.id, (new Date($("input[name=dateFrom]").val())).getTime(), stay, parseFloat("0.0"), $("#messageForHost").val(), "", "CREATED"));
    $.ajax({
      type: "POST",
      url: "rest/apartment/" + apartment.id + "/makeReservation/" + (new Date($("input[name=dateFrom]").val())).getTime() + "/" + stay + "/" + $("#messageForHost").val(),
      dataType: "json",
      success: function(response) {
        window.location.href = "reservations.html"
        $("#reservationError").addClass("d-none");
      }
    });
  });
});

$(document).ready(function() {
  $("input[name=dateFrom]").change(function(e) {
    e.preventDefault();
    getDeal();
  });
  $("input[name=dateTo]").change(function(e) {
    e.preventDefault();
    getDeal();
  });
});

function getDeal() {
  $("#reservationSubmitBtn").val("0 RSD");
  if (isNaN(new Date($("input[name=dateFrom]").val()).getTime()) || isNaN(new Date($("input[name=dateTo]").val()).getTime())) return;
  let stay = Math.floor(Math.abs(((new Date($("input[name=dateTo]").val())) - (new Date($("input[name=dateFrom]").val()))) / 1000 / 60 / 60 / 24));
  //let dat = JSON.stringify(new Reservation(0, apartment.id, (new Date($("input[name=dateFrom]").val())).getTime(), stay, parseFloat("0.1"), "", "", "CREATED"));
  $.ajax({
    type: "GET",
    url: "rest/apartment/" + apartment.id + "/getDeal/" + (new Date($("input[name=dateFrom]").val())).getTime() + "/" + stay,
    dataType: "json",
    complete: function(response) {
      let apartmentDeal = JSON.parse(response.responseText);
      $("#reservationSubmitBtn").val(apartmentDeal.deal + " RSD");
    }
  });
}

function getAppType(appSelectionString) {
  if (appSelectionString == "APARTMAN") return "APARTMENT";
  else if (appSelectionString == "SOBA") return "ROOM";
  return appSelectionString;
}

function getAppSelectionString(appType) {
  if (appType == "APARTMENT") return "APARTMAN";
  else if (appType == "ROOM") return "SOBA";
  return appType;
}

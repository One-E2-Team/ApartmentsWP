var reservations = null;
var searchResults = [];
var filterStatus = null;
var guestUsername = null;
document.addEventListener("gotUser", getProperReservations);

function getProperReservations() {
  if (user != undefined) {
    if (user.role == "ADMINISTRATOR") {
      getAdminReservations();
      $("#filtering").removeClass("d-none");
    } else if (user.role == "HOST") {
      getHostReservations();
      $("#filtering").removeClass("d-none");
    } else if (user.role == "GUEST") getGuestReservations();
  }
}

function getAdminReservations() {
  $.ajax({
    url: "rest/reservation/getAll",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        reservations = JSON.parse(data.responseText);
        if (getHTMLFileName() != "apartment.html")
          showReservations();
      }
    },
  });
}

function getHostReservations() {
  $.ajax({
    url: "rest/reservation/getAllByHost",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        reservations = JSON.parse(data.responseText);
        if (getHTMLFileName() != "apartment.html")
          showReservations();
      }
    },
  });
}

function getGuestReservations() {
  $.ajax({
    url: "rest/reservation/getAllByGuest",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        reservations = JSON.parse(data.responseText);
        if (getHTMLFileName() == "apartment.html")
          checkReservations(reservations);
        else showReservations();
      }
    },
  });
}

function showReservations(reservalitonList = reservations, emptyTable = "reservations") {
  if (reservalitonList.length == reservations.length && reservalitonList.length == 0) {
    $("#reservationsDiv").addClass("d-none");
    alert("Nemate rezervacija");
    return;
  }
  $("#reservationsDiv").removeClass("d-none");
  let table = document.getElementById(emptyTable);
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let reservation of reservalitonList) {
    let row = document.createElement("tr");
    row.id = reservation.id;
    let appId = document.createElement("td");
    appId.innerText = reservation.apartmentId;
    row.append(appId);
    let guest = document.createElement("td");
    guest.innerText = reservation.guestId;
    row.append(guest);
    let status = document.createElement("td");
    status.innerText = getReservationSelectionString(reservation.status);
    row.append(status);
    let price = document.createElement("td");
    price.innerText = reservation.totalCost;
    row.append(price);
    if (user.role == "HOST" && reservation.status == "CREATED")
      row.append(createButtonTd("acceptButton", "Prihvati"));
    if (user.role == "HOST" && (reservation.status == "CREATED" || reservation.status == "ACCEPTED"))
      row.append(createButtonTd("declineButton", "Odbij"));
    if (user.role == "GUEST" && (reservation.status == "CREATED" || reservation.status == "ACCEPTED"))
      row.append(createButtonTd("withdrawButton", "Odustani"));
    let completedTime = new Date(parseInt(reservation.startDate));
    completedTime.setDate(completedTime.getDate() + reservation.stayNights);
    let currentTime = new Date();
    if (user.role == "HOST" && reservation.status != "COMPLETED" && currentTime.getTime() >= completedTime.getTime())
      row.append(createButtonTd("completeButton", "Završi"));
    table.append(row);
  }
}

$(document).on("click", "#acceptButton", function() {
  let registrationId = $(this).parent().parent().attr("id");
  $.ajax({
    url: "rest/reservation/acceptReservation",
    type: "PUT",
    data: registrationId,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        for (let reservation of reservations) {
          if (reservation.id == registrationId) {
            reservation.status = "ACCEPTED";
            break;
          }
        }
        updateData();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

$(document).on("click", "#declineButton", function() {
  let registrationId = $(this).parent().parent().attr("id");
  $.ajax({
    url: "rest/reservation/declineReservation",
    type: "PUT",
    data: registrationId,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        for (let reservation of reservations) {
          if (reservation.id == registrationId) {
            reservation.status = "DECLINED";
            break;
          }
        }
        updateData();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

$(document).on("click", "#withdrawButton", function() {
  let registrationId = $(this).parent().parent().attr("id");
  $.ajax({
    url: "rest/reservation/withdrawReservation",
    type: "PUT",
    data: registrationId,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        for (let reservation of reservations) {
          if (reservation.id == registrationId) {
            reservation.status = "WITHDRAWN";
            break;
          }
        }
        updateData();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

$(document).on("click", "#completeButton", function() {
  let registrationId = $(this).parent().parent().attr("id");
  $.ajax({
    url: "rest/reservation/completeReservation",
    type: "PUT",
    data: registrationId,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        for (let reservation of reservations) {
          if (reservation.id == registrationId) {
            reservation.status = "COMPLETED";
            break;
          }
        }
        updateData();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

function updateData() {
  showReservations();
  filterByStatus();
  searchByUsername();
}

function sortResults(asc) {
  reservations.sort(function(a, b) {
    let ret = a.totalCost == b.totalCost ? 0 : a.totalCost > b.totalCost ? 1 : -1;
    return asc ? ret : -1 * ret;
  });
  searchResults.sort(function(a, b) {
    let ret = a.totalCost == b.totalCost ? 0 : a.totalCost > b.totalCost ? 1 : -1;
    return asc ? ret : -1 * ret;
  });
}

$(document).ready(function() {
  $("#ascending").click(function(e) {
    e.preventDefault();
    sortResults(true);
    showReservations();
    showReservations(searchResults, "searchReservations");
  });
  $("#descending").click(function(e) {
    e.preventDefault();
    sortResults(false);
    showReservations();
    showReservations(searchResults, "searchReservations");
  });
});

$(document).ready(function() {
  $("#filterReservationsForm").submit(function(event) {
    event.preventDefault();
    filterStatus = getReservationStatus($("#filterStatus").val());
    guestUsername = null;
    $("#guestUsername").val("");
    filterByStatus();
  })
});

function filterByStatus() {
  if (filterStatus != null) {
    let filterResults = [];
    for (let reservation of reservations) {
      if (reservation.status == filterStatus)
        filterResults.push(reservation);
    }
    showSearchResults(filterResults);
  }
}

$(document).ready(function() {
  $("#searchByUsernameForm").submit(function(event) {
    event.preventDefault();
    filterStatus = null;
    $("#filterStatus").val("-");
    guestUsername = getReservationStatus($("#guestUsername").val());
    searchByUsername();
  })
});

function searchByUsername() {
  if (guestUsername != null) {
    searchResults = [];
    for (let reservation of reservations) {
      if (reservation.guestId.includes(guestUsername))
        searchResults.push(reservation);
    }
    showSearchResults(searchResults);
  }
}

function showSearchResults(results) {
  if (results.length > 0) {
    $("#results").removeClass("d-none");
    $("#noResults").addClass("d-none");
    showReservations(results, "searchReservations");
  } else {
    $("#noResults").removeClass("d-none");
    $("#results").addClass("d-none");
  }
}

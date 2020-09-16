var reservations = null;
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

function createButtonTd(id, text) {
  let data = document.createElement("td");
  let button = document.createElement("button");
  button.type = "submit";
  button.id = id;
  button.innerText = text;
  button.classList.add("btn");
  button.classList.add("btn-primary");
  data.append(button);
  return data;
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
        showReservations();
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
        showReservations();
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
        showReservations();
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
        showReservations();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

function sortResults(asc) {
  reservations.sort(function(a, b) {
    let ret;
    ret = a.totalCost == b.totalCost ? 0 : a.totalCost > b.totalCost ? 1 : -1;
    return asc ? ret : -1 * ret;
  });
}

$(document).ready(function() {
  $("#ascending").click(function(e) {
    e.preventDefault();
    sortResults(true);
    showReservations();
  });
  $("#descending").click(function(e) {
    e.preventDefault();
    sortResults(false);
    showReservations();
  });
});

$(document).ready(function() {
  $("#filterReservationsForm").submit(function(event) {
    event.preventDefault();
    let status = getReservationStatus($("#filterStatus").val());
    let filterResults = [];
    for (let reservation of reservations) {
      if (reservation.status == status)
        filterResults.push(reservation);
    }
    if (filterResults.length > 0) {
      $("#results").removeClass("d-none");
      $("#noResults").addClass("d-none");
      showReservations(filterResults, "searchReservations");
    } else {
      $("#noResults").removeClass("d-none");
      $("#results").addClass("d-none");
    }
  })
});

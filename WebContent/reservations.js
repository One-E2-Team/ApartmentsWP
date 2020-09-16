var user = null;
var reservations = null;

function getProperReservations(userResponse) {
  if (userResponse == null) {
    alert("Niste ulogovani!");
    return;
  }
  user = userResponse;
  if (user.role == "ADMINISTRATOR") getAdminReservations();
  else if (user.role == "HOST") getHostReservations();
  else if (user.role == "GUEST") getGuestReservations();
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

function showReservations() { //TODO: proper show information
  if (reservations.length == 0) {
    alert("Nemate rezervacija");
    return;
  }
  let table = document.getElementById("reservations");
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let reservation of reservations) {
    let row = document.createElement("tr");
    row.id = reservation.id;
    let appId = document.createElement("td");
    appId.innerText = reservation.apartmentId;
    row.append(appId);
    let guest = document.createElement("td");
    guest.innerText = reservation.guestId;
    row.append(guest);
    let status = document.createElement("td");
    status.innerText = reservation.status;
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

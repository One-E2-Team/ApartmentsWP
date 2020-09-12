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
        showReservations();
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
    if (user.role == "HOST" && reservation.status == "CREATED") {
      let accept = document.createElement("td");
      let acceptButton = document.createElement("button");
      acceptButton.type = "submit";
      acceptButton.innerText = "Prihvati";
      acceptButton.id = "acceptButton";
      accept.append(acceptButton);
      row.append(accept);
    }
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
        showReservations();
      } else if (status == "nocontent") alert("Nemate prava da menjate podatke!");
    },
  });
});

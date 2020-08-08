var user = null;

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
        showReservations(JSON.parse(data.responseText));
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
        showReservations(JSON.parse(data.responseText));
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
        showReservations(JSON.parse(data.responseText));
      }
    },
  });
}

function showReservations(reservations) { //TODO: proper show information
  if (reservations.length == 0) {
    alert("Nemate rezervacija");
    return;
  }
  for (let reservation of reservations) {
    let table = document.getElementById("reservations");
    let row = document.createElement("tr");
    let data = document.createElement("td");
    data.innerText = reservation.id;
    row.append(data);
    table.append(row);
  }
}

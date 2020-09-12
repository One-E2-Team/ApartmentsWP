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
    if (user.role == "HOST" && (reservation.status == "CREATED" || reservation.status == "ACCEPTED")) {
      let decline = document.createElement("td");
      let declineButton = document.createElement("button");
      declineButton.type = "submit";
      declineButton.innerText = "Odbij";
      declineButton.id = "declineButton";
      decline.append(declineButton);
      row.append(decline);
    }
    if (user.role == "GUEST" && (reservation.status == "CREATED" || reservation.status == "ACCEPTED")) {
      let withdraw = document.createElement("td");
      let withdrawButton = document.createElement("button");
      withdrawButton.type = "submit";
      withdrawButton.innerText = "Odustani";
      withdrawButton.id = "withdrawButton";
      withdraw.append(withdrawButton);
      row.append(withdraw);
    }
    let completedTime = new Date(parseInt(reservation.startDate));
    completedTime.setDate(completedTime.getDate() + reservation.stayNights);
    let currentTime = new Date();
    if (user.role == "HOST" && reservation.status != "COMPLETED" && currentTime.getTime() >= completedTime.getTime()) {
      let complete = document.createElement("td");
      let completeButton = document.createElement("button");
      completeButton.type = "submit";
      completeButton.innerText = "Završi";
      completeButton.id = "completeButton";
      complete.append(completeButton);
      row.append(complete);
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

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
      if (status == "success") {}
    },
  });
}

function getHostReservations() {
  $.ajax({
    url: "rest/reservation/getAllByHost",
    type: "GET",
    data: user,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {}
    },
  });
}

function getGuestReservations() {
  $.ajax({
    url: "rest/reservation/getAllByGuest",
    type: "GET",
    data: user,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {}
    },
  });
}

var user = null;

function getProperUsersList(userResponse) {
  if (userResponse == null) {
    alert("Niste ulogovani!");
    return;
  }
  user = userResponse;
  if (user.role == "GUEST") {
    alert("Nemate prava da vidite stranicu!");
    return;
  } else if (user.role == "ADMINISTRATOR") getAllUsers();
  else if (user.role == "HOST") getAllByHost();
}

function getAllUsers() {
  $.ajax({
    url: "rest/user/getAll",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        alert("to");
      }
    },
  });
}

function getAllByHost() {
  $.ajax({
    url: "rest/user/getAllByHost",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        alert("too");
      }
    },
  });
}

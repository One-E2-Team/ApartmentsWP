var user = undefined;

$(document).ready(function() {
  $("#login").submit(function(event) {
    var username = $("input[name=loginUsername]").val();
    var password = $("input[name=loginPassword]").val();
    var userjson = JSON.stringify(
      new Administrator(username, password, "", "", "MALE", "GUEST", false)
    );
    $.ajax({
      url: "rest/user/login",
      type: "POST",
      data: userjson,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        console.log(data.responseText);
        if (status == "success") {
          validSession(JSON.parse(data.responseText));
        } else {
          if (document.getElementById("loginErrMessage").innerHTML == "") {
            $("#loginErrMessage").append(
              '<td></td><td colspan="3"><div class="alert alert-danger" role="alert">Unijeli ste pogrešno korisničko ime ili šifru.</div></td>'
            );
          }
        }
      },
    });
    event.preventDefault();
  });
});

$(document).ready(function() {
  $("#registrationForm").submit(function(event) {
    event.preventDefault();
    addHiddenClassForRegistration();
    let name = $("#registerName").val();
    let surname = $("#registerSurname").val();
    let username = $("#registerUsername").val();
    let password = $("#registerPassword").val();
    let repeatedPassword = $("#registerRepeatedPassword").val();
    if (registerErrorExist(name, surname, username, password, repeatedPassword)) {
      reportRegisterError(name, surname, username, password, repeatedPassword);
      return;
    }

    let sex = getSexType($("#registerSex").val());
    let json = JSON.stringify(new Guest(username, password, name, surname, sex, "GUEST", false, [], []));

    $.ajax({
      url: "rest/user/register",
      type: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          validSession(JSON.parse(data.responseText));
        } else if (status == "nocontent")
          alert("Korisnik sa korisničkim imenom '" + username + "' već postoji u sistemu!");
      },
    });
  });
});

$(document).ready(function() {
  $("#logout").click(function(event) {
    event.preventDefault();
    $.ajax({
      url: "rest/user/logout",
      type: "GET",
      data: "",
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (data.responseText != "true" || status != "success") {
          $("#ModalCenter").modal();
        } else {
          window.location.href = "index.html";
        }
      },
    });
  });
});

function registerErrorExist(name, surname, username, password, repeatedPassword) {
  if (!name || !surname || !username || !password || !repeatedPassword || password != repeatedPassword)
    return true;
  return false;
}

function reportRegisterError(name, surname, username, password, repeatedPassword) {
  if (!name) $("#registerNameError").removeClass("d-none");
  if (!surname) $("#registerSurnameError").removeClass("d-none");
  if (!username) $("#registerUsernameError").removeClass("d-none");
  if (!password) $("#registerPasswordError").removeClass("d-none");
  if (!repeatedPassword)
    $("#registerRepeatedPasswordError").removeClass("d-none").text("Ponovljena lozinka nije uneta");
  else if (password != repeatedPassword)
    $("#registerRepeatedPasswordError").removeClass("d-none").text("Ponovljena lozinka se ne poklapa");
}

function addHiddenClassForRegistration() {
  $("#registerNameError").addClass("d-none");
  $("#registerSurnameError").addClass("d-none");
  $("#registerUsernameError").addClass("d-none");
  $("#registerPasswordError").addClass("d-none");
  $("#registerRepeatedPasswordError").addClass("d-none");
  $("#registerRepeatedPasswordError").addClass("d-none");
}

function validSession(user) {
  activeUser = user;
  $("#login").addClass("d-none");
  $("#registration").addClass("d-none");
  $("#profileElement").removeClass("d-none");
  $("#logoutElement").removeClass("d-none");
  $("#reservationElement").removeClass("d-none");
  var elements = document.getElementsByClassName(user.role);
  for (var element of elements) {
    element.classList.remove("d-none");
  }
}

$(document).ready(function() {
  $.ajax({
    url: "rest/user/me",
    type: "GET",
    data: "",
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        user = JSON.parse(data.responseText);
        validSession(user);
      }
      document.dispatchEvent(new Event("gotUser"));
    },
  });
});

function getHTMLFileName() {
  let path = window.location.pathname;
  return path.split("/").pop();
}

function getSexType(sexSelectionString) {
  if (sexSelectionString == "M") return "MALE";
  else if (sexSelectionString == "Ž") return "FEMALE";
  else if (sexSelectionString == "POTATO") return "POTATO";
  return sexSelectionString;
}

function getSexSelectionString(sexType) {
  if (sexType == "MALE") return "M";
  else if (sexType == "FEMALE") return "Ž";
  else if (sexType == "POTATO") return "POTATO";
  return sexType;
}

function getRoleType(roleSelectionString) {
  if (roleSelectionString == "DOMAĆIN") return "HOST";
  else if (roleSelectionString == "ADMINISTRATOR") return "ADMINISTRATOR";
  else if (roleSelectionString == "GOST") return "GUEST";
  return roleSelectionString;
}

function getRoleSelectionString(roleType) {
  if (roleType == "HOST") return "DOMAĆIN";
  else if (roleType == "ADMINISTRATOR") return "ADMINISTRATOR";
  else if (roleType == "GUEST") return "GOST";
  return roleType;
}

function getReservationStatus(reservationSelectionString) {
  if (reservationSelectionString == "KREIRANO") return "CREATED";
  else if (reservationSelectionString == "ODBIJENO") return "DECLINED";
  else if (reservationSelectionString == "ODUSTANAK") return "WITHDRAWN";
  else if (reservationSelectionString == "PRIHVAĆENO") return "ACCEPTED";
  else if (reservationSelectionString == "ZAVRŠENO") return "COMPLETED";
  return reservationSelectionString;
}

function getReservationSelectionString(reservationStatus) {
  if (reservationStatus == "CREATED") return "KREIRANO";
  else if (reservationStatus == "DECLINED") return "ODBIJENO";
  else if (reservationStatus == "WITHDRAWN") return "ODUSTANAK";
  else if (reservationStatus == "ACCEPTED") return "PRIHVAĆENO";
  else if (reservationStatus == "COMPLETED") return "ZAVRŠENO";
  return reservationStatus;
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

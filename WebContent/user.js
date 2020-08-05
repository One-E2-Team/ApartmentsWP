$(document).ready(function () {
  $("#login").submit(function (event) {
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
      complete: function (data, status) {
        console.log(data.responseText);
        if(status=="success"){
          validSession(JSON.parse(data.responseText))
        }
      },
    });
    event.preventDefault();
  });
});

$(document).ready(function () {
  $("#registrationForm").submit(function (event) {
    event.preventDefault();
    addHiddenClass();
    let name = document.getElementById("registerName").value;
    let surname = document.getElementById("registerSurname").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let repeatedPassword = document.getElementById("registerRepeatedPassword").value;
    if (!name)  $("#registerNameError").removeClass("d-none");
    if (!surname)  $("#registerSurnameError").removeClass("d-none")
    if (!username)  $("#registerUsernameError").removeClass("d-none");
    if (!password)  $("#registerPasswordError").removeClass("d-none");
    if (!repeatedPassword)  $("#registerRepeatedPasswordError").removeClass("d-none").text(" Ponovljena lozinka nije uneta");
    else if(password != repeatedPassword) $("#registerRepeatedPasswordError").removeClass("d-none").text(" Ponovljena lozinka se ne poklapa");
    let sexVal = document.getElementById("registerSex").value;
    let sex = "MALE";
    if (sexVal == "Ž") sex = "FEMALE";
    else if (sexVal == "POTATO") sex = "POTATO";
    let json = JSON.stringify(new Guest(username, password, name, surname, sex, "GUEST", false, null, null));

    $.ajax({
      url: "rest/user/register",
      type: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function (data) {},
    });
  });
});

$(document).ready(function () {
  $("#logout").click(function (event) {
    event.preventDefault();
    $.ajax({
      url: "rest/user/logout",
      type: "GET",
      data: "",
      contentType: "application/json",
      dataType: "json",
      complete: function (data, status) {
        if (data.responseText != "true" || status != "success") {
          $("#ModalCenter").modal();
        } else {
          window.location.href = "index.html";
        }
      },
    });
  });
});

function addHiddenClass(){
  $("#registerNameError").addClass("d-none");
  $("#registerSurnameError").addClass("d-none")
  $("#registerUsernameError").addClass("d-none");
  $("#registerPasswordError").addClass("d-none");
  $("#registerRepeatedPasswordError").addClass("d-none")
  $("#registerRepeatedPasswordError").addClass("d-none")
}


function validSession(user){
  $("#login").addClass("d-none");
  $("#registration").addClass("d-none");
  $("#profileElement").removeClass("d-none");
  $("#logoutElement").removeClass("d-none");
  $("#reservationElement").removeClass("d-none");
  var elements = document.getElementsByClassName(user.role);
  for(var element of elements) {
    element.classList.remove("d-none");
  }
}
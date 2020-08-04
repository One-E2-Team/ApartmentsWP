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
      complete: function (data) {
        console.log(data.responseText);
      },
    });
    event.preventDefault();
  });
});

$(document).ready(function () {
  $("#registrationForm").submit(function (event) {
    event.preventDefault();
    let name = document.getElementById("registerName").value;
    let surname = document.getElementById("registerSurname").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let repeatedPassword = document.getElementById("registerRepeatedPassword").value;
    if (!name)  $("#registerNameError").text(" Ime nije uneto");
    if (!surname)  $("#registerSurnameError").text(" Prezime nije uneto");
    if (!username)  $("#registerUsernameError").text(" Korisničko ime nije uneto");
    if (!password)  $("#registerPasswordError").text(" Lozinka nije uneta");
    if (!repeatedPassword)  $("#registerRepeatedPasswordError").text(" Ponovljena lozinka nije uneta");
    else if(password != repeatedPassword) $("#registerRepeatedPasswordError").text(" Ponovljena lozinka se ne poklapa");
    let sexVal = document.getElementById("registerSex").value;
    let sex = "MALE";
    if (sexVal == "Ž") sex = "FEMALE";
    else if (sexVal == "POTATO") sex = "POTATO";
    let guest = new Guest(
      username,
      password,
      name,
      surname,
      sex,
      "GUEST",
      false,
      null,
      null
    );
    let json = JSON.stringify(guest);

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

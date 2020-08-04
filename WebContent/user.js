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

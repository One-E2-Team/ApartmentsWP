$(document).ready(function () {
  $("#login").submit(function (event) {
      var username = $("input[name=loginUsername]").val();
      var password = $("input[name=loginPassword]").val();
      var userjson = JSON.stringify(new User(username, password, "", "", "MALE", "GUEST", false));
    $.ajax({
      url: "rest/user/login",
      type: "POST",
      data: userjson,
      contentType: "application/json",
      dataType: "json",
      complete: function (data) {
          alert(1);
        $("#result").html(data.responseText);
      },
    });
    event.preventDefault();
  });
});

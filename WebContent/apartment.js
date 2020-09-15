var user = null;
var apartment = null;

$(document).ready(function() {
  if (location.search)
    $.ajax({
      url: "rest/apartment/getApartment" + location.search,
      type: "GET",
      data: "",
      dataType: "",
      complete: function(data, status) {
        if (status == "nocontent") {
          alert("Pogrešni argumenti putanje");
        } else {
          apartment = JSON.parse(data.responseText);
        }
      },
    });
  else alert("Niste uneli argument putanje!");
});

function checkReservations(reservationList) {
  for (let reservation of reservationList) {
    if (reservation.apartmentId == apartment.id && (reservation.status == "COMPLETED" || reservation.status == "DECLINED"))
      $("#commentSection").removeClass("d-none");
  }
}

function showProperComments(userResponse) {
  if (userResponse == null) {
    alert("Niste ulogovani!");
    return;
  }
  user = userResponse;
  $("#commentSection").addClass("d-none");
  if (user.role == "GUEST") {
    getGuestReservations();
  }
}

$(document).ready(function() {
  $("#commentForm").submit(function(event) {
    event.preventDefault();
    let commentText = $("#apartmentComment").val();
    let mark = $("#apartmentMark").val();
    let comment = new Comment(user.username, apartment.id, parseInt(mark, 10), commentText, "WAIT");
    apartment.comments.push(comment);
    let json = JSON.stringify(apartment);
    $.ajax({
      url: "rest/apartment/editApartment",
      type: "PUT",
      data: json,
      contentType: "application/json",
      dataType: "json",
      complete: function(data, status) {
        if (status == "success") {
          alert("69");
        } else {
          alert(null);
        }
      },
    });
  });
});

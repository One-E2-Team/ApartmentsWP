var user = null;
var apartment = null;

$(document).ready(function() {
  apartment = null;
  if (location.search) {
    getApartment();
  } else alert("Niste uneli argument putanje!");
});

function getApartment() {
  if (apartment == null)
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
}

function checkReservations(reservationList) {
  for (let reservation of reservationList) {
    if (reservation.apartmentId == apartment.id && (reservation.status == "COMPLETED" || reservation.status == "DECLINED")) {
      $("#addingComment").removeClass("d-none");
      return;
    }
  }
}

function showProperComments(userResponse) {
  getApartment();
  user = userResponse;
  $("#commentList").addClass("d-none");
  $("#addingComment").addClass("d-none");
  alert(apartment.comments.length);
  if (apartment.comments.length > 0) {
    if (user == null)
      ajaxCallForComments("getAllApprovedComments");
    else if (user.role == "ADMINISTRATOR")
      ajaxCallForComments("getAllComments");
    else if (user.role == "HOST")
      ajaxCallForComments("getAllCommentsByHost");
    else if (user.role == "GUEST") {
      ajaxCallForComments("getAllApprovedComments");
      getGuestReservations();
    }
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

function ajaxCallForComments(methodName) {
  $.ajax({
    url: "rest/apartment/" + methodName + location.search,
    type: "GET",
    data: "",
    dataType: "",
    complete: function(data, status) {
      if (status == "success") {
        showComments(JSON.parse(data.responseText));
      }
    },
  });
}

function showComments(comments) {
  if (comments.length == 0)
    return;
  $("#commentList").removeClass("d-none");
  let table = document.getElementById("commentsTable");
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let comment of comments) {
    let row = document.createElement("tr");
    let guest = document.createElement("td");
    guest.innerText = comment.guestId;
    row.append(guest);
    let text = document.createElement("td");
    text.innerText = comment.text;
    row.append(text);
    let mark = document.createElement("td");
    mark.innerText = comment.mark + "/5";
    row.append(mark);
    let status = document.createElement("td");
    status.innerText = comment.status;
    row.append(status);
    table.append(row);
  }
}

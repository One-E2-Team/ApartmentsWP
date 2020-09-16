var apartment = null;

document.addEventListener("gotUser", function() {
  if (location.search) {
    getApartment();
  } else alert("Niste uneli argument putanje!");
});

function getApartment() {
  $.ajax({
    url: "rest/apartment/getApartment" + location.search,
    type: "GET",
    data: "",
    dataType: "",
    complete: function(data, status) {
      if (status == "nocontent") {
        alert("Pogrešni argumenti putanje");
      } else if (status == "success") {
        apartment = JSON.parse(data.responseText);
        showProperComments();
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

function showProperComments() {
  $("#commentList").addClass("d-none");
  $("#addingComment").addClass("d-none");
  if (user != undefined && user.role == "GUEST")
    getGuestReservations();
  if (apartment.comments.length > 0)
    showComments(apartment.comments);
}

$(document).ready(function() {
  $("#commentForm").submit(function(event) {
    event.preventDefault();
    let commentText = $("#apartmentComment").val();
    let mark = $("#apartmentMark").val();
    let comment = new Comment(user.username, apartment.id, parseInt(mark, 10), commentText, "WAIT");
    let newApartment = new Apartment(apartment.id, "INACTIVE", false, "APARTMENT", 0, 0, null, "", [comment], 0, 0, 0, "PM", "AM", [], [], [], [], []);
    let json = JSON.stringify(newApartment);
    $.ajax({
      url: "rest/apartment/addComment",
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

function showComments(comments) {
  $("#commentList").removeClass("d-none");
  let table = document.getElementById("commentsTable");
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];
    let row = document.createElement("tr");
    row.id = i;
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
    if (user != null && user.role == "HOST" && user.rentableApartmentIds.includes(apartment.id)) {
      if (comment.status == "WAIT") {
        row.append(createButtonTd("approveButton", "Prikaži"));
        row.append(createButtonTd("hideButton", "Sakrij"));
      } else if (comment.status == "APPROVED")
        row.append(createButtonTd("hideButton", "Sakrij"));
      else if (comment.status == "HIDDEN")
        row.append(createButtonTd("approveButton", "Prikaži"));
    }
    table.append(row);
  }
}

$(document).on("click", "#approveButton", function() {
  let i = $(this).parent().parent().attr("id");
  apartment.comments[i].status = "APPROVED";
  editComments();
});

$(document).on("click", "#hideButton", function() {
  let i = $(this).parent().parent().attr("id");
  apartment.comments[i].status = "HIDDEN";
  editComments();
});

function editComments() {
  let json = JSON.stringify(apartment);
  $.ajax({
    url: "rest/apartment/editComments",
    type: "PUT",
    data: json,
    contentType: "application/json",
    dataType: "json",
    complete: function(data, status) {
      if (status == "success") {
        alert("Uspeh");
        showComments(apartment.comments);
      }
    },
  });
}

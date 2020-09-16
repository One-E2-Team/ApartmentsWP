var visibleUsers = null;
document.addEventListener("gotUser", getProperUsersList);

function getProperUsersList() {
  if (user == undefined) {
    alert("Niste ulogovani!");
    return;
  }
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
        visibleUsers = JSON.parse(data.responseText);
        showUsers(visibleUsers, "visibleUsers");
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
        visibleUsers = JSON.parse(data.responseText);
        showUsers(visibleUsers, "visibleUsers");
      }
    },
  });
}

function showUsers(users, emptyTable) {
  let table = document.getElementById(emptyTable);
  while (table.children.length > 1) {
    table.removeChild(table.lastChild);
  }
  for (let user of users) {
    let row = document.createElement("tr");
    let username = document.createElement("td");
    username.innerText = user.username;
    row.append(username);
    let name = document.createElement("td");
    name.innerText = user.name;
    row.append(name);
    let surname = document.createElement("td");
    surname.innerText = user.surname;
    row.append(surname);
    let sex = document.createElement("td");
    sex.innerText = getSexSelectionString(user.sex);
    row.append(sex);
    let role = document.createElement("td");
    role.innerText = getRoleSelectionString(user.role);
    row.append(role);
    table.append(row);
  }
}

$(document).ready(function() {
  $("#searchUserForm").submit(function(event) {
    event.preventDefault();
    let username = $("#searchUsername").val();
    let name = $("#searchName").val();
    let surname = $("#searchSurname").val();
    let sex = $("#searchSex").val();
    let role = $("#searchRole").val();
    let result = [];
    for (let i = 0; i < visibleUsers.length; i++) {
      let user = visibleUsers[i];
      if (user.username.includes(username) && user.name.includes(name) && user.surname.includes(surname) &&
        (sex == "-" || sex == getSexSelectionString(user.sex)) && (role == "-" || role == getRoleSelectionString(user.role)))
        result.push(user);
    }
    showUsers(result, "searchResults");
  });
});

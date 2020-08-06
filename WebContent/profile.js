var user = null;

function populateProfileData(userResponse) {
  user = userResponse;
  $("#profileUsername").val(user.username);
  $("#profileName").val(user.name);
  $("#profileSurname").val(user.surname);
  let sex = user.sex;
  if (sex == "MALE") $("#profileSex").val("M");
  if (sex == "FEMALE") $("#profileSex").val("Ž");
  if (sex == "POTATO") $("#profileSex").val("POTATO");
}

$(document).ready(function () {
  $("#editProfileForm").submit(function (event) {
    event.preventDefault();
    addHiddenClassForEditProfile();
    let name = $("#profileName").val();
    let surname = $("#profileSurname").val();
    let oldPassword = $("#profileOldPassword").val();
    let newPassword = $("#profileNewPassword").val();
    let repeatedNewPassword = $("#profileRepeatedNewPassword").val();
    if (
      editProfileErrorExist(
        name,
        surname,
        oldPassword,
        newPassword,
        repeatedNewPassword
      )
    ) {
      reportEditProfileError(
        name,
        surname,
        oldPassword,
        newPassword,
        repeatedNewPassword
      );
      return;
    }

    let sexVal = $("#profileSex").val();
    let sex = "MALE";
    if (sexVal == "Ž") sex = "FEMALE";
    else if (sexVal == "POTATO") sex = "POTATO";
    let json = JSON.stringify(
      getProperUserType(name, surname, sex, newPassword)
    );
  });
});

function editProfileErrorExist(
  name,
  surname,
  oldPassword,
  newPassword,
  repeatedNewPassword
) {
  if (
    !name ||
    !surname ||
    !oldPassword ||
    !newPassword ||
    !repeatedNewPassword ||
    oldPassword != user.hashedPassword ||
    newPassword != repeatedNewPassword
  )
    return true;
  return false;
}

function reportEditProfileError(
  name,
  surname,
  oldPassword,
  newPassword,
  repeatedNewPassword
) {
  if (!name) $("#profileNameError").removeClass("d-none");
  if (!surname) $("#profileSurnameError").removeClass("d-none");
  if (!oldPassword)
    $("#profileOldPasswordError")
      .removeClass("d-none")
      .text("Trenutna lozinka nije uneta");
  else if (oldPassword != user.hashedPassword)
    $("#profileOldPasswordError")
      .removeClass("d-none")
      .text("Nije uneta tačna trenutna lozinka");
  if (!newPassword || !repeatedNewPassword) {
    if (!newPassword)
      $("#profileNewPasswordError")
        .removeClass("d-none")
        .text("Nova lozinka nije uneta");
    if (!repeatedNewPassword)
      $("#profileRepeatedNewPasswordError")
        .removeClass("d-none")
        .text("Ponovljena lozinka nije uneta");
  } else if (newPassword != repeatedNewPassword) {
    $("#profileRepeatedNewPasswordError")
      .removeClass("d-none")
      .text("Ponovljena lozinka se ne poklapa");
  }
}

function addHiddenClassForEditProfile() {
  $("#profileNameError").addClass("d-none");
  $("#profileSurnameError").addClass("d-none");
  $("#profileOldPasswordError").addClass("d-none");
  $("#profileNewPasswordError").addClass("d-none");
  $("#profileRepeatedNewPasswordError").addClass("d-none");
}

function getProperUserType(name, surname, sex, newPassword) {
  if (user.role == "GUEST") {
    return new Guest(
      user.username,
      newPassword,
      name,
      surname,
      sex,
      user.role,
      user.blocked,
      user.rentedApartmentIds,
      user.reservationIds
    );
  } else if (user.role == "HOST") {
    return new Host(
      user.username,
      newPassword,
      name,
      surname,
      sex,
      user.role,
      user.blocked,
      user.rentableApartmentIds
    );
  } else if (user.role == "ADMINISTRATOR") {
    return new Administrator(
      user.username,
      newPassword,
      name,
      surname,
      sex,
      user.role,
      user.blocked
    );
  } else return null;
}

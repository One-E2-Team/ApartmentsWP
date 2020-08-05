$(document).ready(function () {
  initSearchMap(function (latitude, longitude) {
    $("#latitude").val(latitude);
    $("#longitude").val(longitude);
  });
});

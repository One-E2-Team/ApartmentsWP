$(document).ready(function() {
  $.ajax({
    url: "rest/apartment/getApartment?" + getQueryParams(),
    type: "GET",
    data: "",
    dataType: "",
    complete: function(data, status) {
      if (status == "nocontent") {
        alert("Pogrešni argumenti putanje");
      }
    },
  });
});

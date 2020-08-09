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
        }
      },
    });
  else alert("Niste uneli argument putanje!");
});

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

$(document).ready(function (){
	$("#registrationForm").submit(function (event) {
		event.preventDefault();  
	    let name = document.getElementById("registerName").value;
	    let surname = document.getElementById("registerSurname").value;
	    let username = document.getElementById("registerUsername").value;
	    let password = document.getElementById("registerPassword").value;
	    let repeatedPassword = document.getElementById("registerRepeatedPassword").value;
	    if(password != repeatedPassword)    return; //TODO: error message
		if(!name || !surname || !username || !password || !repeatedPassword)   return; //TODO: error message
		let sexVal = document.getElementById("registerSex").value;
		let sex = "MALE";
		if(sexVal == "Ž")	sex = "FEMALE";
		else if(sexVal == "POTATO")	sex = "POTATO";
	    let guest = new Guest(username, password, name, surname, sex, null, false, null, null)
	    let json = JSON.stringify(guest);
	    
	    $.ajax({
			url: "rest/user/register",
			type:"POST",
			data: json,
			contentType:"application/json",
	        dataType:"json",
	        complete: function (data) {
	        	alert(69);
	          $("#result").html(data.responseText);
	        },
	    });
	});
});

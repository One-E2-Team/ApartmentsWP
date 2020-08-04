function register() {
    let registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });   
    let name = document.getElementById("registerName").value;
    let surname = document.getElementById("registerSurname").value;
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let repeatedPassword = document.getElementById("registerRepeatedPassword").value;
    if(password != repeatedPassword)    return; //TODO: error message
    if(!name || !surname || !username || !password || !repeatedPassword)   return; //TODO: error message
    
    let guest = new Guest(username, password, name, surname, document.getElementById("registerSex"), null, false, null, null)
    let json = JSON.stringify(guest);
    
    $.ajax({
		url: "/rest/user/register",
		type:"POST",
		data: json,
		contentType:"application/json",
        dataType:"json",
    });
}

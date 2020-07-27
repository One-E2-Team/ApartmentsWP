function User(username, hashedPassword, name, surname, sex, role, blocked) {
    this.username = username;
    this.hashedPassword = hashedPassword;
    this.name = name;
    this.surname = surname;
    this.sex = sex;
    this.role = role;
    this.blocked = blocked;
}

function Administrator(username, hashedPassword, name, surname, sex, role, blocked) {
    User.call(this, username, hashedPassword, name, surname, sex, role, blocked)
}

function Host(username, hashedPassword, name, surname, sex, role, blocked, rentableApartments) {
    User.call(this, username, hashedPassword, name, surname, sex, role, blocked)
    this.rentableApartments = rentableApartments;
}

function Guest(username, hashedPassword, name, surname, sex, role, blocked, rentedApartments, reservations) {
    User.call(this, username, hashedPassword, name, surname, sex, role, blocked)
    this.rentedApartments = rentedApartments;
    this.reservations = reservations;
}

function Address(street, city, number, zipcode) {
    this.street = street;
    this.city = city;
    this.number = number;
    this.zipcode = zipcode;
}

function Amenity(id, name, deleted) {
    this.id = id;
    this.name = name
    this.deleted = deleted;
}

function Comment(guest, apartmentId, mark, text, status) {
    this.guest = guest;
    this.apartmentId = apartmentId;
    this.mark = mark;
    this.text = text;
    this.status = status;
}

function Location(latitude, longitude, address) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
}

function Apartment(id, status, deleted, type, guestNum, roomNum, location, host, comments, nightStayPrice, 
    checkIn, checkOut, checkInMeridiem, checkOutMeridiem, amenities, reservations, picturePaths, rentableDates, availableDates) {
        this.id = id;
        this.status = status;
        this.deleted = deleted;
        this.type = type;
        this.guestNum = guestNum;
        this.roomNum = roomNum;
        this.location = location;
        this.host = host;
        this.comments = comments;
        this.nightStayPrice = nightStayPrice;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.checkInMeridiem = checkInMeridiem;
        this.checkOutMeridiem = checkOutMeridiem;
        this.amenities = amenities;
        this.reservations = reservations;
        this.picturePaths = picturePaths;
        this.rentableDates = rentableDates;
        this.availableDates = availableDates;
}

function Reservation(id, apartment, startDate, stayNights, totalCost, message, guest, status) {
    this.id = id;
    this.apartment = apartment;
    this.startDate = startDate;
    this.stayNights = stayNights;
    this.totalCost = totalCost;
    this.message = message;
    this.guest = guest;
    this.status = status;
}
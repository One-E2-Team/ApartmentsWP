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

function Host(username, hashedPassword, name, surname, sex, role, blocked, rentableApartmentIds) {
  User.call(this, username, hashedPassword, name, surname, sex, role, blocked)
  this.rentableApartmentIds = rentableApartmentIds;
}

function Guest(username, hashedPassword, name, surname, sex, role, blocked, rentedApartmentIds, reservationIds) {
  User.call(this, username, hashedPassword, name, surname, sex, role, blocked)
  this.rentedApartmentIds = rentedApartmentIds;
  this.reservationIds = reservationIds;
}

function Address(street, city, country, number, zipcode) {
  this.street = street;
  this.city = city;
  this.country = country;
  this.number = number;
  this.zipcode = zipcode;
}

function Amenity(id, name, deleted) {
  this.id = id;
  this.name = name
  this.deleted = deleted;
}

function Comment(guestId, apartmentId, mark, text, status) {
  this.guestId = guestId;
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

function Apartment(id, status, deleted, type, guestNum, roomNum, location, hostId, comments, nightStayPrice,
  checkIn, checkOut, checkInMeridiem, checkOutMeridiem, amenityIds, reservationIds, picturePaths, rentableDates, availableDates) {
  this.id = id;
  this.status = status;
  this.deleted = deleted;
  this.type = type;
  this.guestNum = guestNum;
  this.roomNum = roomNum;
  this.location = location;
  this.hostId = hostId;
  this.comments = comments;
  this.nightStayPrice = nightStayPrice;
  this.checkIn = checkIn;
  this.checkOut = checkOut;
  this.checkInMeridiem = checkInMeridiem;
  this.checkOutMeridiem = checkOutMeridiem;
  this.amenityIds = amenityIds;
  this.reservationIds = reservationIds;
  this.picturePaths = picturePaths;
  this.rentableDates = rentableDates;
  this.availableDates = availableDates;
}

function Reservation(id, apartmentId, startDate, stayNights, totalCost, message, guestId, status) {
  this.id = id;
  this.apartmentId = apartmentId;
  this.startDate = startDate;
  this.stayNights = stayNights;
  this.totalCost = totalCost;
  this.message = message;
  this.guestId = guestId;
  this.status = status;
}

function ApartmentDeal(deal, apartment) {
  this.deal = deal;
  this.apartment = apartment;
}

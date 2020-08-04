package beans.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ApartmentType {
	@JsonProperty("APARTMENT")
	APARTMENT, 
	@JsonProperty("ROOM")
	ROOM
}

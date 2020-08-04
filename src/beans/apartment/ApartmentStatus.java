package beans.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ApartmentStatus {
	@JsonProperty("ACTIVE")
	ACTIVE, 
	@JsonProperty("INACTIVE")
	INACTIVE
}

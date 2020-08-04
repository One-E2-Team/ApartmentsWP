package beans;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ReservationStatus {
	@JsonProperty("CREATED")
	CREATED, 
	@JsonProperty("DECLINED")
	DECLINED, 
	@JsonProperty("WITHDRAWN")
	WITHDRAWN, 
	@JsonProperty("ACCEPTED")
	ACCEPTED, 
	@JsonProperty("COMPLETED")
	COMPLETED
}

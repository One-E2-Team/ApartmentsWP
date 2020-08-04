package beans.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Meridiem {
	@JsonProperty("AM")
	AM, 
	@JsonProperty("PM")
	PM
}

package repository;

import java.util.Date;
import java.util.LinkedList;

public class NonWorkingDaysRepository {
	private static String pathPrefix = "C:/WebContent/db/";
	
	public static synchronized LinkedList<Date> get(int year){
		return (new Persistence<Date>()).read(pathPrefix + Integer.toString(year)+".json");
	}
	
	public static synchronized void set(LinkedList<Date> list, int year) {
		(new Persistence<Date>()).save(list, pathPrefix + Integer.toString(year)+".json");
	}
}

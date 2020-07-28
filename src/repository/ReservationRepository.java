package repository;

import java.util.Collection;
import java.util.LinkedList;

import beans.Reservation;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

public class ReservationRepository {

	private static ReservationRepository instance = null;
	private String path = "WebContent/db/reservations.json";
	private LinkedList<Reservation> list = null;
	private Persistence<Reservation> persistence = null;

	private ReservationRepository() {
		persistence = new Persistence<Reservation>();
		list = persistence.read(path);
	}

	public static ReservationRepository getInstance() {
		if (instance == null)
			instance = new ReservationRepository();
		return instance;
	}

	public synchronized Collection<Reservation> getAll() {
		return persistence.read(path);
	}

	public synchronized Reservation create(Reservation reservation) {
		reservation.setId(list.size()+1);
		assert(read(reservation.getId())==null);
		list.add(reservation);
		persistence.save(list, path);
		return reservation;
	}

	public synchronized Reservation read(int id) {
		for (Reservation reservation : list)
			if (reservation.getId() == id)
				return reservation;
		return null;
	}

	public synchronized void update(Reservation reservation) {
		for (int i = 0; i < list.size(); i++)
			if (list.get(i).getId() == reservation.getId()) {
				list.set(i, reservation);
				persistence.save(list, path);
				return;
			}
	}

	public synchronized void delete(int id) {
		throw new NotImplementedException();
	}
}

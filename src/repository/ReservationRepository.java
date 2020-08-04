package repository;

import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import beans.Reservation;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

public class ReservationRepository {

	private static ReservationRepository instance = null;
	private String path = "C:/WebContent/db/reservations.json";
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

	@SuppressWarnings("unchecked")
	public synchronized Collection<Reservation> getAll() {
		try {
			return Persistence.repositoryMapper.readValue(Persistence.repositoryMapper.writeValueAsString(list),
					list.getClass());
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return persistence.read(path);
	}

	public synchronized Reservation create(Reservation reservation) {
		reservation.setId(list.size() + 1);
		assert (read(reservation.getId()) == null);
		try {
			list.add(Persistence.repositoryMapper
					.readValue(Persistence.repositoryMapper.writeValueAsString(reservation), reservation.getClass()));
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		persistence.save(list, path);
		return reservation;
	}

	public synchronized Reservation read(int id) {
		for (Reservation reservation : list)
			if (reservation.getId() == id)
				try {
					return Persistence.repositoryMapper.readValue(
							Persistence.repositoryMapper.writeValueAsString(reservation), reservation.getClass());
				} catch (JsonParseException e) {
					e.printStackTrace();
					break;
				} catch (JsonMappingException e) {
					e.printStackTrace();
					break;
				} catch (JsonProcessingException e) {
					e.printStackTrace();
					break;
				} catch (IOException e) {
					e.printStackTrace();
					break;
				}
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

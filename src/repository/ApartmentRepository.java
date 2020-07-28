package repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedList;

import beans.apartment.Amenity;
import beans.apartment.Apartment;

public class ApartmentRepository {
	private static ApartmentRepository instance = null;
	private String path = "WebContent/db/apartments.json";
	private LinkedList<Apartment> apartments = new LinkedList<Apartment>();
	private Persistence<Apartment> persistance = null;

	private ApartmentRepository() {
		persistance = new Persistence<Apartment>();
		apartments = persistance.read(path);
	}

	public static ApartmentRepository getInstance() {
		if (instance == null)
			instance = new ApartmentRepository();
		return instance;
	}

	public synchronized Collection<Apartment> findAll() {
		return apartments;
	}

	public synchronized Apartment findById(int id) {
		for (Apartment apartment : apartments) {
			if (apartment.getId() == id)
				return apartment;
		}
		return null;
	}

	public synchronized Apartment create(Apartment apartment) {
		apartment.setId(getAvailableId());
		apartments.add(apartment);
		persistance.save(apartments, path);
		return apartment;
	}

	public synchronized void update(Apartment apartment) {
		Apartment old = findById(apartment.getId());
		if (old != null) {
			apartments.set(apartments.indexOf(old), apartment);
			System.out.println(apartments.indexOf(apartment) + " " + apartments.get(0).getAmenityIds().size());
			persistance.save(apartments, path);
		}
	}

	public synchronized void delete(int id) {
		Apartment deleting = findById(id);
		if (deleting != null) {
			deleting.setDeleted(true);
			update(deleting);
		}
	}

	public synchronized void deleteAmenityInApartments(Amenity amenity) {
		for (Apartment apartment : apartments) {
			if (apartment.getAmenityIds().contains(amenity.getId())) {
				ArrayList<Integer> newList = apartment.getAmenityIds();
				newList.remove(amenity.getId());
				apartment.setAmenityIds(newList);
				update(apartment);
			}
		}
	}

	private synchronized int getAvailableId() {
		int id = (apartments.size() != 0) ? (apartments.get(0).getId()) : 1;
		for (Apartment apartment : apartments) {
			if (apartment.getId() > id)
				id = apartment.getId();
		}
		return id + 1;
	}
}

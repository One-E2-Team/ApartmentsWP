package repository.persistence;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.LinkedList;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Persistence<T> {

	private static ObjectMapper mapper = new ObjectMapper();

	static {
		mapper.enableDefaultTyping();
	}

	@SuppressWarnings("unchecked")
	public LinkedList<T> read(String path) {
		LinkedList<T> ret = null;
		try {
			ret = mapper.readValue(new String(Files.readAllBytes(Paths.get(path))), (new LinkedList<T>()).getClass());
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			// TODO provjeriti sta moze da se desi u granicnim slucajevima
			e.printStackTrace();
		}
		return ret;
	}

	public void save(LinkedList<T> list, String path) {
		try (PrintWriter out = new PrintWriter(path)) {
			out.println(mapper.writeValueAsString(list));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (Exception e) {
			// TODO provjeriti sta moze da se desi u granicnim slucajevima
			e.printStackTrace();
		}
	}

	public static void saveFile(InputStream is, String path) {
		try {
			Files.copy(is, (new File(path)).toPath(), StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

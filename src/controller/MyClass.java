package controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.channels.FileChannel;
import java.util.Random;


public class MyClass {
	static String path;
	public void function1(String path) throws MalformedURLException{  

		System.out.print("myclass.function1");
		File f = new File("C:/Users/Abinaya/workspace/vi/WebContent/WEB-INF/views/conference.jsp");
		File df = new File("C:/Users/Abinaya/workspace/vi/WebContent/"+path);
		if (!f.exists()) {
			System.out.print("source no exist");
			return;
		}
		if (!df.exists()) {
			try {// créer le fichier
				df.createNewFile();
				System.out.print("file create");
			} catch (IOException e) {
				e.printStackTrace();
				System.out.print("IOException");
			}
		}

		else {
			System.out.print("file exits!");
		}
		FileChannel source = null;
		FileChannel destination = null;
		try {
			source = new FileInputStream(f).getChannel();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			System.out.print("FileNotFoundException1");
		}
		try {
			destination = new FileOutputStream(df).getChannel();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			System.out.print("FileNotFoundException2");
		}
		if (destination != null && source != null) {
			try {// copier la source sur le fichier créer
				destination.transferFrom(source, 0, source.size());
			} catch (IOException e) {
				e.printStackTrace();
				System.out.print("IOException2");
			}
		}
		if (source != null) {
			try {// fermer le fichier source
				source.close();
			} catch (IOException e) {
				e.printStackTrace();
				System.out.print("IOException3");
			}
		}
		if (destination != null) {
			try {// fermer le fichier destination
				destination.close();
			} catch (IOException e) {
				e.printStackTrace();
				System.out.print("IOException4");			}
		}
	}

	public void deleteFile(String path){
		File MyFile = new File("C:/Users/Abinaya/workspace/vi/WebContent/"+path);
		MyFile.delete(); 
	}

	static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrsuvwxyz";
	static Random rnd = new Random();

	String randomString(int len) {
		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++)
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		return sb.toString();

	}

}

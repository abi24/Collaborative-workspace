package controller;

import java.io.IOException;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/collaborative_workspace")
public class Test extends HttpServlet {
	static String path;

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// path = randomString(20);
		// request.setAttribute("url", path);

		String userPath = request.getServletPath();
		if (userPath.equals("/conference")) {
			userPath = "/conference";
		} else if (userPath.equals("/about-us")) {
			userPath = "/about_us";
		} else if (userPath.equals("/developers")) {
			userPath = "/developers";
		} else if (userPath.equals("/contacts")) {
			userPath = "/contacts";
		} else if (userPath.equals("/Collaborative-Workspace")) {
			userPath = "/index";
		} else if (userPath.equals("/shareLink")) {
			userPath = "/shareLink";
		}

		// use RequestDispatcher to forward request internally
		String url = "/WEB-INF/views" + userPath + ".jsp";

		request.getRequestDispatcher(url).forward(request, response);
	}

}

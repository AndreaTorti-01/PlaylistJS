package controllers;

import beans.User;
import dao.UserDAO;
import org.apache.commons.lang.StringEscapeUtils;
import utils.ConnectionHandler;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/CheckLogin")
@MultipartConfig
public class CheckLogin extends HttpServlet {
    private Connection connection = null;
    private UserDAO userDao;

    public CheckLogin() {
        super();
    }

    public void init() throws ServletException {
        // get servlet context
        ServletContext servletContext = getServletContext();
        // connect to database
        connection = ConnectionHandler.getConnection(servletContext);
        userDao = new UserDAO(connection);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // obtain and escape params
        String usrn;
        String pwd;

        try {
            usrn = StringEscapeUtils.escapeJava(request.getParameter("username"));
            pwd = StringEscapeUtils.escapeJava(request.getParameter("password"));
            // check che manchino dei campi
            if (usrn == null || pwd == null || usrn.isEmpty() || pwd.isEmpty()) {
                throw new Exception("Missing or empty credential value");
            }

        } catch (Exception e) {
            // for debugging only e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing credential value");
            return;
        }

        // query db to authenticate for user
        User user;
        try {
            // assegna all'oggetto user i campi recuperati eseguendo la query tramite il DAO
            user = userDao.checkCredentials(usrn, pwd);
        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not Possible to check credentials");
            return;
        }

        // If the user exists, add info to the session and go to home page, otherwise
        // show login page with error message
        if (user == null) {
            // set status to error and reply with error message
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Code 401
            response.getWriter().println("Incorrect Username or Password");
        } else {
            // set session attributes
            request.getSession().setAttribute("user", user);
            // set status to success and reply with user info in json (username)
            response.setStatus(HttpServletResponse.SC_OK); // Code 200
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().println(usrn);
        }

    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
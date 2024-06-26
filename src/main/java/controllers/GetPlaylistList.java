package controllers;

import beans.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.PlaylistDAO;
import utils.ConnectionHandler;

import javax.servlet.ServletContext;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/GetPlaylistList")
@MultipartConfig
public class GetPlaylistList extends HttpServlet {
    private Connection connection;

    public void init() {
        ServletContext context = getServletContext();

        try {
            connection = ConnectionHandler.getConnection(context);
        } catch (UnavailableException e) {
            e.printStackTrace();
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //Take the user from the session
        User user = (User) request.getSession().getAttribute("user");
        List<String> playlists = null;

        PlaylistDAO pDao = new PlaylistDAO(connection);

        try {
            playlists = pDao.getPlaylistsOf(user.getUsername());
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to recover playlists");
        }
        
        //Create the jSon with the answer
        Gson gSon = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
        String jSon = gSon.toJson(playlists);

        response.setStatus(HttpServletResponse.SC_OK);// Code 200
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(jSon);
    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


}
















package controllers;

import beans.User;
import dao.PlaylistDAO;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/AlterSongOrder")
public class AlterSongOrder extends HttpServlet {
    private Connection connection = null;
    private PlaylistDAO playlistDAO;

    public AlterSongOrder() {
        super();
    }

    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
        playlistDAO = new PlaylistDAO(connection);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // If the user is logged in correctly then set the user attribute
        User user = (User) request.getSession().getAttribute("user");

        // expect json list of strings which represent the new songs order
        List<String> newSongsOrder = (List<String>) request.getAttribute("newSongsOrder");
        // json parameter "playlistName" which represents the playlist name
        String playlistName = request.getParameter("playlistName");
        
        // TODO unfinished
    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}

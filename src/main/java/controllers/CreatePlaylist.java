package controllers;

import beans.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.PlaylistDAO;
import org.apache.commons.lang.StringEscapeUtils;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Servlet implementation class CreatePlaylist
 */
@WebServlet("/CreatePlaylist")
public class CreatePlaylist extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private PlaylistDAO playlistDAO;

    public CreatePlaylist() {
        super();

    }

    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
        playlistDAO = new PlaylistDAO(connection);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        connection = ConnectionHandler.getConnection(getServletContext());

        HttpSession session = request.getSession();

        // If the user is logged in correctly then set the user attribute
        User user = (User) session.getAttribute("user");

        // get the playlist name from the post request
        String playlistName = StringEscapeUtils.escapeJava(request.getParameter("playlistName"));


        // get the list of selected songs
        String[] selectedSongs = request.getParameterValues("songs");
        // for every song, add it to the playlist
        for (String song : selectedSongs) {
            try {
                playlistDAO.createPlaylist(user.getUsername(), song, playlistName);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        Gson gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
        String json = gson.toJson(selectedSongs);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);

    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}

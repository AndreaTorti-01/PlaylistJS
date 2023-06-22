package controllers;

import beans.User;
import dao.PlaylistDAO;
import dao.SongDAO;
import org.apache.commons.lang.StringEscapeUtils;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.Serial;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Servlet implementation class CreatePlaylist
 */
@WebServlet("/CreatePlaylist")
public class CreatePlaylist extends HttpServlet {
    @Serial
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private PlaylistDAO playlistDAO;
    private SongDAO songDAO;

    public CreatePlaylist() {
        super();

    }

    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
        playlistDAO = new PlaylistDAO(connection);
        songDAO = new SongDAO(connection);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        connection = ConnectionHandler.getConnection(getServletContext());

        // If the user is not logged in (not present in session) redirect to the login
        HttpSession session = request.getSession();

        // If the user is logged in correctly then set the user attribute
        User user = (User) session.getAttribute("user");

        // get the playlist name from the post request
        String playlistName = StringEscapeUtils.escapeJava(request.getParameter("playlistName"));

        if (playlistName.isEmpty()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No name given");
            return;
        }

        // get the list of selected songs
        String[] selectedSongs = request.getParameterValues("checkbox");
        for (String s : selectedSongs) {
            System.out.println(s);
        }
        if (selectedSongs != null) {
            int albumYear;

            java.util.Date dt = new java.util.Date();

            java.text.SimpleDateFormat sdf =
                    new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            String currentTime = sdf.format(dt);

            // for every song, add it to the playlist
            for (String song : selectedSongs) {
                try {
                    albumYear = songDAO.getSongDetails(user.getUsername(), song).getAlbumYear();
                    playlistDAO.addSong(user.getUsername(), song, playlistName, albumYear, currentTime);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        } else {
            // no songs selected
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No songs selected");
            return;
        }

        // return the user to the right view
        String ctxpath = getServletContext().getContextPath();
        String path = ctxpath + "/Home";
        response.sendRedirect(path);
    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
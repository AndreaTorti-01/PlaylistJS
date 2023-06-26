package controllers;

import beans.Song;
import beans.User;
import com.google.gson.Gson;
import dao.SongDAO;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.SQLException;

@WebServlet("/GetSongDetailsAsJson")
public class GetSongDetailsAsJson extends HttpServlet {
    private SongDAO songDAO;

    public GetSongDetailsAsJson() {
        super();
    }

    @Override
    public void init() throws ServletException {
        Connection connection = ConnectionHandler.getConnection(getServletContext());
        songDAO = new SongDAO(connection);
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) {
        // if the user is logged in correctly then set the user attribute
        User user = (User) request.getSession().getAttribute("user");

        // get the song name from the post request
        String songName = request.getParameter("songName");

        if (songName == null || songName.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/plain");
            try {
                response.getWriter().println("Missing song name");
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }

        // get the song details from the database and send them as json
        Song song;
        try {
            song = songDAO.getSongDetails(user.getUsername(), songName);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        response.setStatus(HttpServletResponse.SC_OK);
        Gson gson = new Gson();

        // convert all the song details to strings and send them as json
        String json = gson.toJson(song);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().println(json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

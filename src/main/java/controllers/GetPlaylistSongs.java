package controllers;

import beans.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.PlaylistDAO;
import org.apache.commons.lang.StringEscapeUtils;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/GetPlaylistSongs")
@MultipartConfig
public class GetPlaylistSongs extends HttpServlet {
    private PlaylistDAO playlistDAO;

    public GetPlaylistSongs() {
        super();
    }

    public void init() throws ServletException {
        Connection connection = ConnectionHandler.getConnection(getServletContext());
        playlistDAO = new PlaylistDAO(connection);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        User user = (User) request.getSession().getAttribute("user");
        String playlistName = StringEscapeUtils.escapeJava(request.getParameter("playlistName"));
        List<String> playlistSongs = null;
        try {
            playlistSongs = playlistDAO.getSongsOfPlaylistOf(user.getUsername(), playlistName);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Gson gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
        String json = gson.toJson(playlistSongs);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);

    }
}

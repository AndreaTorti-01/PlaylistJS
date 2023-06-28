package controllers;

import beans.User;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import dao.PlaylistDAO;
import org.apache.commons.lang.StringEscapeUtils;
import utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

@WebServlet("/AlterSongOrder")
@MultipartConfig
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

        // playlist name is a request parameter
        String playlistName = StringEscapeUtils.escapeJava(request.getParameter("playlistName"));

        if (playlistName.isEmpty()) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No name given");
            return;
        }

        // Retrieve JSON data from request's input stream
        BufferedReader reader = request.getReader();
        JsonArray jsonArray = new Gson().fromJson(reader, JsonArray.class);

        if (jsonArray == null) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No JSON data");
            return;
        }

        // Create a list of song names from the JSON array
        int size = jsonArray.size();
        String[] songNames = new String[size];

        for (int i = 0; i < size; i++) {
            songNames[i] = jsonArray.get(i).getAsString();
        }

        List<String> newOrder = Arrays.asList(songNames);

        try {
            playlistDAO.alterSongOrderJS(user.getUsername(), playlistName, newOrder);
        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Not possible to alter song order");
            throw new RuntimeException(e);
        }

        // SENDING 200 IS OPTIONAL, HERE I'M NOT SENDING ANYTHING
    }

    public void destroy() {
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}

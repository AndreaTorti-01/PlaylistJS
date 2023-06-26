package controllers;

import beans.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import dao.SongDAO;
import utils.ConnectionHandler;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/GetSongList")
public class GetSongList extends HttpServlet {
    private SongDAO songDAO;

    public GetSongList() {
        super();
    }

    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        Connection connection = ConnectionHandler.getConnection(getServletContext());
        songDAO = new SongDAO(connection);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        List<String> userSongs = null;
        User user = (User) request.getSession().getAttribute("user");
        try {
            userSongs = songDAO.getSongsOf(user.getUsername());
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Gson gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
        String json = gson.toJson(userSongs);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);

    }
}



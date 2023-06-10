package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.UnavailableException;

public class ConnectionHandler {

	public static Connection getConnection(ServletContext context) throws UnavailableException {
		Connection connection = null;
		try {
			// accede alle informazioni presenti nel web.xml
			String driver = context.getInitParameter("dbDriver"); 
			String url = context.getInitParameter("dbUrl");
			String user = context.getInitParameter("dbUser");
			String password = context.getInitParameter("dbPassword");
			Class.forName(driver); // non so che utilità abbia
			connection = DriverManager.getConnection(url, user, password); //esegue la connessione al database passando i parametri recuperati sopra
		} catch (ClassNotFoundException e) {
			throw new UnavailableException("Can't load database driver");
		} catch (SQLException e) {
			throw new UnavailableException("Couldn't get db connection");
		}
		return connection;
	}

	public static void closeConnection(Connection connection) throws SQLException {
		if (connection != null) {
			connection.close();
		}
	}
	
}

package com.espejo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;

public class Conexion {

    private static final String URL = "jdbc:mysql://localhost:3306/EspejoMagico?useSSL=false";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "";
    private Connection c = null;

    public Connection iniciarConexion() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");
        c = DriverManager.getConnection(URL, USERNAME, PASSWORD);
        return c;
    }

    public void terminarConexion() {
        try {
            if (c != null) {
                c.close();
            }
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Ha ocurrido el siguiente error: " + e.getMessage());
        }
    }

}
package com.espejo;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CargarEstilo extends HttpServlet {

    private static final Conexion MI_CONEXION = new Conexion();
    private static Connection c = null;
    private static PreparedStatement ps = null;
    private static ResultSet rs = null;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String estilo = request.getParameter("idEstilo");

        Blob image = null;
        byte[] imgData = null;

        try {
            c = MI_CONEXION.iniciarConexion();
            ps = c.prepareStatement(
                "SELECT E.estilo "
                + "FROM Estilo E "
                + "WHERE E.idEstilo = ?"
            );
            ps.setString(1, estilo);
            rs = ps.executeQuery();
            if (rs.next()) {
                image = rs.getBlob(1);
                imgData = image.getBytes(1, (int) image.length());
            }
            response.setContentType("image/jpeg");
            OutputStream o = response.getOutputStream();
            o.write(imgData);
            o.flush();
            o.close();
        } catch (ClassNotFoundException | IOException | SQLException e) {
            
        } finally {
            MI_CONEXION.terminarConexion();
        }
    }
}

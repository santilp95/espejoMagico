package com.espejo;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CargarEstilos extends HttpServlet {

    private static final Conexion MI_CONEXION = new Conexion();
    private static Connection c = null;
    private static PreparedStatement ps = null;
    private static ResultSet rs = null;
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        try {
            c = MI_CONEXION.iniciarConexion();
            ps = c.prepareStatement(
                "SELECT U.nombre, E.idEstilo "
                + "FROM Usuario U "
                + "INNER JOIN Estilo E ON U.idUsuario = E.idUsuario "
            );

            rs = ps.executeQuery();
            
            while (rs.next()) {
                out.println(
                    "<div class=\"estilo\">"
                    + "    <div class=\"estilo-nombre-usuario\"><span class=\"negrita\">Cliente: </span>" + rs.getString("nombre").toUpperCase() + "</div>"
                    + "    <img class=\"estilo-imagen\" src=\"CargarEstilo?idEstilo=" + rs.getString("idEstilo") + "\">"
                    + "</div>"
                );
            }
        } catch (ClassNotFoundException | SQLException e) {
            out.println("Se ha producido el siguiente error: " + e.getMessage());
        } finally {
            MI_CONEXION.terminarConexion();
        }
    }
}

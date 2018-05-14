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

public class IniciarSesion extends HttpServlet {

    private static final Conexion MI_CONEXION = new Conexion();
    private static Connection c = null;
    private static PreparedStatement ps = null;
    private static ResultSet rs = null;
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        
        try {
            c = MI_CONEXION.iniciarConexion();
            ps = c.prepareStatement(
                "SELECT U.idUsuario, U.nombre, T.tipoUsuario "
                + "FROM TipoUsuario T "
                + "INNER JOIN Usuario U ON T.idTipoUsuario = U.idTipoUsuario "
                + "WHERE U.usuario = ? AND U.contrasenia = ?"
            );
            ps.setString(1, request.getParameter("usuario"));
            ps.setString(2, request.getParameter("contrasenia"));
            rs = ps.executeQuery();
            
            if (rs.next()) {
                out.println("encontrado;" + rs.getString("idUsuario") + ";" + rs.getString("nombre") + ";" + rs.getString("tipoUsuario"));
            } else {
                out.println("noEncontrado");
            }
        } catch (ClassNotFoundException | SQLException e) {
            out.println("Se ha producido el siguiente error: " + e.getMessage());
        } finally {
            MI_CONEXION.terminarConexion();
        }
    }
}

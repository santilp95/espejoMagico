package com.espejo;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

public class GuardarPeinado extends HttpServlet {

    private static final Conexion MI_CONEXION = new Conexion();
    private static Connection c = null;
    private static PreparedStatement ps = null;
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/plain");
        PrintWriter out = response.getWriter();
        
        try {
            Part filePart = request.getPart("peinado");
            int idUsuario = Integer.parseInt(request.getParameter("idUsuario"));
            
            c = MI_CONEXION.iniciarConexion();
            ps = c.prepareStatement(
                "INSERT INTO Estilo(estilo, idUsuario) VALUES "
                + "(?, ?)"
            );
            
            if (filePart != null) {
                InputStream inputStream = filePart.getInputStream();
                ps.setBlob(1, inputStream);
            }
            ps.setInt(2, idUsuario);
            
            ps.executeUpdate();
            
            out.println("correcto");
        } catch (IOException | ClassNotFoundException | SQLException | ServletException e) {
            out.println("Error: " + e.getMessage());
        } finally {
            MI_CONEXION.terminarConexion();
        }
    }
}

package com.restapi;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DATArepo {

    Connection con = null;

    public DATArepo() {

        String url = getEnvOrDefault("DB_URL", "jdbc:mysql://localhost:3306/RESTDATA");
        String username = getEnvOrDefault("DB_USER", "root");
        String password = resolvePassword();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            con = DriverManager.getConnection(
                    url, username, password
            );

            System.out.println("Database connected!");

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // READ ALL
    public List<DATA> getDATAs() {

        List<DATA> DATAs = new ArrayList<>();

        String query = "SELECT * FROM DATA";

        if (con == null) {
            System.out.println("Database connection unavailable");
            return DATAs;
        }

        try (PreparedStatement ps = con.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {

                int id = rs.getInt("DATA_id");
                String name = rs.getString("DATA_name");
                int age = rs.getInt("DATA_age");
                String address = rs.getString("DATA_address");

                DATA d = new DATA(id, name, age, address);

                DATAs.add(d);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return DATAs;
    }

    // CREATE
    public void create(DATA d1) {

        String query = "INSERT INTO DATA " +
                "(DATA_id, DATA_name, DATA_age, DATA_address) " +
                "VALUES (?, ?, ?, ?)";
        if (con == null) {
            System.out.println("Database connection unavailable");
            return;
        }
        try (PreparedStatement ps = con.prepareStatement(query)) {

            ps.setInt(1, d1.getId());
            ps.setString(2, d1.getName());
            ps.setInt(3, d1.getAge());
            ps.setString(4, d1.getAddress());

            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // UPDATE
    public void update(DATA d1) {

        String query = "UPDATE DATA SET DATA_name = ?, " +
                "DATA_age = ?, DATA_address = ? WHERE DATA_id = ?";
        if (con == null) {
            System.out.println("Database connection unavailable");
            return;
        }
        try (PreparedStatement ps = con.prepareStatement(query)) {

            ps.setString(1, d1.getName());
            ps.setInt(2, d1.getAge());
            ps.setString(3, d1.getAddress());
            ps.setInt(4, d1.getId());

            System.out.println("Updating ID: " + d1.getId());

            int rows = ps.executeUpdate();

            System.out.println("Rows affected: " + rows);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // DELETE
    public void delete(int id) {

        String query = "DELETE FROM DATA WHERE DATA_id = ?";
        if (con == null) {
            System.out.println("Database connection unavailable");
            return;
        }
        try (PreparedStatement ps = con.prepareStatement(query)) {

            ps.setInt(1, id);

            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static String getEnvOrDefault(String name, String defaultValue) {
        String value = System.getenv(name);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    private static String resolvePassword() {
        for (String key : new String[]{"DB_PASSWORD", "MYSQL_PASSWORD", "pwd"}) {
            String value = System.getenv(key);
            if (value != null && !value.isEmpty()) {
                return value;
            }
        }
        return null;
    }
}

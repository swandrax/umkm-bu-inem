package com.ibuinem.pos.utils;

import com.ibuinem.pos.config.DatabaseConfig;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

public class DatabaseBackupUtil {

    public static boolean backupDatabase(File outputFile) {
        String[] tables = {"users", "categories", "products", "customers", "packages", "package_benefits", "sales", "sale_details", "payments", "shipping", "delivery_logs"};

        try (Connection conn = DatabaseConfig.getConnection();
             PrintWriter writer = new PrintWriter(new FileWriter(outputFile))) {

            writer.println("-- ========================================================");
            writer.println("-- SQL Database Backup: jajanan_ibu_inem");
            writer.println("-- Generated At: " + java.time.LocalDateTime.now());
            writer.println("-- ========================================================\n");
            writer.println("SET FOREIGN_KEY_CHECKS = 0;\n");

            for (String table : tables) {
                try (Statement stmt = conn.createStatement();
                     ResultSet rs = stmt.executeQuery("SELECT * FROM `" + table + "`")) {

                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();

                    writer.println("-- Table: " + table);
                    writer.println("TRUNCATE TABLE `" + table + "`;");

                    while (rs.next()) {
                        StringBuilder sql = new StringBuilder("INSERT INTO `" + table + "` VALUES (");
                        for (int i = 1; i <= columnCount; i++) {
                            Object val = rs.getObject(i);
                            if (val == null) {
                                sql.append("NULL");
                            } else if (val instanceof Number) {
                                sql.append(val);
                            } else {
                                String strVal = val.toString().replace("'", "''");
                                sql.append("'").append(strVal).append("'");
                            }
                            if (i < columnCount) sql.append(", ");
                        }
                        sql.append(");");
                        writer.println(sql.toString());
                    }
                    writer.println();
                }
            }

            writer.println("SET FOREIGN_KEY_CHECKS = 1;");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}

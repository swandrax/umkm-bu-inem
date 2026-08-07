package com.ibuinem.pos.dao;

import com.ibuinem.pos.config.DatabaseConfig;
import com.ibuinem.pos.model.PackageModel;
import com.ibuinem.pos.model.PackageBenefit;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PackageDAO {

    public List<PackageModel> getAllActive() {
        List<PackageModel> pkgs = new ArrayList<>();
        String sql = "SELECT * FROM packages WHERE active = 1 ORDER BY price ASC";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                PackageModel p = new PackageModel();
                p.setId(rs.getInt("id"));
                p.setName(rs.getString("name"));
                p.setPrice(rs.getBigDecimal("price"));
                p.setDescription(rs.getString("description"));
                p.setActive(rs.getBoolean("active"));
                pkgs.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pkgs;
    }

    public List<PackageModel> getAll() {
        List<PackageModel> pkgs = new ArrayList<>();
        String sql = "SELECT * FROM packages ORDER BY id DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                PackageModel p = new PackageModel();
                p.setId(rs.getInt("id"));
                p.setName(rs.getString("name"));
                p.setPrice(rs.getBigDecimal("price"));
                p.setDescription(rs.getString("description"));
                p.setActive(rs.getBoolean("active"));
                pkgs.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return pkgs;
    }

    public boolean insert(PackageModel pkg) {
        String sql = "INSERT INTO packages (name, price, description, active) VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, pkg.getName());
            ps.setBigDecimal(2, pkg.getPrice());
            ps.setString(3, pkg.getDescription());
            ps.setBoolean(4, pkg.isActive());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean update(PackageModel pkg) {
        String sql = "UPDATE packages SET name = ?, price = ?, description = ?, active = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, pkg.getName());
            ps.setBigDecimal(2, pkg.getPrice());
            ps.setString(3, pkg.getDescription());
            ps.setBoolean(4, pkg.isActive());
            ps.setInt(5, pkg.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean addBenefit(int packageId, String detail) {
        String sql = "INSERT INTO package_benefits (package_id, benefit_detail) VALUES (?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, packageId);
            ps.setString(2, detail);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<PackageBenefit> getBenefits(int packageId) {
        List<PackageBenefit> benefits = new ArrayList<>();
        String sql = "SELECT * FROM package_benefits WHERE package_id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, packageId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    PackageBenefit b = new PackageBenefit();
                    b.setId(rs.getInt("id"));
                    b.setPackageId(rs.getInt("package_id"));
                    b.setBenefitDetail(rs.getString("benefit_detail"));
                    benefits.add(b);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return benefits;
    }
}

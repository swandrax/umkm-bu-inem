package com.ibuinem.pos.service;

import com.ibuinem.pos.dao.PackageDAO;
import com.ibuinem.pos.model.PackageBenefit;
import com.ibuinem.pos.model.PackageModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PackageService {
    private final PackageDAO packageDAO = new PackageDAO();

    public List<PackageModel> getAllPackages() {
        return packageDAO.getAll();
    }

    public List<PackageModel> getAllActive() {
        return packageDAO.getAllActive();
    }

    public List<PackageBenefit> getBenefits(int packageId) {
        return packageDAO.getBenefits(packageId);
    }

    public boolean savePackage(PackageModel pkg) {
        if (pkg.getId() == 0) {
            return packageDAO.insert(pkg);
        } else {
            return packageDAO.update(pkg);
        }
    }

    public boolean addBenefit(int packageId, String detail) {
        return packageDAO.addBenefit(packageId, detail);
    }
}

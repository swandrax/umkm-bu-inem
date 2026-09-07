package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.model.PackageBenefit;
import com.ibuinem.pos.model.PackageModel;
import com.ibuinem.pos.service.PackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/packages")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PackageModel>>> getAllPackages() {
        List<PackageModel> packages = packageService.getAllPackages();
        return ResponseEntity.ok(ApiResponse.success("Daftar paket berhasil diambil", packages));
    }

    @GetMapping("/{id}/benefits")
    public ResponseEntity<ApiResponse<List<PackageBenefit>>> getBenefits(@PathVariable int id) {
        List<PackageBenefit> benefits = packageService.getBenefits(id);
        return ResponseEntity.ok(ApiResponse.success("Benefit paket berhasil diambil", benefits));
    }
}

package com.ibuinem.pos.controller;

import com.ibuinem.pos.dao.SaleDAO;
import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dto.sales.SaleResponseDto;
import com.ibuinem.pos.model.Sale;
import com.ibuinem.pos.service.SaleService;
import com.ibuinem.pos.utils.ExcelExporter;
import com.ibuinem.pos.utils.PdfExporter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final SaleService saleService;
    private final SaleDAO saleDAO = new SaleDAO();

    public ReportController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate target = date != null ? date : LocalDate.now();
        List<SaleResponseDto> sales = saleService.searchSalesDtos(target, target, null);

        Map<String, Object> report = new HashMap<>();
        report.put("period", "Harian - " + target);
        report.put("sales", sales);
        report.put("totalTransactions", sales.size());

        return ResponseEntity.ok(ApiResponse.success("Laporan harian berhasil diambil", report));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getWeeklyReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusDays(6);
        LocalDate end = start.plusDays(6);
        List<SaleResponseDto> sales = saleService.searchSalesDtos(start, end, null);

        Map<String, Object> report = new HashMap<>();
        report.put("period", "Mingguan (" + start + " s/d " + end + ")");
        report.put("sales", sales);
        report.put("totalTransactions", sales.size());

        return ResponseEntity.ok(ApiResponse.success("Laporan mingguan berhasil diambil", report));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        int yr = year != null ? year : LocalDate.now().getYear();
        int mo = month != null ? month : LocalDate.now().getMonthValue();
        LocalDate start = LocalDate.of(yr, mo, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        List<SaleResponseDto> sales = saleService.searchSalesDtos(start, end, null);

        Map<String, Object> report = new HashMap<>();
        report.put("period", "Bulanan (" + mo + "/" + yr + ")");
        report.put("sales", sales);
        report.put("totalTransactions", sales.size());

        return ResponseEntity.ok(ApiResponse.success("Laporan bulanan berhasil diambil", report));
    }

    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Sale> sales = saleDAO.searchSales(start, end, null);
        String title = start.toString().equals(end.toString()) ? start.toString() : start + " s/d " + end;

        byte[] pdfBytes = PdfExporter.exportSalesReportToPdfBytes(sales, title);
        if (pdfBytes == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "laporan-penjualan-" + start + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping(value = "/export/excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        List<Sale> sales = saleDAO.searchSales(start, end, null);

        byte[] excelBytes = ExcelExporter.exportSalesToExcelBytes(sales);
        if (excelBytes == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "laporan-penjualan-" + start + ".xlsx");

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    @GetMapping(value = "/export/csv", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        LocalDate start = startDate != null ? startDate : LocalDate.now().minusDays(6);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        byte[] csvBytes = com.ibuinem.pos.utils.BmcCsvExporter.exportWeeklyBmcCsv(start, end);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
        headers.setContentDispositionFormData("attachment", "bmc-weekly-analytics-" + start + "_sd_" + end + ".csv");

        return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
    }
}

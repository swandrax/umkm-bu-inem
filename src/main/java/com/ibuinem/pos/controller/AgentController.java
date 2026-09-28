package com.ibuinem.pos.controller;

import com.ibuinem.pos.dto.common.ApiResponse;
import com.ibuinem.pos.dao.BusinessSettingsDAO;
import com.ibuinem.pos.dao.ProductDAO;
import com.ibuinem.pos.dao.ServiceProductDAO;
import com.ibuinem.pos.model.BusinessSettings;
import com.ibuinem.pos.model.Product;
import com.ibuinem.pos.model.ServiceProduct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/agent")
@CrossOrigin(origins = "*")
public class AgentController {

    private final BusinessSettingsDAO businessSettingsDAO = new BusinessSettingsDAO();
    private final ServiceProductDAO serviceProductDAO = new ServiceProductDAO();
    private final ProductDAO productDAO = new ProductDAO();

    @GetMapping("/graph")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKnowledgeGraph() {
        Map<String, Object> graph = new HashMap<>();
        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();

        // Store Node
        BusinessSettings settings = businessSettingsDAO.getSettings();
        String storeId = "store_main";
        Map<String, Object> storeNode = new HashMap<>();
        storeNode.put("id", storeId);
        storeNode.put("type", "STORE");
        storeNode.put("label", settings != null && settings.getBusinessName() != null ? settings.getBusinessName() : "Jajanan Ibu Inem");
        Map<String, Object> storeProps = new HashMap<>();
        storeProps.put("address", settings != null && settings.getAddress() != null ? settings.getAddress() : "Pasar Kuliner Tradisional Yogyakarta");
        storeProps.put("phone", settings != null && settings.getPhone() != null ? settings.getPhone() : "0812-3456-7890");
        storeProps.put("whatsapp", settings != null && settings.getWhatsapp() != null ? settings.getWhatsapp() : "0812-3456-7890");
        storeProps.put("operatingHours", "07:00 - 21:00 WIB");
        storeNode.put("properties", storeProps);
        nodes.add(storeNode);

        // Services Nodes
        List<ServiceProduct> services = serviceProductDAO.getAll(true, null);
        for (ServiceProduct s : services) {
            String sId = "srv_" + s.getId();
            Map<String, Object> sNode = new HashMap<>();
            sNode.put("id", sId);
            sNode.put("type", "SERVICE");
            sNode.put("label", s.getName());
            Map<String, Object> sProps = new HashMap<>();
            sProps.put("price", s.getFinalPrice());
            sProps.put("duration", s.getDuration());
            sProps.put("features", s.getFeatures());
            sNode.put("properties", sProps);
            nodes.add(sNode);

            Map<String, Object> edge = new HashMap<>();
            edge.put("source", storeId);
            edge.put("target", sId);
            edge.put("relation", "OFFERS");
            edges.add(edge);
        }

        // Product Nodes (Public products)
        List<Product> products = productDAO.getAllActive();
        for (Product p : products) {
            String pId = "prod_" + p.getId();
            Map<String, Object> pNode = new HashMap<>();
            pNode.put("id", pId);
            pNode.put("type", "PRODUCT");
            pNode.put("label", p.getName());
            Map<String, Object> pProps = new HashMap<>();
            pProps.put("price", p.getPrice());
            pProps.put("stock", p.getStock());
            pProps.put("code", p.getCode());
            pNode.put("properties", pProps);
            nodes.add(pNode);

            Map<String, Object> edge = new HashMap<>();
            edge.put("source", storeId);
            edge.put("target", pId);
            edge.put("relation", "SELLS");
            edges.add(edge);
        }

        graph.put("nodes", nodes);
        graph.put("edges", edges);
        graph.put("totalNodes", nodes.size());
        graph.put("totalEdges", edges.size());

        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil knowledge graph", graph));
    }
}

package com.chefmanager.controller;
import com.chefmanager.model.*;
import com.chefmanager.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/receipts")
public class ReceiptController {
  private final ReceiptRepository receiptRepo;
  private final ReceiptItemRepository itemRepo;
  private final SupplierRepository supplierRepo;
  private final InventoryLotRepository lotRepo;
  private final InventoryMovementRepository movRepo;
  private final ProductRepository productRepo;
  public ReceiptController(ReceiptRepository r, ReceiptItemRepository i, SupplierRepository s, InventoryLotRepository l, InventoryMovementRepository m, ProductRepository p){
    this.receiptRepo=r; this.itemRepo=i; this.supplierRepo=s; this.lotRepo=l; this.movRepo=m; this.productRepo=p;
  }
  @GetMapping public List<Receipt> all(){ return receiptRepo.findAll(); }
  @PostMapping public Receipt create(@RequestBody Map<String,Object> payload){
    Long supplierId = ((Number)payload.get("supplierId")).longValue();
    Supplier supplier = supplierRepo.findById(supplierId).orElseThrow();
    Receipt r = new Receipt(); r.setSupplier(supplier); r.setStatus("CREATED");
    return receiptRepo.save(r);
  }
  @PostMapping("/{id}/items") public ReceiptItem addItem(@PathVariable Long id, @RequestBody ReceiptItem item){
    Receipt r = receiptRepo.findById(id).orElseThrow();
    item.setReceipt(r);
    return itemRepo.save(item);
  }
  @PostMapping("/{id}/confirm") @Transactional
  public Receipt confirm(@PathVariable Long id){
    Receipt r = receiptRepo.findById(id).orElseThrow();
    List<ReceiptItem> items = itemRepo.findAll().stream().filter(it -> it.getReceipt().getId().equals(id)).toList();
    for(ReceiptItem it: items){
      InventoryLot lot = new InventoryLot();
      lot.setProduct(it.getProduct());
      lot.setLotCode(it.getLotCode());
      lot.setQuantity(it.getQuantity());
      lot.setExpiryDate(it.getExpiryDate());
      lotRepo.save(lot);
      InventoryMovement mov = new InventoryMovement();
      mov.setProduct(it.getProduct());
      mov.setLot(lot);
      mov.setQuantity(Math.max(it.getQuantity(),0d));
      mov.setType("IN");
      mov.setRef("RECEIPT#"+id);
      movRepo.save(mov);
    }
    r.setStatus("CONFIRMED");
    return r;
  }
}

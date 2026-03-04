package com.chefmanager.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String u = body.getOrDefault("username","");
        String p = body.getOrDefault("password","");
        if("admin".equals(u) && "admin123".equals(p)){
            return ResponseEntity.ok(Map.of("token","demo-token","role","ADMIN"));
        }
        return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
    }
}

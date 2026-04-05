package com.paylance.paylance_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "🚀 Paylance Backend Running!";
    }

    @GetMapping("/test")
    public String test() {
        return "API is working!";
    }
}
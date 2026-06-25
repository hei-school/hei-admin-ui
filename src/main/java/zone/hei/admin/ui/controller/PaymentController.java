package zone.hei.admin.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    @GetMapping
    public String displayPaymentPage() {
        return "payment";
    }
}

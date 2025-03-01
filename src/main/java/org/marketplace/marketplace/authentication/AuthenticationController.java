package org.marketplace.marketplace.authentication;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@CrossOrigin
public class AuthenticationController {

	@GetMapping
	public String index(Model model, Authentication user){
		model.addAttribute("user", user);
		return "index";
	}

}

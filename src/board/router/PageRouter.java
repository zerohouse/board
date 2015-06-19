package board.router;

import next.route.annotation.Router;
import next.route.annotation.When;

@Router
public class PageRouter {

	@When("/*")
	public String reponse() {
		return "forward:/index.html";
	}
}

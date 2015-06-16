package board.router;

import next.bind.annotation.Bind;
import next.jdbc.mysql.DAO;
import next.route.Methods;
import next.route.annotation.Router;
import next.route.annotation.When;
import board.model.User;

@Router
@When("/api/user")
public class UserRouter {

	@Bind
	DAO dao;

	@When(method = Methods.POST)
	public boolean register(User user) {
		if (dao.insert(user))
			return true;
		return false;
	}

	@When(value = "/login", method = Methods.POST)
	public boolean login(User user) {
		if (dao.find(user) == null)
			return false;
		return true;
	}

}

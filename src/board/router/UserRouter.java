package board.router;

import javax.servlet.http.HttpSession;

import next.bind.annotation.Bind;
import next.jdbc.mysql.DAO;
import next.route.Methods;
import next.route.annotation.Router;
import next.route.annotation.When;
import next.route.parameter.annotation.SessionAttr;
import board.model.User;

@Router
@When("/api/user")
public class UserRouter {

	@Bind
	DAO dao;

	private static final String USER = "user";

	@When(method = Methods.POST)
	public boolean register(User user) {
		if (dao.insert(user))
			return true;
		return false;
	}

	@When(method = Methods.GET)
	public User session(@SessionAttr User user) {
		return user;
	}

	@When(value = "/login", method = Methods.POST)
	public boolean login(User user, HttpSession session) {
		User fromDB = dao.find(user);
		if (fromDB == null)
			return false;
		session.setAttribute(USER, fromDB);
		return true;
	}

	@When(value = "/logout", method = Methods.GET)
	public boolean logout(HttpSession session) {
		session.removeAttribute(USER);
		return true;
	}
}

package board.router;

import java.util.List;

import next.bind.annotation.Bind;
import next.jdbc.mysql.DAO;
import next.route.Methods;
import next.route.annotation.Router;
import next.route.annotation.When;
import next.route.parameter.annotation.Require;
import next.route.parameter.annotation.SessionAttr;
import board.exception.SessionNullException;
import board.model.Post;
import board.model.User;

@Router
@When("/api/post")
public class PostRouter {

	@Bind
	DAO dao;

	@When(method = Methods.POST)
	public boolean writePost(Post post, @SessionAttr @Require(SessionNullException.class) User user) {
		post.setWriter(user.getEmail());
		return dao.insert(post);
	}

	@When(method = Methods.PUT)
	public boolean updatePost(Post post, @SessionAttr User user) {
		return dao.update(post);
	}

	@When(method = Methods.GET)
	public List<Post> getPost(Post post) {
		return dao.findList(post);
	}

	@When(method = Methods.DELETE)
	public boolean deletePost(Post post, @SessionAttr @Require(SessionNullException.class) User user) {
		post.setWriter(user.getEmail());
		return dao.delete(post);
	}
}

package board.router;

import java.util.Date;
import java.util.List;

import next.bind.annotation.Bind;
import next.jdbc.mysql.DAO;
import next.jdbc.mysql.Transaction;
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
	public Object writePost(Post post, @SessionAttr @Require(SessionNullException.class) User user) {
		post.setWriter(user.getEmail());
		post.setDate(new Date());
		DAO dao = new DAO(new Transaction());
		dao.insert(post);
		Object id = dao.getRecordAsList("select last_insert_id()").get(0);
		dao.close();
		return id;
	}

	@When(method = Methods.PUT)
	public boolean updatePost(Post post, @SessionAttr User user) {
		post.setWriter(user.getEmail());
		post.setDate(new Date());
		return dao.update(post, "writer", "id");
	}

	@When(value = "/list", method = Methods.GET)
	public List<Post> getPosts(@Require String subject, Integer start, Integer size) {
		return dao.getSelectQuery(Post.class).select("id", "subject", "title", "writer", "date").whereField("subject").equal(subject).orderBy("id", true)
				.limit(start, size).findList();
	}

	@When(method = Methods.GET)
	public Post getPost(Post post) {
		return dao.find(post);
	}

	@When(method = Methods.DELETE)
	public boolean deletePost(Post post, @SessionAttr @Require(SessionNullException.class) User user) {
		post.setWriter(user.getEmail());
		return dao.delete(post, "id", "writer");
	}
}

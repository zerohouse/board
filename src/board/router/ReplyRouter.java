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
import board.model.Reply;
import board.model.User;

@Router
@When("/api/reply")
public class ReplyRouter {

	@Bind
	DAO dao;

	@When(method = Methods.GET)
	public List<Reply> getReplies(Integer postId, Integer depth, Integer start, Integer size) {
		return dao.getSelectQuery(Reply.class).select("*").whereField("postId").equal(postId).and().field("depth").equal(depth).orderBy("id", true)
				.limit(start, size).findList();
	}

	@When(method = Methods.PUT)
	public boolean updateReply(Reply reply, @SessionAttr User user) {
		reply.setWriter(user.getEmail());
		return dao.update(reply, "writer", "id");
	}

	@When(method = Methods.DELETE)
	public boolean deleteReply(Reply reply, @SessionAttr @Require(SessionNullException.class) User user) {
		reply.setWriter(user.getEmail());
		return dao.delete(reply, "writer", "id");
	}

	@When(method = Methods.POST)
	public boolean writeReply(Reply reply, @SessionAttr @Require(SessionNullException.class) User user) {
		reply.setWriter(user.getEmail());
		return dao.insert(reply);
	}

}

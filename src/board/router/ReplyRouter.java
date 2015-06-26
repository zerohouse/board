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
import board.model.Reply;
import board.model.User;

@Router
@When("/api/reply")
public class ReplyRouter {

	@Bind
	DAO dao;

	@When(method = Methods.GET)
	public List<Reply> getReplies(Integer postId, Integer depth, Integer start, Integer size) {
		return dao.getSelectQuery(Reply.class).select("*").field("postId").equal(postId).orderBy("id", true).limit(start, size).findList();
	}

	@When(method = Methods.PUT)
	public boolean updateReply(Reply reply, @SessionAttr User user) {
		reply.setWriter(user.getEmail());
		reply.setDate(new Date());
		return dao.update(reply, "writer", "id");
	}

	@When(method = Methods.DELETE)
	public boolean deleteReply(Reply reply, @SessionAttr @Require(SessionNullException.class) User user) {
		reply.setWriter(user.getEmail());
		return dao.delete(reply, "writer", "id");
	}

	@When(method = Methods.POST)
	public Reply writeReply(Reply reply, @SessionAttr @Require(SessionNullException.class) User user) {
		DAO dao = new DAO(new Transaction());
		reply.setWriter(user.getEmail());
		reply.setDate(new Date());
		dao.insert(reply);
		Object id = dao.getRecordAsList("select last_insert_id()").get(0);
		reply.setId(Integer.parseInt(id.toString()));
		dao.close();
		return reply;
	}

}

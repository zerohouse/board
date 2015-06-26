package board.router;

import java.util.List;
import java.util.Map;

import board.model.Post;
import next.bind.annotation.Bind;
import next.jdbc.mysql.DAO;
import next.route.Methods;
import next.route.annotation.Router;
import next.route.annotation.When;

@Router
@When("/api/search")
public class SearchRouter {

	@Bind
	DAO dao;

	@When(method = Methods.GET)
	public List<Map<String, Object>> searchBoard(String keyword) {
		return dao.getSelectQuery(Post.class).select("subject").select("count(*) as count").orderBy("count", true).limit(0, 3).groupBy("subject")
				.field("subject").like(keyword).asMapList();
	}
}

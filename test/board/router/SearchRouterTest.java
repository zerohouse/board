package board.router;

import next.jdbc.mysql.DAO;

import org.junit.Test;

import board.model.Post;
import board.model.User;

public class SearchRouterTest {

	@Test
	public void test() {
		DAO dao = new DAO();
		System.out.println(dao.getSelectQuery(Post.class).select("subject").select("count(*) as count").orderBy("count", true).limit(0, 3).groupBy("subject")
				.whereField("subject").like("1234").asMapList());
	}

	@Test
	public void test2() {
		DAO dao = new DAO();
		dao.delete(new User(), "email", "password");
	}
}

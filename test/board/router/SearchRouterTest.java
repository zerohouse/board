package board.router;

import next.jdbc.mysql.DAO;

import org.junit.Test;

import board.model.Post;

public class SearchRouterTest {

	@Test
	public void test() {
		DAO dao = new DAO();
		System.out.println(dao.getSelectQuery(Post.class).select("subject").select("count(*) as count").orderBy("count", true).limit(0, 3).groupBy("subject")
				.field("subject").like("1234").asMapList());
	}

	@Test
	public void test2() {
		System.out.println("한글".matches("([a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+)"));
	}
}

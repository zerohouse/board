package board.model;

import java.util.Date;

import next.jdbc.mysql.annotation.Key;
import next.jdbc.mysql.annotation.Table;

@Table
public class Post {

	@Key(AUTO_INCREMENT = true)
	private Integer id;
	private String subject;
	private String writer;
	private String title;
	private String body;
	private Date date;

	public Integer getId() {
		return id;
	}

	public String getSubject() {
		return subject;
	}

	public String getTitle() {
		return title;
	}

	public void setWriter(String writer) {
		this.writer = writer;
	}

	public String getBody() {
		return body;
	}

	public Date getDate() {
		return date;
	}

	public String getWriter() {
		return writer;
	}

}

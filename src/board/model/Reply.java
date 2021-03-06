package board.model;

import java.util.Date;

import next.jdbc.mysql.annotation.Key;
import next.jdbc.mysql.annotation.Table;

@Table
public class Reply {

	@Key(AUTO_INCREMENT = true)
	private Integer id;
	private Integer postId;
	private String writer;
	private String reply;
	private Date date;

	public void setWriter(String writer) {
		this.writer = writer;
	}

	public Integer getId() {
		return id;
	}

	public Integer getPostId() {
		return postId;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getWriter() {
		return writer;
	}

	public String getReply() {
		return reply;
	}

	public Date getDate() {
		return date;
	}

	public void setId(Integer id) {
		this.id = id;
	}


}

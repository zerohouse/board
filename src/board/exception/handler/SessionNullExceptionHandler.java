package board.exception.handler;

import board.exception.SessionNullException;
import next.route.exception.ExceptionHandler;
import next.route.exception.Handle;
import next.route.http.Http;

@Handle(SessionNullException.class)
public class SessionNullExceptionHandler implements ExceptionHandler {

	@Override
	public void handle(Http http, Exception e) {
		http.sendError(401, "Session Expired");
	}

}

package filters;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class LoginChecker implements Filter {


    public void init(FilterConfig fConfig) throws ServletException {
        // TODO Auto-generated method stub
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        System.out.print("Login checker filter executing ...\n");

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String loginPath = "index.html";

        HttpSession s = req.getSession();
        if (s.isNew() || s.getAttribute("user") == null) {
            res.setStatus(HttpServletResponse.SC_FORBIDDEN);//Code 403
            // se l'utente non è autenticato, reindirizza a index
            res.setHeader("Location", loginPath);
            System.out.print("Login checker FAILED...\n");
            return;
        }

        chain.doFilter(request, response);
    }

    public void destroy() {
        // TODO Auto-generated method stub
    }

}
package com.precisely.pem.filter;

import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Order(value = Ordered.HIGHEST_PRECEDENCE)
@Component
@Log4j2
@WebFilter(filterName = "TenantFilter", urlPatterns = "/*")
public class TenantFilter extends OncePerRequestFilter {

    @Autowired
    private UserService sponsorService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try  {
            String sponsorContext = getSponsorContextFromURL(request);

            //Extract Company Name from DB and add into ThreadContext
            setSponsorDetailsInContext(sponsorContext);

            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } finally {
            // Clear MDC context when request completes
            TenantContext.clear();
            ThreadContext.clearAll();
        }
    }

    private static String getSponsorContextFromURL(HttpServletRequest request) {
        StringBuffer url = request.getRequestURL();

        Pattern pattern = Pattern.compile("/sponsors/([^/]+)");
        Matcher matcher = pattern.matcher(url);

        // Checking if the pattern is found in the URL
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "";
    }

    private void setSponsorDetailsInContext(String sponsorContext) {
       SponsorInfo sponsorInfo = sponsorService.getActiveSponsorNameBySponsorContext(sponsorContext);
       if(Objects.nonNull(sponsorInfo) && !StringUtils.isEmpty(sponsorInfo.getCompanyName())){
           // Set MDC context for logging here
           ThreadContext.put("sponsor.name", sponsorInfo.getCompanyName());
           //Set Tenant Information in TenantContext to be used in Controller Layers
           TenantContext.setTenantContext(sponsorInfo);
       }else {
           log.debug("No sponsor found with sponsor context : {}, Using None as the sponsor's name.",sponsorContext);
           ThreadContext.put("sponsor.name", "None");
       }
    }
}

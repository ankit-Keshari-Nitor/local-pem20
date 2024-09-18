<%@ page import = "java.util.ResourceBundle" %>
<%@ page import="java.io.FileInputStream, java.io.IOException, java.util.Properties" %>
<%!
    private Properties loadProperties(String path) throws IOException {
        Properties properties = new Properties();
        try (FileInputStream fis = new FileInputStream(path)) {
            properties.load(fis);
        }
        return properties;
    }
%>
<%
    String propertiesFilePath = "config.properties"; // Update with the actual path
    Properties properties = loadProperties(propertiesFilePath);
    String pemBackendBaseUrl = properties.getProperty("pem.backend.baseUrl");
    String pemBackendOldBaseUrl = properties.getProperty("pem.backendOld.baseUrl");
    String pemIdentityBaseUrl = properties.getProperty("pem.identity.baseUrl");
    String pemApplicationEnv = properties.getProperty("pem.application.env");
    
%>

window.pemBackendBaseUrl = "<%=pemBackendBaseUrl %>";
window.pemBackendOldBaseUrl = "<%=pemBackendOldBaseUrl %>";
window.pemIdentityBaseUrl = "<%=pemIdentityBaseUrl %>";
window.pemApplicationEnv = "<%=pemApplicationEnv %>" === "null" ? "prod":  "<%=pemApplicationEnv %>"
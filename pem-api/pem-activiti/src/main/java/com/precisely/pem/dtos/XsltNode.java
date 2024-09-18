package com.precisely.pem.dtos;

public class XsltNode extends Node{
    private String description;
    private XsltConfiguration xslt;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public XsltConfiguration getXslt() {
        return xslt;
    }

    public void setXslt(XsltConfiguration xslt) {
        this.xslt = xslt;
    }
}

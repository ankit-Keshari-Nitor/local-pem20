package com.precisely.pem.dtos.shared;

import com.precisely.pem.dtos.responses.SponsorInfo;

public class TenantContext {
    private static final ThreadLocal<SponsorInfo> tenantContextLocal = new ThreadLocal<>();

    public static SponsorInfo getTenantContext() {
        return tenantContextLocal.get();
    }

    public static void setTenantContext(SponsorInfo spContext) {
        tenantContextLocal.set(spContext);
    }

    public static void clear() {
        tenantContextLocal.remove();
    }
}

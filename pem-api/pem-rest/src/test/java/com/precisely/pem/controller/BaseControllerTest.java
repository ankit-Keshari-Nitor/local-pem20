package com.precisely.pem.controller;

import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.services.ActivityDefnService;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Arrays;

public class BaseControllerTest {
    public static final String TEST_SPONSOR = "test_sponsor";
    public static final String TEST_NAME = "test";
    public static final String TEST_ACTIVITY_DEFN_KEY = "test_activity_defn_key";
    public static final String TEST_ACTIVITY_DEFN_VERSION_KEY = "test_activity_defn_key";
    public static final String TEST_DESCRIPTION = "description";

    public static final String ACTIVITY_DEFINITION_VERSION_NOT_FOUND = "Activity Definition Version not found";

    @Mock
    protected ActivityDefnService activityDefnService;

    @InjectMocks
    protected ActivityController activityController;

    public static ActivityDefnPaginationRes getActivityDefnPaginationRes() {
        ActivityDefnPaginationRes activityDefnPaginationRes = new ActivityDefnPaginationRes();
        ActivityDefnListResp defnListResp1 = new ActivityDefnListResp();
        defnListResp1.setActivityDefnKey("123");
        defnListResp1.setActivityVersionLink("http://localhost/sponsors/sponsor1/v2/activityDefinitions/123");

        ActivityDefnListResp defnListResp2 = new ActivityDefnListResp();
        defnListResp2.setActivityDefnKey("456");
        defnListResp2.setActivityVersionLink("http://localhost/sponsors/sponsor1/v2/activityDefinitions/456");

        activityDefnPaginationRes.setContent(Arrays.asList(defnListResp1, defnListResp2));
        return activityDefnPaginationRes;
    }
}

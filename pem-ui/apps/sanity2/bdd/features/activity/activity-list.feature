Feature: As a user, I should be able to verify the Activity List Page

  Background:
    Given User navigates to the application
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]

  @Validation
  Scenario: As a user, I should be able to validate columns in Activity List page
    Given User navigates to the application
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    Then User verifies column "name" with label "Activity Name" is [visible] in [Data-Table]["activity-list"]
    And User verifies column "defaultVersion.status" with label "Status" is [visible] in [Data-Table]["activity-list"]
    And User verifies column "defaultVersion.version" with label "Default Version" is [visible] in [Data-Table]["activity-list"]
    And User verifies column "primaryAction" with label "Actions" is [visible] in [Data-Table]["activity-list"]

  @Validation
  Scenario: As a user, I should be able to click on filters icon in Activity List page
    Given User navigates to the application
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    Then User clicks on "filter" button in toolbar [Data-Table]["activity-list"]
    Then User verifies filter section is [visible] in [Data-Table]["activity-list"]
    When User clicks on "filter" button in toolbar [Data-Table]["activity-list"]
    Then User verifies filter section is [hidden] in [Data-Table]["activity-list"]
    When User clicks on "filter" button in toolbar [Data-Table]["activity-list"]
    And User verifies filter has form fields [Data-Table]["activity-list"]
      | name   | formFieldType | label  | elementStatus |
      | status | CheckboxGroup | Status | visible       |
    When User updates filter form fields in [Data-Table]["activity-list"]
      | name   | formFieldType | value |
      | status | CheckboxGroup | Draft |
    And User waits for 2000 seconds for application to process
    When User clicks on "apply" action in filter in [Data-Table]["activity-list"]
    Then User verifies applied filters is [visible] in [Data-Table]["activity-list"]
      | name   | values |
      | Status | Draft  |
    When User clicks on clear filters in [Data-Table]["activity-list"]
    And User waits for 1000 seconds for application to process
    Then User verifies applied filters is [hidden] in [Data-Table]["activity-list"]
      | name | values |

  @Validation
  Scenario: As a user, I should be able to view row actions in Activity List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 2000 seconds for application to process
    Then User verifies row 1 has row actions in [Data-Table]["activity-list"]
      | actionId       | actionLabel     |
      | view           | View            |
      | edit           | Edit            |
      | exportActivity | Export Activity |
      | testActivity   | Test Activity   |
      | cloneActivity  | Clone Activity  |
      | shareUnshared  | Share/Unshared  |
      | delete         | Delete          |

  @Validation
  Scenario: As a user, I should be able to validate pagination action in Activities List Page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    And User waits for 4000 seconds for application to process
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User selects page size "5" in [Data-Table]["activity-list"]
    Then User verifies page size "5" is displayed in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on "forward" button in pagination bar in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies page "2" is displayed in [Data-Table]["activity-list"]
    When User clicks on "backward" button in pagination bar in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies page "1" is displayed in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User selects page size "10" in [Data-Table]["activity-list"]
    Then User verifies page size "10" is displayed in [Data-Table]["activity-list"]

  @Validation
  Scenario: As a user, I should be able to search for a Activities List Page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User searches for "ActivityList Testing 9" in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies search result count as "1" in [Data-Table]["activity-list"]

  @Validation
  Scenario: As a user, I should be able to validate data in Activities List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies row with has data in [Data-table]["activity-list"]
      | rowIndex | column-1               | column-2 | column-3                            | column-4      |
      |        0 | ActivityList Testing 9 | Draft    | Ver. 1Click to view Version History | Mark As Final |
    Then User verifies cell[0][0] has value "ActivityList Testing 9" in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row action "delete" on row 0 in [Data-Table]["activity-list"]
    And User waits for 4000 seconds for application to process
    #Then User verifies [confirm] modal with message "Are you sure you want to delete? The Activity status will be changed to Deleted." is [visible] [Modal]

  @Validation
  Scenario: As a user, I should be able to click Mark as Final button in Activities List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    Then User clicks on row button "markAsFinal" on row 1 in [Data-Table]["activity-list"]
    And User waits for 5000 seconds for application to process

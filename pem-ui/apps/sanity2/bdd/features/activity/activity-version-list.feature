Feature: As a user, I should be able to verify the Version List Page

  Background:
    Given User navigates to the application
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]

  @Validation
  Scenario: As a user, I should be able to click version button in Version List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    And User waits for 5000 seconds for application to process

  @Validation
  Scenario: As a user, I should be able to validate columns in Version List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    And User waits for 5000 seconds for application to process
    Then User verifies column "version" with label "Version" is [visible] in [Data-Table]["version-list"]
    And User verifies column "status" with label "Status" is [visible] in [Data-Table]["version-list"]
    And User verifies column "primaryAction" with label "Actions" is [visible] in [Data-Table]["version-list"]

  @Validation
  Scenario: As a user, I should be able to view row actions in Version List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    And User waits for 5000 seconds for application to process
    Then User verifies row 1 has row actions in [Data-Table]["version-list"]
      | actionId      | actionLabel     |
      | view          | View            |
      | edit          | Edit            |
      | exportVersion | Export Version  |
      | markAsDefault | Mark As Default |
      | testVersion   | Test Version    |
      | cloneVersion  | Clone Version   |
      | shareUnshared | Share/Unshared  |
      | delete        | Delete          |

  @Validation
  Scenario: As a user, I should be able to validate pagination action in Version List Page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    When User selects page size "5" in [Data-Table]["version-list"]
    Then User verifies page size "5" is displayed in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on "forward" button in pagination bar in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies page "2" is displayed in [Data-Table]["version-list"]
    When User clicks on "backward" button in pagination bar in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    Then User verifies page "1" is displayed in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    When User selects page size "10" in [Data-Table]["version-list"]
    Then User verifies page size "10" is displayed in [Data-Table]["version-list"]

  @Validation
  Scenario: As a user, I should be able to validate data in Version List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    Then User verifies row with has data in [Data-table]["version-list"]
      | rowIndex | column-1                            | column-2 | column-3      |
      |        0 | Ver. 1Click to view Version History | Draft    | Mark As Final |
    Then User verifies cell[0][0] has value "ver1" in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row action "delete" on row 0 in [Data-Table]["version-list"]
    And User waits for 4000 seconds for application to process
    # Then User verifies [confirm] modal with message "Are you sure you want to delete? The Activity status will be changed to Deleted." is [visible] [Modal]

  @Validation
  Scenario: As a user, I should be able to click Mark as Final button in Version List page
    When User navigates to "Activity Listing" under "Activities" [App-Nav]
    Then User verifies "Activity Definition" page is displayed [Page]["activity-list"]
    And User waits for 4000 seconds for application to process
    When User clicks on row button "version" on row 1 in [Data-Table]["activity-list"]
    Then User verifies "Version History" page is displayed [Page]["version-list"]
    Then User clicks on row button "markAsFinal" on row 1 in [Data-Table]["version-list"]
    And User waits for 5000 seconds for application to process

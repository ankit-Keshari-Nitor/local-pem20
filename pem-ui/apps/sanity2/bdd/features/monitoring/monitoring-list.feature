Feature: As a user, I should be able to verify the Monitroing Rollout List Page

  Background:
    Given User navigates to the application
    When User navigates to "Monitoring" under "Activities" [App-Nav]

  @Validation
  Scenario: As a user, I should be able to validate single row data in Monitoring Rollout List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies row with has data in [Data-table]["view-rollout-activity"]
      | rowIndex | column-1         | column-2 | column-3         | column-4  | column-5      |
      |        2 | Activity feb 23A |       13 | Def Task feb 23A | Completed | View Activity |
    Then User verifies cell[2][0] has value "Activity feb 23A" in [Data-Table]["view-rollout-activity"]
    Then User clicks on row button "action" on row 5 in [Data-Table]["view-rollout-activity"]
    And User waits for 5000 seconds for application to process

  @Validation
  Scenario: As a user, I should be able to view row actions in Monitoring Rollout List page
    Then User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies row 1 has row actions in [Data-Table]["view-rollout-activity"]
      | actionId      | actionLabel    |
      | addPartners   | Add partners   |
      | closeActivity | Close activity |

  @Validation
  Scenario: As a user, I should be able view columns in Monitoring Rollout List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    Then User verifies column "name" with label "Name" is [visible] in [Data-Table]["view-rollout-activity"]
    And User verifies column "partners" with label "Partners" is [visible] in [Data-Table]["view-rollout-activity"]
    And User verifies column "definitionName" with label "Activity Definition" is [visible] in [Data-Table]["view-rollout-activity"]
    And User verifies column "status" with label "Status" is [visible] in [Data-Table]["view-rollout-activity"]

  @Validation
  Scenario: As a user, I should be able to click on filters icon in Monitoring Rollout List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    Given User clicks on "filter" button in toolbar [Data-Table]["view-rollout-activity"]
    Then User verifies filter section is [visible] in [Data-Table]["view-rollout-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-rollout-activity"]
    Then User verifies filter section is [hidden] in [Data-Table]["view-rollout-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-rollout-activity"]
    And User verifies filter has form fields [Data-Table]["view-rollout-activity"]
      | name           | formFieldType | label                      | elementStatus |
      | definitionName | TextInput     | Defination Name (optional) | visible       |
    When User updates filter form fields in [Data-Table]["view-rollout-activity"]
      | name           | formFieldType | value            |
      | definitionName | TextInput     | Def Task feb 23A |
    And User waits for 1000 seconds for application to process
    Then User verifies filter form fields with values in [Data-Table]["view-rollout-activity"]
      | name           | formFieldType | value            |
      | definitionName | TextInput     | Def Task feb 23A |
    When User clicks on "apply" action in filter in [Data-Table]["view-rollout-activity"]
    Then User verifies applied filters is [visible] in [Data-Table]["view-rollout-activity"]
      | name            | values           |
      | Defination Name | Def Task feb 23A |
    When User clicks on clear filters in [Data-Table]["view-rollout-activity"]
    And User waits for 1000 seconds for application to process
    Then User verifies applied filters is [hidden] in [Data-Table]["view-rollout-activity"]
      | name | values |

  @Validation
  Scenario: As a user, I should be able to search for a Monitoring Rollout List Page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User searches for "Activity feb 23A" in [Data-Table]["view-rollout-activity"]
    # Then User verifies search result count as "1" in [Data-Table]["view-rollout-activity"]

  @Validation
  Scenario: As a user, I should be able to validate pagination action in Monitoring Rollout List Page
  # TODO: Need to check when API is integrated
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User selects page size "5" in [Data-Table]["view-rollout-activity"]
    # When User clicks on "forward" button in pagination bar in [Data-Table]["view-rollout-activity"]
    # Then User verifies page "2" is displayed in [Data-Table]["view-rollout-activity"]
    # When User clicks on "backward" button in pagination bar in [Data-Table]["view-rollout-activity"]
    # Then User verifies page "1" is displayed in [Data-Table]["view-rollout-activity"]
    Then User verifies total pages as "1" in [Data-Table]["view-rollout-activity"]
    When User selects page size "10" in [Data-Table]["view-rollout-activity"]
    Then User verifies page size "10" is displayed in [Data-Table]["view-rollout-activity"]
    And User verifies total pages as "1" in [Data-Table]["view-rollout-activity"]

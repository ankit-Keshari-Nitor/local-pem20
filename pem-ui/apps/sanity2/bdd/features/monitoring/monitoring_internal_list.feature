Feature: As a user, I should be able to view Internal Activites Tabs and List Page

  Background:
    Given User navigates to the application
    When User navigates to "Monitoring" under "Activities" [App-Nav]

  @validation
  Scenario: As a user, I should be able to click Internal Activites tabs and verify Tiles
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 5000 seconds for application to process
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    Then User verifies Tile "notStartInternalActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "inProgressInternalActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "completedInternalActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "closedInternalActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "onScheduleActivities" is visible in [Tile]["monitoring-tile"]

  @Validation
  Scenario: As a user, I should be able to validate single row data in Internal Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    Then User verifies row with has data in [Data-table]["view-internal-activity"]
      | rowIndex | column-1 | column-2         | column-3         | column-4  |
      |        2 | Testing  | Activity feb 23A | Def Task feb 23A | Completed |
    Then User verifies cell[2][1] has value "Activity feb 23A" in [Data-Table]["view-internal-activity"]

  @Validation
  Scenario: As a user, I should be able to view row actions in Internal Activites List page
    Then User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    Then User verifies row 1 has row actions in [Data-Table]["view-internal-activity"]
      | actionId      | actionLabel    |
      | addPartners   | Add partners   |
      | closeActivity | Close activity |

  @Validation
  Scenario: As a user, I should be able view columns in Internal Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    Then User verifies column "name" with label "Name" is [visible] in [Data-Table]["view-internal-activity"]
    And User verifies column "definitionName" with label "Version" is [visible] in [Data-Table]["view-internal-activity"]
    And User verifies column "status" with label "Status" is [visible] in [Data-Table]["view-internal-activity"]

  @Validation
  Scenario: As a user, I should be able to validate filters in Internal Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    And User waits for 1000 seconds for application to process
    Then User clicks on "filter" button in toolbar [Data-Table]["view-internal-activity"]
    Then User verifies filter section is [visible] in [Data-Table]["view-internal-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-internal-activity"]
    Then User verifies filter section is [hidden] in [Data-Table]["view-internal-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-internal-activity"]
    And User verifies filter has form fields [Data-Table]["view-internal-activity"]
      | name   | formFieldType | label  | elementStatus |
      | status | CheckboxGroup | Status | visible       |
    When User updates filter form fields in [Data-Table]["view-internal-activity"]
      | name   | formFieldType | value |
      | status | CheckboxGroup | DRAFT |
    And User waits for 5000 seconds for application to process
    When User clicks on "apply" action in filter in [Data-Table]["view-internal-activity"]
    Then User verifies applied filters is [visible] in [Data-Table]["view-internal-activity"]
      | name   | values |
      | Status | DRAFT  |
    When User clicks on clear filters in [Data-Table]["view-internal-activity"]
    And User waits for 1000 seconds for application to process
    Then User verifies applied filters is [hidden] in [Data-Table]["view-internal-activity"]
      | name | values |

  @Validation
  Scenario: As a user, I should be able to search for a Internal Activites List Page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    When User searches for "Activity feb 23A" in [Data-Table]["view-internal-activity"]
    # Then User verifies search result count as "1" in [Data-Table]["view-internal-activity"]

  @Validation
  Scenario: As a user, I should be able to validate pagination action in Internal Activites List Page
  # TODO: Need to check when API is integrated
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "internal" tab [Tab]["user"]
    Then User verifies "internal" tab is selected [Tab]["user"]
    When User selects page size "5" in [Data-Table]["view-internal-activity"]
    # When User clicks on "forward" button in pagination bar in [Data-Table]["view-internal-activity"]
    # Then User verifies page "2" is displayed in [Data-Table]["view-internal-activity"]
    # When User clicks on "backward" button in pagination bar in [Data-Table]["view-internal-activity"]
    # Then User verifies page "1" is displayed in [Data-Table]["view-internal-activity"]
    Then User verifies total pages as "1" in [Data-Table]["view-internal-activity"]
    When User selects page size "10" in [Data-Table]["view-internal-activity"]
    Then User verifies page size "10" is displayed in [Data-Table]["view-internal-activity"]
    And User verifies total pages as "1" in [Data-Table]["view-internal-activity"]

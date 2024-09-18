Feature: As a user, I should be able to view Partner Activites tabs

  Background:
    Given User navigates to the application
    When User navigates to "Monitoring" under "Activities" [App-Nav]

  @validation
  Scenario: As a user, I should be able to click Partner Activites tabs and verify Tiles
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 5000 seconds for application to process
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    Then User verifies Tile "notStartPartnerActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "inProgressPartnerActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "completedPartnerActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "closedPartnerActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "sponsorAction" is visible in [Tile]["monitoring-tile"]

  @Validation
  Scenario: As a user, I should be able to validate single row data in Partner Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    Then User verifies row with has data in [Data-table]["view-partner-activity"]
      | rowIndex | column-1         | column-2 | column-3         | column-4  | column-5   | column-6 | column-7 | column-8         |
      |        2 | Activity feb 23A |       13 | Def Task feb 23A | Completed | 22/06/2024 |       10 | View     | Icon Description |
    Then User verifies cell[2][0] has value "Activity feb 23A" in [Data-Table]["view-partner-activity"]

  @Validation
  Scenario: As a user, I should be able to view row actions in Partner Activites List page
    Then User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    Then User verifies row 1 has row actions in [Data-Table]["view-partner-activity"]
      | actionId      | actionLabel    |
      | addPartners   | Add partners   |
      | closeActivity | Close activity |

  @Validation
  Scenario: As a user, I should be able view columns in Partner Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    Then User verifies column "name" with label "Name" is [visible] in [Data-Table]["view-partner-activity"]
    And User verifies column "partners" with label "Partners" is [visible] in [Data-Table]["view-partner-activity"]
    And User verifies column "definitionName" with label "Activity Definition" is [visible] in [Data-Table]["view-partner-activity"]
    And User verifies column "status" with label "Status" is [visible] in [Data-Table]["view-partner-activity"]
    And User verifies column "dueDate" with label "DueDate" is [visible] in [Data-Table]["view-partner-activity"]
    And User verifies column "delay" with label "Delays (Days)" is [visible] in [Data-Table]["view-partner-activity"]

  @Validation
  Scenario: As a user, I should be able to validate filters in Partner Activites List page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    And User waits for 1000 seconds for application to process
    Given User clicks on "filter" button in toolbar [Data-Table]["view-partner-activity"]
    Then User verifies filter section is [visible] in [Data-Table]["view-partner-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-partner-activity"]
    Then User verifies filter section is [hidden] in [Data-Table]["view-partner-activity"]
    When User clicks on "filter" button in toolbar [Data-Table]["view-partner-activity"]
    And User verifies filter has form fields [Data-Table]["view-partner-activity"]
      | name           | formFieldType | label                      | elementStatus |
      | definitionName | TextInput     | Defination Name (optional) | visible       |
    When User updates filter form fields in [Data-Table]["view-partner-activity"]
      | name           | formFieldType | value            |
      | definitionName | TextInput     | Def Task feb 23A |
    And User waits for 1000 seconds for application to process
    Then User verifies filter form fields with values in [Data-Table]["view-partner-activity"]
      | name           | formFieldType | value            |
      | definitionName | TextInput     | Def Task feb 23A |
    When User clicks on "apply" action in filter in [Data-Table]["view-partner-activity"]
    Then User verifies applied filters is [visible] in [Data-Table]["view-partner-activity"]
      | name            | values           |
      | Defination Name | Def Task feb 23A |
    When User clicks on clear filters in [Data-Table]["view-partner-activity"]
    And User waits for 1000 seconds for application to process
    Then User verifies applied filters is [hidden] in [Data-Table]["view-partner-activity"]
      | name | values |

  @Validation
  Scenario: As a user, I should be able to search for a Partner Activites List Page
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    When User searches for "Activity feb 23A" in [Data-Table]["view-partner-activity"]
    # Then User verifies search result count as "1" in [Data-Table]["view-partner-activity"]

  @Validation
  Scenario: As a user, I should be able to validate pagination action in Partner Activites List Page
  # TODO: Need to check when API is integrated
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    When User clicks on "partners" tab [Tab]["user"]
    Then User verifies "partners" tab is selected [Tab]["user"]
    When User selects page size "5" in [Data-Table]["view-partner-activity"]
    # When User clicks on "forward" button in pagination bar in [Data-Table]["view-partner-activity"]
    # Then User verifies page "2" is displayed in [Data-Table]["view-partner-activity"]
    # When User clicks on "backward" button in pagination bar in [Data-Table]["view-partner-activity"]
    # Then User verifies page "1" is displayed in [Data-Table]["view-partner-activity"]
    Then User verifies total pages as "1" in [Data-Table]["view-partner-activity"]
    When User selects page size "10" in [Data-Table]["view-partner-activity"]
    Then User verifies page size "10" is displayed in [Data-Table]["view-partner-activity"]
    And User verifies total pages as "1" in [Data-Table]["view-partner-activity"]

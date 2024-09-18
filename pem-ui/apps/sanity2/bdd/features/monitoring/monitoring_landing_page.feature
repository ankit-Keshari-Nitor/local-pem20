Feature: As a user, I should be able to view Monitoring Page and Tabs

  Background:
    Given User navigates to the application
    When User navigates to "Monitoring" under "Activities" [App-Nav]

  @validation
  Scenario: As a user, I should be able to view selected tabs
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies "rollout" tab is selected [Tab]["user"]

  @validation
  Scenario: As a user, I should be able to view Rollout Activites Tile
    Given User navigates to "Monitoring" under "Activities" [App-Nav]
    And User waits for 1000 seconds for application to process
    Then User verifies Tile "notStartActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "inProgressActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "completedActivities" is visible in [Tile]["monitoring-tile"]
    And User verifies Tile "closedActivities" is visible in [Tile]["monitoring-tile"]

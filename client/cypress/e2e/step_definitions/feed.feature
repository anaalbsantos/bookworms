Feature: Feed
  As a logged-in user
  I want to interact with my group page
  So I can see posts, rankings and manage my group

  Scenario: View page without a group
    Given I'm logged in without a group
    When I visit the group page
    Then I should see the no group message

  Scenario: Navigate to create post
    Given I'm on the group page
    When I click on 'Adicionar publicação' button
    Then I should be redirected to the create post page

  Scenario: Viewing group page with posts and ranking
    Given I'm logged in and have a group
    When I visit the group page
    Then I should see the group cover with name, type and duration
    And I should see a list of posts
    And I should see the ranking section

  Scenario: Attempt to leave group
    Given I'm on the group page
    When I click on 'Sair do Grupo' button
    Then I should see a confirmation popup
    When I click 'Cancelar'
    Then the popup should close

  Scenario: Filter posts by user
    Given I'm on the group page
    When I select a user from the filter dropdown
    Then I should see only posts from that user

  # Scenario: Successfully leave group
  #   Given I'm on the group page
  #   When I click on 'Sair do Grupo' button
  #   And I click 'Sair do grupo' on the popup
  #   Then I should be redirected to the no group page

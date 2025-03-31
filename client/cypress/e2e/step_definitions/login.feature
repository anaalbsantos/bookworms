Feature: login

Scenario: Valid login
Given I'm on the front page
When I type the username "gvnna" and the password "123123kk"
Then I should see the bookworms logo
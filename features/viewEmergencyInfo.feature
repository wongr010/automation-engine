Feature:  View emergency info

As a Maple user, I want to view my emergency info


Background:
  Given the user has opened a Maple-enabled page
  And the user is logged in as regular user
  And the chat window is opened
  And an action with title "Emergency info" is present

Scenario: Update my emergency Contact
  When the user inputs "Change emergency contact 1"
  And the user inputs custom widget of type "emergency-contact-edit" with:
    |email-field__input|david@bondo.com|
  And the user selects the "Confirm" button of the custom widget of type "emergency-contact-edit"
  Then the bot shows configurable widget of type "textBubble" with:
    |text|Your emergency contact has been successfully updated.|

Scenario: Ask the bot about my emergency info
  When the user inputs "who's my emergency contact"
  Then the bot shows configurable widget of type "emergencyContact" with:
    |title|Emergency Contact|
    |name |John|
    |relationship|Parent|
    |email|david@bondo.com|


Scenario: Select "Emergency info" action
  When the user selects "Emergency info"
  Then the bot shows configurable widget of type "emergencyContact" with:
    |title|Emergency Contact|
    |name |John|
    |relationship|Parent|
    |email|david@bondo.com|

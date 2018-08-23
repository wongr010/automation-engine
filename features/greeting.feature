Feature: Chatbot greeting

As a Maple user, I want to be greeted by Maple

Scenario: Update my nickname
  Given the user has opened a Maple-enabled page
  And the user is logged in as regular user
  And the chat window is opened
  When the user inputs "Change nickname to Jimmy"
  And the user selects the "Confirm" button of the custom widget of type "nickname-edit"
  Then the bot shows configurable widget of type "textBubble" with:
    |text|Great. Your nickname has been successfully updated. What would you like to do next?|


Scenario: Bot greets user
  Given the user has opened a Maple-enabled page
  And the user is logged in as regular user
  And the chat window is opened
  Then the bot shows configurable widget of type "textBubble" with:
    |text|Hi Jimmy, welcome! I'm a virtual agent, here to help you with all of your HR tasks.|
  And the bot shows configurable widget of type "textBubble" with:
    |text|Check out everything I can do in the menu at the top left, or choose from the options below.|
  And the bot shows configurable widget of type "textBubble" with:
    |text|Let's get started!|
  And the following actions are shown:
    |Personal info|
    |Emergency info|
    |Payment info|
    |Time off|
    |To do|
    |Search people|


Scenario: Bot greets user when user types hi
  Given the user has opened a Maple-enabled page
  And the user is logged in as regular user
  And the chat window is opened
  When the user inputs "hi"
  Then the bot shows configurable widget of type "textBubble" with:
    |text|Hi Jimmy, welcome! I'm a virtual agent, here to help you with all of your HR tasks.|
  And the bot shows configurable widget of type "textBubble" with:
    |text|Check out everything I can do in the menu at the top left, or choose from the options below.|
  And the bot shows configurable widget of type "textBubble" with:
    |text|Let's get started!|
  And the following actions are shown:
    |Personal info|
    |Emergency info|
    |Payment info|
    |Time off|
    |To do|
    |Search people|

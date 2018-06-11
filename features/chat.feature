
Feature: Chatbot

Background: Given that I am chatting with Maple

Scenario Outline: configure the action bar
  When I see the action bar
  Then there will be <total> buttons with <num> buttons visible
Examples:
|

Scenario Outline: type and view button
  When I type <input> into <area>
  Then I should see <element> with <text>
Examples:
|input|area    |element          |text         |
|hi   |chat bar|action bar button|Phone details|
|howdy|chat bar|action bar button|Full name    |




Scenario Outline: click and view item
  When I click <button> with <label>
  Then I should see <element> with <text>
Examples:
|button           |label        |element      |text                                                  |
|action bar button|Personal info|bubble       |To view your personal details, select an item below.\n|
|action bar button|Nickname     |personalItem |Nickname\n|

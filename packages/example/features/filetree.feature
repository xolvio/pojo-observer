Feature: File Tree

  Scenario: Select file
    Given the following files have been loaded by the File Tree
      | filename    | content       | createdAt  |
      | File A      | Lovely file A | 2/2/2020   |
      | File B      | Ugly file B   | 3/3/2018   |
      | File C      | Weird file C  | 4/4/2019 |
    When I select "File C" in the File Tree
    Then the File Content should contain "Weird file C"
    And the File Details should contain "4/4/2019"


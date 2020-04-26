Feature: File Tree

  Scenario: Select file
    Given the following files have been loaded by the File Tree
      | filename    | content       | path   |
      | File A      | Lovely file A | /here  |
      | File B      | Ugly file B   | /there |
      | File C      | Weird file C  | /      |
    When I select "File C" in the File Tree
    Then the File Content should contain "Weird file C"
    And the File Details path should be "/"


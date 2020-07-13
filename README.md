# GitHub Action - Project Card Moved Notifications
This GitHub Action allows you to notify an issue's assignee when its corresponding project card moves between columns.

![Screen Shot 2020-07-13 at 1 56 38 PM](https://user-images.githubusercontent.com/1865328/87342336-af55b600-c510-11ea-8ebf-8ec4453d524a.png)

## Usage
### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
- `assigneeFilter`: Optional. A comma separated list of usernames to notify when an issue they are assigned to moves between project columns.

### Example workflow

```yaml
name: Notify assignees when their card moves between columns

on:
  project_card:
      types: [moved]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
        - uses: jenschelkopf/project-card-moved-notification@master

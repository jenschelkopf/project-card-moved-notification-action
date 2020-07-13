const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    const changedColumnId = github.context.payload.changes && github.context.payload.changes.column_id;

    if (changedColumnId) {
      if (github.context.payload.project_card.content_url) {
          const issueResponse = await octokit.request(github.context.payload.project_card.content_url);

          const assigneeFilter = core.getInput('assigneeFilter').length > 0 ? core.getInput('assigneeFilter').split(',') : [];
          const assignees = issueResponse.data.assignees.filter((assignee) => {
            if(assigneeFilter.length == 0) {
              return true;
            }
            return assigneeFilter.findIndex((filterItem) => {
              console.log(`Comparing filter ${filterItem.toLowerCase()} to assignee ${assignee.login.replace(/\s/g, '').toLowerCase()}`);
              return filterItem.toLowerCase() == assignee.login.replace(/\s/g, '').toLowerCase();
            }) > -1;
          });

          if(assignees.length > 0) {
            const comment = `Heads up - this issue was moved between project columns. cc ${assignees.map((assignee) => { return '@' + assignee.login }).join(', ')}`;

            const createCommentResponse = await octokit.issues.createComment({
              owner,
              repo,
              issue_number: issueResponse.data.number,
              body: comment
            });
          } else {
            console.log("No issue assignee that matches filter (if set) - doing nothing.");
          }
      }

    }

  } catch (error) {
    console.error(error);
    core.setFailed(`The action failed with ${error}`);
  }
}

run();

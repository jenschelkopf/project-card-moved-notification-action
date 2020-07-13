const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);

    console.log(`Payload: ${JSON.stringify(github.context.payload)}`);

    // if the card was moved between columns
    const changedColumnId = github.context.payload.changes.column_id;
    if (changedColumnId) {
      //   find the issue associated with the Card
      //   cards can be notes or issues. Only issues have the content_url
      if (github.context.payload.project_card.content_url) {
          // const issue = await octokit.issues.get({
          //   owner,
          //   repo,
          //   issue_number: issueNumber,
          // });
          const issueResponse = await ocktokit.request(github.context.payload.project_card.content_url);
          console.log(`Issue Response: ${JSON.stringify(issueResponse)}`);
          //   if the assignee filter is unset, or the assignee filter matches the issue assignees
          //   and a comment to the issue to notify the assignee
          const assignees = issueResponse.body.assignees.map((assignee) => { return '@' + assignee.login; });
          console.log(`Assignees: ${JSON.stringify(assignees)}`);

          const comment = `Heads up - this issue was moved between project columns. cc ${assignees.join(', ')}`;
          console.log(`Comment: ${comment}`);

          const createCommentResponse = await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueResponse.data.number,
            body: comment
          });

          console.log('All done!');

      }


    }



    // const labelRecipients = core.getInput('recipients').split("\n");
    // const match = labelRecipients.find((labelRecipient) => {
    //   return labelRecipient.split("=")[0] === label;
    // });
    //
    // const message = core.getInput('message');
    //
    // if (match) {
    //   const recipients = correctRecipients(match.split("=")[1]);
    //   const comment = correctMessage(message, recipients, label);
    //   const createCommentResponse = await octokit.issues.createComment({
    //     owner,
    //     repo,
    //     issue_number: issueNumber,
    //     body: comment
    //   });
    // } else {
    //   console.log("No matching recipients found for label ${label}.");
    // }
  } catch (error) {
    console.error(error);
    core.setFailed(`The action failed with ${error}`);
  }
}

run();

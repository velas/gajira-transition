const _ = require('lodash');
const Jira = require('./common/net/Jira');
const core = require('@actions/core');
module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const { argv } = this;
    console.log(`argv: ${JSON.stringify(argv, null, 2)}`);
    const issuesIDs = argv.issuesIDs.split(', ');
    let issuesSummaries = '';
    for (let i = 0; i < issuesIDs.length; i++) {
      const issueId = issuesIDs[i];
      console.log(`Current issue ID: ${issueId}`);
      const issue = await this.Jira.getIssue(issueId);
      console.log(`Issue summary: ${issue.fields.summary}`);
      issuesSummaries += `[${issueId}](https://velasnetwork.atlassian.net/browse/${issueId}) – ${issue.fields.summary}\n`;
    }
    core.setOutput('summary', issuesSummaries);
    return {}
  }
}

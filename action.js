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
    const issuesIDs = this.argv.issuesIDs.split(', ');
    let issuesSummaries = '';
    for (let i = 0; i < issuesIDs.length; i++) {
      let issueId = issuesIDs[i];
      console.log(`Current issue ID: ${issueId}`);
      issueId = makeProperIssueID(issueId);

      const issue = await this.Jira.getIssue(issueId);
      console.log(`Issue summary: ${issue.fields.summary}`);
      issuesSummaries += `[${issueId}](https://velasnetwork.atlassian.net/browse/${issueId}) – ${issue.fields.summary}\n`;
    }
    core.setOutput('summary', issuesSummaries);
    return {}
  }
}

function makeProperIssueID(issue) {
  let issueId = issue.toUpperCase();
  issueId = issueId.replace(' ', '-');
  if (!issueId.includes('VTX-')) {
    issueId = 'VTX-' + issueId;
  }
  return issueId;
}

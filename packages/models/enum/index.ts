export enum GIT_TYPE {
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  BITBUCKET = "BITBUCKET",
}
export enum INTEGRATION_TYPE {
  SLACK = "SLACK",
  ASANA = "ASANA",
  SENTRY = "SENTRY",
  CONTENTFUL = "CONTENTFUL",
}

export enum OAUTH_PERMISSIONS {
  READ_USER = "read_user",
  READ_PROJECT = "read_project",
  UPDATE_CREDENTIALS = "update_credentials"
}
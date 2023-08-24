export enum GIT_TYPE {
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  BITBUCKET = "BITBUCKET",
}

export enum ENVIRONMENT {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export enum INTEGRATION_TYPES {
  Messaging = "MESSAGING",
  ErrorTracking = "ERROR_TRACKING",
  DevTools = "DEVTOOLS",
  Security = "SECURITY",
  Analytics = "ANALYTICS",
  Storage = "STORAGE",
  Logging = "LOGGING",
  Monitoring = "MONITORING",
  Cms = "CMS",
}

export enum INTEGRATION_PROVIDERS {
  Slack = "SLACK",
  Sentry = "SENTRY",
  Discord = "DISCORD",
  Onboardbase = "ONBOARDBASE",
  Contentful = "CONTENTFUL",
  Novu = "NOVU",
  Netlify = "NETLIFY",
  GoogleAnalytics = "GOOGLE_ANALYTICS",
}

export enum ROLES {
  CREATOR = "CREATOR",
  MEMBER = "MEMBER",
}

export enum CARD_TYPES {
  MASTERCARD = "MASTERCARD",
  VISA = "VISA",
  VERVE = "VERVE",
}

export enum PROJECT_STATUS {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  INPROGRESS = "INPROGRESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export enum SUBSCRIPTION_STATUS {
  ACTIVE = "active",
  INACTIVE = "in-active",
}

export enum OAUTH_PERMISSIONS {
  READ_USER = "read_user",
  READ_PROJECT = "read_project",
  UPDATE_CREDENTIALS = "update_credentials",
}

export enum SERVER_STATUS {
  Active = "active",
  InActive = "in-active",
}

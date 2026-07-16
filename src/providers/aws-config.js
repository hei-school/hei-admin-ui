export const awsConfig = {
  aws_project_region: process.env.REACT_APP_AWS_REGION,
  aws_cognito_region: process.env.REACT_APP_AWS_REGION,
  aws_user_pools_id: process.env.REACT_APP_USERPOOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_WEBCLIENT_ID,
  oauth: {
    domain: process.env.REACT_APP_OAUTH_DOMAIN,
  },
  aws_cognito_social_providers: [],
  aws_cognito_username_attributes: ["EMAIL"],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      "REQUIRES_LOWERCASE",
      "REQUIRES_UPPERCASE",
      "REQUIRES_NUMBERS",
      "REQUIRES_SYMBOLS",
    ],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
};

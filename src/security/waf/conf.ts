import {awsWaf} from "@/config/env";

export const AWS_WAF_SCRIPT_ID = "AwsWAFScript";

export const AWS_WAF_ACTION_HEADER_KEY = "x-amzn-waf-action";
export const AWS_WAF_TOKEN_HEADER_KEY = "x-aws-waf-token";

const AWS_WAF_SCRIPT_LOADED_KEY = "__aws_script_loaded__";

export interface AwsWafScriptCDNLib {
  awsWafCaptcha: {
    renderCaptcha: (container: HTMLElement, options: any) => void;
  };
  awsWafIntegration: {
    getToken: () => Promise<string>;
  };
}

export function loadAwsWafScript(): Promise<AwsWafScriptCDNLib> {
  return new Promise((resolve) => {
    if (isAwsWafScriptLoaded()) {
      resolve(awsWafScriptLib());
      return;
    }
    document.getElementById(AWS_WAF_SCRIPT_ID)?.remove();
    const AwsWafScript = document.createElement("script");
    AwsWafScript.id = AWS_WAF_SCRIPT_ID;
    AwsWafScript.src = awsWaf.jsApiUrl;
    AwsWafScript.crossOrigin = "true";
    AwsWafScript.onload = () => {
      (window as any)[AWS_WAF_SCRIPT_LOADED_KEY] = true;
      resolve(awsWafScriptLib());
    };
    AwsWafScript.onerror = () => {
      window.location.reload();
    };
    document.head.appendChild(AwsWafScript);
  });
}

export const awsWafScriptLib = (): AwsWafScriptCDNLib => ({
  awsWafCaptcha: awsWafCaptcha(),
  awsWafIntegration: awsWafIntegration(),
});
export const awsWafCaptcha = () => (window as any).AwsWafCaptcha;
export const awsWafIntegration = () => (window as any).AwsWafIntegration;
export const awsWafToken = async (): Promise<string> => {
  const {awsWafIntegration} = await loadAwsWafScript();
  if (!awsWafIntegration) return "";
  return awsWafIntegration.getToken();
};

export const isAwsWafScriptLoaded = () => {
  const lib = awsWafScriptLib();
  return (
    !!lib.awsWafCaptcha?.renderCaptcha && !!lib.awsWafIntegration?.getToken
  );
};

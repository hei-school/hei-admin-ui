import {awsWaf} from "@/config/env";
import {loadAwsWafScript} from "@/security/waf/index";
import {Box, CircularProgress, Dialog, DialogContent} from "@mui/material";
import {useEffect, useRef} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export const HumanVerification = () => {
  const [p] = useSearchParams();
  const navigate = useNavigate();

  const redirectTo = p.get("redirect_to") || "/profile";

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const isCaptchaOpen = useRef(false);

  const renderCaptcha = async (): Promise<string | undefined> => {
    const {awsWafCaptcha} = await loadAwsWafScript();

    if (isCaptchaOpen.current) {
      return Promise.resolve(undefined);
    }

    isCaptchaOpen.current = true;

    return new Promise<string>((resolve) => {
      captchaRef.current?.firstElementChild?.remove();
      awsWafCaptcha.renderCaptcha(captchaRef.current!, {
        apiKey: awsWaf.apiKey,
        onSuccess: (token: string) => {
          isCaptchaOpen.current = false;
          navigate(redirectTo);
          resolve(token);
        },
      });
    });
  };

  useEffect(() => {
    renderCaptcha();
  }, []);

  return (
    <Dialog open fullWidth maxWidth="sm" ref={captchaContainerRef}>
      <DialogContent>
        <Box
          sx={{display: "flex", justifyContent: "center", alignItems: "center"}}
          data-testid="aws-waf-captcha-dialog"
          ref={captchaRef}
        >
          <CircularProgress />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

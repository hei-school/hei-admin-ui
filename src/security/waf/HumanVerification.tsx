import {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Dialog, DialogContent, CircularProgress, Box} from "@mui/material";
import {loadAwsWafScript} from "@/security/waf";
import {awsWaf} from "@/config/env";

export const HumanVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const redirectTo = searchParams.get("redirect_to") || "/profile";

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const captchaInitialized = useRef(false);

  const renderCaptcha = async (): Promise<string | undefined> => {
    try {
      console.log("Loading AWS WAF captcha...");
      const {awsWafCaptcha} = await loadAwsWafScript();

      if (captchaInitialized.current) {
        console.log("Captcha is already open. Skipping re-initialization.");
        return;
      }

      captchaInitialized.current = true;

      console.log("Rendering AWS WAF captcha...");
      return new Promise<string | undefined>((resolve) => {
        captchaRef.current?.firstElementChild?.remove();

        awsWafCaptcha.renderCaptcha(captchaRef.current!, {
          apiKey: awsWaf.apiKey,
          onSuccess: (token: string) => {
            console.log("Captcha successfully completed:", token);
            captchaInitialized.current = false;
            setIsLoading(false);
            navigate(redirectTo);
            resolve(token);
          },
          onError: (error: unknown) => {
            console.error("Captcha rendering failed:", error);
            captchaInitialized.current = false;
            setIsLoading(false);
            resolve(undefined);
          },
        });
      });
    } catch (error) {
      console.error(
        "Error while loading AWS WAF script or rendering captcha:",
        error
      );
      setIsLoading(false);
      return undefined;
    }
  };

  useEffect(() => {
    renderCaptcha();
  }, []);

  return (
    <Dialog open fullWidth maxWidth="sm" ref={captchaContainerRef}>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "150px",
          }}
          data-testid="aws-waf-captcha-dialog"
          ref={captchaRef}
        >
          {isLoading && <CircularProgress />}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

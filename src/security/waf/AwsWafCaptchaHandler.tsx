import {getAxiosInstance} from "@/config/axios";
import {
  AWS_WAF_TOKEN_HEADER_KEY,
  awsWafToken,
  loadAwsWafScript,
} from "@/security/waf/index";
import {AxiosError} from "axios";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const HUMAN_VERIFICATION_ROUTE_PREFIX = "/human-verification";

export const AwsWafCaptchaHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const axios = getAxiosInstance();
    let resInterceptor: number;
    let reqInterceptor: number;

    const setupAxiosInterceptors = async () => {
      await loadAwsWafScript();

      resInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const isVerifying = window.location.pathname.startsWith(
            HUMAN_VERIFICATION_ROUTE_PREFIX
          );
          if (error.status === 405 && !isVerifying) {
            navigate(
              `${HUMAN_VERIFICATION_ROUTE_PREFIX}?redirect_to=${window.location.pathname}`.replace(
                /\/+/g,
                "/"
              ),
              {replace: true}
            );
            return;
          }
          throw error;
        }
      );

      reqInterceptor = axios.interceptors.request.use(
        async (config) => {
          config.headers[AWS_WAF_TOKEN_HEADER_KEY] = await awsWafToken();
          return config;
        },
        (err) => Promise.reject(err)
      );
    };

    setupAxiosInterceptors();

    return () => {
      axios.interceptors.response.eject(resInterceptor);
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, [navigate]);

  return null;
};

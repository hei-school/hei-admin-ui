import {useEffect} from "react";
import {AxiosError} from "axios";
import {
  AWS_WAF_TOKEN_HEADER_KEY,
  awsWafToken,
  loadAwsWafScript,
} from "@/security/waf";
import {getAxiosInstance} from "@/config/axios";

const HUMAN_VERIFICATION_ROUTE_PREFIX = "/human-verification";

export const useAwsWafCaptchaHandler = () => {
  useEffect(() => {
    const axios = getAxiosInstance();
    let resInterceptor: number;
    let reqInterceptor: number;

    const setupAxiosInterceptors = async () => {
      await loadAwsWafScript();

      resInterceptor = axios.interceptors.response.use(
        (response: any) => response,
        async (error: AxiosError) => {
          const isVerifying = window.location.pathname.startsWith(
            HUMAN_VERIFICATION_ROUTE_PREFIX
          );
          if (error.status === 405 && !isVerifying) {
            window.location.href =
              `${HUMAN_VERIFICATION_ROUTE_PREFIX}?redirect_to=${window.location.pathname}`.replace(
                /\/+/g,
                "/"
              );
            return;
          }
          throw error;
        }
      );

      reqInterceptor = axios.interceptors.request.use(
        async (config: {headers: {[x: string]: string}}) => {
          config.headers[AWS_WAF_TOKEN_HEADER_KEY] = await awsWafToken();
          return config;
        },
        (err: never) => Promise.reject(err)
      );
    };

    setupAxiosInterceptors();

    return () => {
      axios.interceptors.response.eject(resInterceptor);
      axios.interceptors.request.eject(reqInterceptor);
    };
  }, []);
};

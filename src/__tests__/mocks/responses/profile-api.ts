import {Manager} from "@haapi/typescript-client";
import {manager2} from "./manager-api";

export const noPicManager = (): Manager => manager2;

export const withPicManager = (): Manager => ({
  ...noPicManager(),
  profile_picture:
    "https://img.freepik.com/photos-gratuite/portrait-homme-blanc-isole_53876-40306.jpg",
});

export const badPicManager = (): Manager => ({
  ...noPicManager(),
  profile_picture: "https://pixabay.com/fr/phot",
});

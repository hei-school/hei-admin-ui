import {Manager} from "@haapi/typescript-client";
import {manager1Mock} from "./managers-mocks";

export const noPicManager = (): Manager => manager1Mock;

export const withPicManager = (): Manager => ({
  ...noPicManager(),
  profile_picture:
    "https://img.freepik.com/photos-gratuite/portrait-homme-blanc-isole_53876-40306.jpg",
});

export const badPicManager = (): Manager => ({
  ...noPicManager(),
  profile_picture: "https://pixabay.com/fr/phot",
});

export const updatedManager = (): Manager => ({
  ...noPicManager(),
  profile_picture:
    "https://img.freepik.com/free-photo/happy-african-american-young-man-colorful-shirt-wearing-glasses-looking-camera-smiling-cheerfully_141793-108881.jpg",
});

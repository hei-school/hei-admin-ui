import {FC, useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import dataProvider from "@/providers/dataProvider";

export const DocShow: FC = () => {
  const [password, setPassword] = useState(uuidv4());

  useEffect(() => {
    const doEffect = async () => {
      setPassword(uuidv4());
      const {data: file} = await dataProvider.getOne("hei-docs", {
        id: "id",
        meta: {password},
      });

      if (file?.url) {
        window.location.href = file.url;
      }
    };
    doEffect();
  }, []);

  return null;
};

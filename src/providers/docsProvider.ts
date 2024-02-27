import {HaDataProviderType} from "./HaDataProviderType";

// /!\ TODO: WAITING FOR THE API
// YUME DO NOT MIND THIS SH*T
const docsProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any, meta: any) {
    if (meta?.owner! == "SCHOOL") {
      return [
        {
          id: "doc_1",
          name: "Document document",
          creation_datetime: "2024-02-23T12:13:43.714Z",
          file_type: "TRANSCRIPT",
          file_url:
            "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
        },
        {
          id: "doc_2",
          name: "Document document 2",
          creation_datetime: "2024-02-23T12:13:43.714Z",
          file_type: "TRANSCRIPT",
          file_url:
            "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
        },
      ];
    } else if (meta?.owner! == "STUDENT") {
      switch (meta?.type!) {
        case "TRANSCRIPT":
          return [
            {
              id: "trans_1",
              name: "Transcript 1",
              creation_datetime: "2024-02-23T12:13:43.714Z",
              file_type: "TRANSCRIPT",
              file_url:
                "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
            },
            {
              id: "trans_2",
              name: "Transcript 1",
              creation_datetime: "2024-02-23T12:13:43.714Z",
              file_type: "TRANSCRIPT",
              file_url:
                "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
            },
          ];
        case "OTHER":
          return [
            {
              id: "other_1",
              name: "Other 1",
              creation_datetime: "2024-02-23T12:13:43.714Z",
              file_type: "OTHER",
              file_url:
                "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
            },
            {
              id: "other_2",
              name: "Other 1",
              creation_datetime: "2024-02-23T12:13:43.714Z",
              file_type: "OTHER",
              file_url:
                "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
            },
          ];
        default:
          console.error("Doc type not known.");
          return [];
      }
    } else {
      console.error("Doc owner not known");
      return [];
    }
  },
  async getOne(id: string, meta: any) {
    if (meta?.owner! == "SCHOOL") {
      return {
        id: "doc_1",
        name: "Document document",
        creation_datetime: "2024-02-23T12:13:43.714Z",
        file_type: "TRANSCRIPT",
        file_url:
          "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
      };
    } else if (meta?.owner! == "STUDENT") {
      switch (meta?.type!) {
        case "TRANSCRIPT":
          return {
            id: "trans_1",
            name: "Transcript 1",
            creation_datetime: "2024-02-23T12:13:43.714Z",
            file_type: "TRANSCRIPT",
            file_url:
              "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
          };
        case "OTHER":
          return {
            id: "other_1",
            name: "Other 1",
            creation_datetime: "2024-02-23T12:13:43.714Z",
            file_type: "OTHER",
            file_url:
              "https://hei-regulations.s3.eu-west-3.amazonaws.com/R%C3%A8glement+de+HEI.pdf",
          };
        default:
          console.error("Doc type not known.");
          console.log("khtwehoiwehroiweth");
      }
    } else {
      console.error("Doc owner not known");
      console.log("khtwehoiwehroiweth");
    }
  },
  async saveOrUpdate(payload: any) {
    throw new Error("Not implemented.");
  },
};

export default docsProvider;

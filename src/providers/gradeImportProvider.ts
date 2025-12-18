import { v4 as uuidv4 } from "uuid";
import { HaDataProviderType } from "./HaDataProviderType";
import { gradesApi } from "./api";

const gradeImportProvider: HaDataProviderType = {

    saveOrUpdate: async (_resources, meta) => {
        const {file, comment, mode}= meta.data;
        const examId = meta.meta.examId;

        let response;
        
        console.log(meta)

       if (mode === "UPDATE") {
            response = await gradesApi().importStudentsExamGradeUpdated(
                examId,
                comment,
                file.rawFile
            );
        } else{ 
            response = await gradesApi().importStudentsExamGrade(
                    examId,
                file.rawFile
                
            );
        }
        return [
            {
                id: uuidv4(),
                ...response.data,
            },
        ];
    },

    getList: () => {
        throw new Error("Not implemented");
    },

    getOne: () => {
        throw new Error("Not implemented");
    },

    delete: () => {
        throw new Error("Not implemented");
    },
};

export default gradeImportProvider;

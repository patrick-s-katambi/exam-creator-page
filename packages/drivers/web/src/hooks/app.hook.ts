import { useState } from "react";

export function useApp() {
    const [questions, setQuestions] = useQuestions();
    const [sections, setSections] = useSections();

    const onAddSection = () =>
        appTraits.addNewSection({ setter: setSections, questionSetter: setQuestions });

    const onAddQuestion = (props: QuestionAddHandlerI) =>
        appTraits.addNewQuestion({
            setter: setQuestions,
            data: { ...props },
        });

    return { questions, sections, handlers: { onAddSection, onAddQuestion } };
}

// question list state
const useQuestions = () => useState<ExamModel>([]);

// sections list state
const useSections = () => useState<SectionsNumbersT>([]);

type SectionsNumbersT = number[];

type ExamModel = SectionT[];

// type ExamModel = {
//     id?: number;
//     sections: SectionT[];
// };

type SectionT = {
    number: number;
    name: string;
    questions: QuestionT[];
};

type QuestionT = TextQuestionT;

export type TextQuestionT = {
    name: string;
    text: string;
    answer?: string;
    isShortAnswerQuestion: boolean;
};

export interface QuestionAddHandlerI {
    sectionNumber: number;
    kind: "text" | "multiple choice" | "video";
    type: "short-answer" | "long-answer";
}

const appTraits = Object.freeze({
    addNewSection(props: {
        setter: React.Dispatch<React.SetStateAction<SectionsNumbersT>>;
        questionSetter: React.Dispatch<React.SetStateAction<ExamModel>>;
    }) {
        const handler = (sectionNumber: SectionsNumbersT) => {
            let currentSectionCount = sectionNumber.length;
            return [...sectionNumber, currentSectionCount + 1];
        };
        props.setter(handler);

        const handler2 = (examInfo: ExamModel) => {
            let currentSectionCount = examInfo.length;
            examInfo = [
                ...examInfo,
                {
                    name: `Section ${currentSectionCount + 1}`,
                    number: currentSectionCount + 1,
                    questions: [],
                },
            ];
            return examInfo;
        };
        props.questionSetter(handler2);
    },

    addNewQuestion(props: {
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
        data: QuestionAddHandlerI;
    }) {
        const handler = (examInfo: ExamModel) => {
            // // if (examInfo) {
            // console.log("adding a question props", examInfo?.sections[props.data.sectionNumber]);
            // let examSectionsInfo = examInfo?.sections.map((section) => {
            //     if (section.number === props.data.sectionNumber) {
            //         let currentQuestions = section.questions;

            //         if (props.data.kind === "text") {
            //             if (props.data.type === "short-answer") {
            //                 section.questions = [
            //                     ...currentQuestions,
            //                     { text: "", answer: "", isShortAnswerQuestion: true },
            //                 ];
            //             }

            //             if (props.data.type === "long-answer") {
            //                 section.questions = [
            //                     ...currentQuestions,
            //                     { text: "", isShortAnswerQuestion: false },
            //                 ];
            //             }
            //         }
            //     }

            //     return section;
            // });
            // // examInfo = { ...examInfo, sections: examSectionsInfo };
            // examInfo = { sections: examSectionsInfo ?? [] };
            // // }

            let newExamInfo = examInfo.map((section, index) => {
                if (section.number === props.data.sectionNumber) {
                    const newQuestion: TextQuestionT | undefined = (function () {
                        if (props.data.kind === "text") {
                            if (props.data.type === "short-answer") {
                                return {
                                    isShortAnswerQuestion: true,
                                    text: "",
                                    answer: "",
                                    name: "",
                                };
                            }

                            if (props.data.type === "long-answer") {
                                return {
                                    isShortAnswerQuestion: false,
                                    text: "",
                                    name: "",
                                };
                            }
                        }
                    })();

                    if (newQuestion) {
                        examInfo[index].questions = [...examInfo[index].questions, newQuestion];
                    }
                }
                return section;
            });

            console.log("newExamInfo", newExamInfo);

            return newExamInfo;
        };
        props.setter(handler);
    },
});

import { useState } from "react";

export function useApp() {
    const [questions, setQuestions] = useQuestions();
    const [sections, setSections] = useSections();

    const onAddSection = () =>
        appTraits.addNewSection({ setter: setSections, questionSetter: setQuestions });

    const onAddQuestion = (props: QuestionAddHandlerI) => {
        appTraits.addNewQuestion({
            setter: setQuestions,
            data: { ...props },
        });
    };

    const onEditorChange = (props: {
        isAnswer: boolean;
        kind: questionKind;
        type: textQuestionType;
        newValue: string;
        questionIndex: number;
        sectionNumber: number;
    }) => {
        appTraits.onChangeEditor({
            setter: setQuestions,
            isAnswer: props.isAnswer,
            kind: props.kind,
            newValue: props.newValue,
            questionIndex: props.questionIndex,
            sectionNumber: props.sectionNumber,
            type: props.type,
        });
    };

    const onDeleteQuestion = (props: { questionIndex: number; sectionNumber: number }) => {
        appTraits.onDeleteQuestion({
            setter: setQuestions,
            questionIndex: props.questionIndex,
            sectionNumber: props.sectionNumber,
        });
    };

    return {
        questions,
        sections,
        handlers: { onAddSection, onAddQuestion, onEditorChange, onDeleteQuestion },
    };
}

// question list state
const useQuestions = () => useState<ExamModel>([]);

// sections list state
const useSections = () => useState<SectionsNumbersT>([]);

type SectionsNumbersT = number[];

type ExamModel = SectionT[];

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

type questionKind = "text" | "multiple choice" | "video";
type textQuestionType = "short-answer" | "long-answer";

export interface QuestionAddHandlerI {
    sectionNumber: number;
    kind: questionKind;
    type: textQuestionType;
}

export const appTraits = Object.freeze({
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

            return newExamInfo;
        };
        props.setter(handler);
    },

    onChangeEditor(props: {
        questionIndex: number;
        sectionNumber: number;
        newValue: string;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
        kind: questionKind;
        type: textQuestionType;
        isAnswer: boolean;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.map((section, index) => {
                if (section.number === props.sectionNumber) {
                    if (props.kind === "text") {
                        if (props.type === "long-answer") {
                            section.questions[props.questionIndex].text = props.newValue;
                        }
                        if (props.type === "short-answer") {
                            if (props.isAnswer) {
                                section.questions[props.questionIndex].answer = props.newValue;
                            } else section.questions[props.questionIndex].text = props.newValue;
                        }
                    }
                }

                return section;
            });
            return examInfo;
        };
        props.setter(handler);
    },

    onDeleteQuestion(props: {
        questionIndex: number;
        sectionNumber: number;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.map((section) => {
                if (section.number === props.sectionNumber) {
                    section.questions = section.questions.filter(
                        (_, index) => index !== props.questionIndex
                    );
                }

                return section;
            });
            return examInfo;
        };
        props.setter(handler);
    },
});

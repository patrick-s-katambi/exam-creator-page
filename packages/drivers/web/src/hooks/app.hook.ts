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
            questions: questions,
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

    const onDeleteSection = (props: { sectionNumber: number }) => {
        appTraits.onDeleteSection({
            setter: setQuestions,
            sectionNumber: props.sectionNumber,
            sectionSetter: setSections,
        });
    };

    const onEditSectionTitle = (props: { sectionNumber: number; name: string }) => {
        appTraits.onEditSectionTitle({
            setter: setQuestions,
            sectionNumber: props.sectionNumber,
            sectionSetter: setSections,
            name: props.name,
        });
    };

    const onEditQuestionName = (props: {
        sectionNumber: number;
        name: string;
        questionIndex: number;
    }) => {
        appTraits.onEditQuestionName({
            setter: setQuestions,
            sectionNumber: props.sectionNumber,
            questionIndex: props.questionIndex,
            name: props.name,
        });
    };

    const onMoveDownQuestion = (props: { sectionNumber: number; questionIndex: number }) => {
        appTraits.onMoveDownQuestion({
            setter: setQuestions,
            sectionNumber: props.sectionNumber,
            questionIndex: props.questionIndex,
        });
    };

    return {
        questions,
        sections,
        handlers: {
            onAddSection,
            onAddQuestion,
            onEditorChange,
            onDeleteQuestion,
            onDeleteSection,
            onEditSectionTitle,
            onEditQuestionName,
            onMoveDownQuestion,
        },
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
    questionIndex?: number;
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
        questions: ExamModel;
    }) {
        if (Number(props.data.questionIndex) >= 0) {
            const newQuestion: TextQuestionT | undefined = (function () {
                let questionNumber = Number(props.data.questionIndex) + 2;
                let questionName = `Question ${questionNumber}`;

                if (props.data.kind === "text") {
                    if (props.data.type === "short-answer") {
                        return {
                            isShortAnswerQuestion: true,
                            text: "",
                            answer: "",
                            name: questionName,
                        };
                    }

                    if (props.data.type === "long-answer") {
                        return {
                            isShortAnswerQuestion: false,
                            text: "",
                            name: questionName,
                        };
                    }
                }
            })();

            const handler = (examInfo: ExamModel) => {
                examInfo = examInfo.map((section) => {
                    if (section.number === props.data.sectionNumber) {
                        let before = section.questions.filter(
                            (_, index) => index <= Number(props.data.questionIndex)
                        );
                        let after = [...section.questions].slice(
                            Number(props.data.questionIndex) + 1
                        );
                        if (newQuestion) {
                            section.questions = [...before, newQuestion, ...after];
                        }
                    }
                    return section;
                });
                return examInfo;
            };

            props.setter(handler);
        } else {
            const newQuestion: TextQuestionT | undefined = (function () {
                let questionNumber = (function () {
                    let _section = props.questions.find(
                        (sect) => sect.number === props.data.sectionNumber
                    );
                    return Number(_section?.questions.length) + 1 ?? 1;
                })();
                let questionName = `Question ${questionNumber}`;
                if (props.data.kind === "text") {
                    if (props.data.type === "short-answer") {
                        return {
                            isShortAnswerQuestion: true,
                            text: "",
                            answer: "",
                            name: questionName,
                        };
                    }

                    if (props.data.type === "long-answer") {
                        return {
                            isShortAnswerQuestion: false,
                            text: "",
                            name: questionName,
                        };
                    }
                }
            })();

            const handler = (examInfo: ExamModel) => {
                let newExamInfo = examInfo.map((section, index) => {
                    if (section.number === props.data.sectionNumber) {
                        if (newQuestion) {
                            examInfo[index].questions = [...examInfo[index].questions, newQuestion];
                        }
                    }
                    return section;
                });

                return newExamInfo;
            };
            props.setter(handler);
        }
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

    onDeleteSection(props: {
        sectionNumber: number;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
        sectionSetter: React.Dispatch<React.SetStateAction<SectionsNumbersT>>;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.filter((section) => section.number !== props.sectionNumber);
            return examInfo;
        };
        props.setter(handler);

        const handler2 = (sectionNumbers: SectionsNumbersT) => {
            sectionNumbers = sectionNumbers.filter((num) => num !== props.sectionNumber);
            return sectionNumbers;
        };
        props.sectionSetter(handler2);
    },

    onEditSectionTitle(props: {
        sectionNumber: number;
        name: string;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
        sectionSetter: React.Dispatch<React.SetStateAction<SectionsNumbersT>>;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.map((section) => {
                if (section.number === props.sectionNumber) {
                    section.name = props.name;
                }
                return section;
            });
            return examInfo;
        };
        props.setter(handler);
    },

    onEditQuestionName(props: {
        sectionNumber: number;
        questionIndex: number;
        name: string;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.map((section) => {
                if (section.number === props.sectionNumber) {
                    section.questions[props.questionIndex].name = props.name;
                }
                return section;
            });
            return examInfo;
        };
        props.setter(handler);
    },

    onMoveDownQuestion(props: {
        sectionNumber: number;
        questionIndex: number;
        setter: React.Dispatch<React.SetStateAction<ExamModel>>;
    }) {
        const handler = (examInfo: ExamModel) => {
            examInfo = examInfo.map((section) => {
                if (section.number === props.sectionNumber) {
                    let currentQuestionIndex = props.questionIndex;
                    let nextQuestionIndex = currentQuestionIndex + 1;

                    let currentQuestion = section.questions[currentQuestionIndex];
                    let nextQuestion = section.questions[nextQuestionIndex];

                    section.questions[currentQuestionIndex] = nextQuestion;
                    section.questions[nextQuestionIndex] = currentQuestion;
                }
                return section;
            });
            return examInfo;
        };
        props.setter(handler);
    },
});

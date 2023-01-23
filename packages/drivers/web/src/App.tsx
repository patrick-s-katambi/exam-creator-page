import {
    Button,
    Container,
    Editable,
    EditableInput,
    EditablePreview,
    Heading,
    Input,
    ScaleFade,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdAdd, MdOutlineDelete } from "react-icons/md";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const primaryBg = "#383838"; // -- bg primary
const secondaryBg = "#454545"; // -- bg secondary
const textColor = "#ffffff";

interface ActiveItemI {
    number: number;
    kind: "question" | "section";
    section?: number;
}

function App() {
    const { questions, sections, handlers } = useApp();

    const [hoveredItem, setHoveredItem] = useState<ActiveItemI | undefined>();

    const [activeItem, setActiveItem] = useState<ActiveItemI | undefined>();
    const isItemHovered = (props: ActiveItemI) => {
        if (props.section) {
            return (
                hoveredItem?.number === props.number &&
                hoveredItem.kind === props.kind &&
                hoveredItem.section === props.section
            );
        }
        return hoveredItem?.number === props.number && hoveredItem.kind === props.kind;
    };

    const onMouseEnter = (props: ActiveItemI) => {
        setHoveredItem((prev) => {
            prev = { ...props };
            return prev;
        });
    };
    const onMouseLeave = () => {
        setHoveredItem((prev) => {
            prev = undefined;
            return prev;
        });
    };

    const actionHandlers: {
        section: () => void;
        shortQuestion: () => void;
        longQuestion: () => void;
    } = {
        section: handlers.onAddSection,
        shortQuestion: () => {},
        longQuestion: () => {},
    };
    return (
        <Container
            minW={"full"}
            p={"10"}
            bg={primaryBg}
            color={textColor}
            display="flex"
            flexDirection={"column"}
            gap={0}
            className="min-h-screen"
        >
            {sections.length === 0 && (
                <Container
                    display="flex"
                    flexDirection={"column"}
                    alignItems="center"
                    justifyContent={"center"}
                    gap={5}
                >
                    <Heading fontWeight={"thin"}>
                        Start by adding a <strong>Section</strong>
                    </Heading>
                    <TopButton onClick={actionHandlers.section} label="Section" />
                </Container>
            )}

            {sections.map((sectionNumber, index) => {
                let isSectionHovered = (() => {
                    return isItemHovered({ number: index, kind: "section" });
                })();
                let sectionName = questions.find((sect) => sect.number === sectionNumber)?.name;
                return (
                    <React.Fragment key={`${index}-${sectionNumber}`}>
                        <Container
                            _hover={{ bg: secondaryBg }}
                            minW={"full"}
                            position={"relative"}
                            display="flex"
                            flexDirection={"column"}
                            alignItems="center"
                            gap={0}
                            onMouseEnter={() => {
                                onMouseEnter({ number: index, kind: "section" });
                            }}
                            onMouseLeave={onMouseLeave}
                        >
                            <ScaleFade initialScale={0.9} in={isSectionHovered}>
                                <Container
                                    bg={"transparent"}
                                    h={10}
                                    minW="fit-content"
                                    w="fit-content"
                                    rounded={"lg"}
                                    display="flex"
                                    flexDirection={"row"}
                                    alignItems="center"
                                    gap="2"
                                >
                                    <TopButton
                                        label="delete"
                                        Icon={<MdOutlineDelete className="text-white" />}
                                        onClick={() => {
                                            handlers.onDeleteSection({
                                                sectionNumber: sectionNumber,
                                            });
                                        }}
                                    />
                                </Container>
                            </ScaleFade>

                            <Editable
                                h="fit-content"
                                w="full"
                                textAlign={"center"}
                                p="2"
                                value={`${sectionName}`}
                                onChange={(value) => {
                                    handlers.onEditSectionTitle({
                                        name: value === "" ? `Section ${index + 1}` : value,
                                        sectionNumber,
                                    });
                                }}
                            >
                                <EditablePreview as={"h1"} fontSize="3xl" lineHeight={"none"} />
                                <EditableInput fontSize="3xl" />
                            </Editable>

                            <ActionButtons
                                isHovered={isSectionHovered}
                                handlers={{
                                    section: actionHandlers.section,
                                    longQuestion: () => {
                                        handlers.onAddQuestion({
                                            kind: "text",
                                            type: "long-answer",
                                            sectionNumber: sectionNumber,
                                        });
                                    },
                                    shortQuestion: () => {
                                        handlers.onAddQuestion({
                                            kind: "text",
                                            type: "short-answer",
                                            sectionNumber: sectionNumber,
                                        });
                                    },
                                }}
                                sectionNumber={sectionNumber}
                            />
                        </Container>

                        {questions?.map((_section, indexx) => {
                            if (_section.number === sectionNumber) {
                                return (
                                    <React.Fragment key={indexx}>
                                        {_section.questions.map((question, indexxx) => {
                                            let isShortAnswer = Boolean(
                                                question.answer || question.answer === ""
                                            );
                                            let isQuestionHovered = (() => {
                                                return isItemHovered({
                                                    number: indexxx,
                                                    kind: "question",
                                                    section: _section.number,
                                                });
                                            })();
                                            let isFirstInSection = indexxx === 0;
                                            let isLastInSection = (() => {
                                                let isLast: boolean = false;
                                                questions.forEach((sect) => {
                                                    if (sect.number === _section.number) {
                                                        isLast =
                                                            indexxx === sect.questions.length - 1;
                                                    }
                                                });

                                                return isLast;
                                            })();
                                            return (
                                                <React.Fragment key={indexxx}>
                                                    <Container
                                                        key={indexx}
                                                        _hover={{ bg: secondaryBg }}
                                                        minW={"full"}
                                                        p="2"
                                                        position={"relative"}
                                                        display="flex"
                                                        flexDirection={"column"}
                                                        rounded={"lg"}
                                                        gap={1}
                                                        onMouseEnter={() => {
                                                            onMouseEnter({
                                                                number: indexxx,
                                                                kind: "question",
                                                                section: _section.number,
                                                            });
                                                        }}
                                                        onMouseLeave={onMouseLeave}
                                                    >
                                                        <ScaleFade
                                                            initialScale={0.9}
                                                            in={isQuestionHovered}
                                                        >
                                                            <Container
                                                                h={10}
                                                                minW="full"
                                                                w="fit-content"
                                                                rounded={"lg"}
                                                                display="flex"
                                                                flexDirection={"row"}
                                                                alignItems="center"
                                                                justifyContent={"end"}
                                                                gap={"1"}
                                                            >
                                                                <TopButton
                                                                    label="delete"
                                                                    Icon={
                                                                        <MdOutlineDelete className="text-white" />
                                                                    }
                                                                    onClick={() =>
                                                                        handlers.onDeleteQuestion({
                                                                            questionIndex: indexxx,
                                                                            sectionNumber:
                                                                                _section.number,
                                                                        })
                                                                    }
                                                                />

                                                                <TopButton
                                                                    label="move up"
                                                                    Icon={
                                                                        <AiOutlineArrowUp className="text-white" />
                                                                    }
                                                                    onClick={() => {}}
                                                                    disabled={isFirstInSection}
                                                                />

                                                                <TopButton
                                                                    label="move down"
                                                                    Icon={
                                                                        <AiOutlineArrowDown className="text-white" />
                                                                    }
                                                                    onClick={() => {}}
                                                                    disabled={isLastInSection}
                                                                />
                                                            </Container>
                                                        </ScaleFade>

                                                        <Editable
                                                            h="fit-content"
                                                            w="full"
                                                            textAlign={"left"}
                                                            p="2"
                                                            value={question.name}
                                                            onChange={(value) => {
                                                                handlers.onEditQuestionName({
                                                                    name:
                                                                        value === ""
                                                                            ? `Question ${
                                                                                  index + 1
                                                                              }`
                                                                            : value,
                                                                    sectionNumber: _section.number,
                                                                    questionIndex: indexxx,
                                                                });
                                                            }}
                                                        >
                                                            <EditablePreview
                                                                as={"h1"}
                                                                fontSize="lg"
                                                                lineHeight={"none"}
                                                            />
                                                            <EditableInput fontSize="lg" />
                                                        </Editable>

                                                        {/* <Text fontSize={"lg"}>{question.name}</Text> */}
                                                        <Editor
                                                            value={question.text}
                                                            onChange={(value) =>
                                                                handlers.onEditorChange({
                                                                    isAnswer: false,
                                                                    kind: "text",
                                                                    type: isShortAnswer
                                                                        ? "short-answer"
                                                                        : "long-answer",
                                                                    newValue: value,
                                                                    questionIndex: indexxx,
                                                                    sectionNumber: _section.number,
                                                                })
                                                            }
                                                        />

                                                        {isShortAnswer && (
                                                            <>
                                                                <Text fontSize={"sm"}>Answer</Text>
                                                                <Editor
                                                                    value={String(question.answer)}
                                                                    onChange={(value) =>
                                                                        handlers.onEditorChange({
                                                                            isAnswer: true,
                                                                            kind: "text",
                                                                            type: "short-answer",
                                                                            newValue: value,
                                                                            questionIndex: indexxx,
                                                                            sectionNumber:
                                                                                _section.number,
                                                                        })
                                                                    }
                                                                />
                                                            </>
                                                        )}

                                                        <ActionButtons
                                                            isHovered={isQuestionHovered}
                                                            handlers={{
                                                                section: actionHandlers.section,
                                                                longQuestion: () => {
                                                                    handlers.onAddQuestion({
                                                                        kind: "text",
                                                                        type: "long-answer",
                                                                        sectionNumber:
                                                                            _section.number,
                                                                        questionIndex: indexxx,
                                                                    });
                                                                },
                                                                shortQuestion: () => {
                                                                    handlers.onAddQuestion({
                                                                        kind: "text",
                                                                        type: "short-answer",
                                                                        sectionNumber:
                                                                            _section.number,
                                                                        questionIndex: indexxx,
                                                                    });
                                                                },
                                                            }}
                                                            sectionNumber={_section.number}
                                                        />
                                                    </Container>
                                                </React.Fragment>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }
                            return <></>;
                        })}
                    </React.Fragment>
                );
            })}
        </Container>
    );
}

export default App;

interface TopButtonProps {
    label?: string;
    onClick?: () => void;
    Icon?: React.ReactNode;
    disabled?: boolean;
}

const TopButton: React.FunctionComponent<TopButtonProps> = (props) => (
    <Button
        _hover={{ bg: secondaryBg, gap: 2 }}
        _disabled={{ cursor: "not-allowed" }}
        bg={primaryBg}
        borderWidth={"0.5px"}
        borderStyle="solid"
        borderColor={props.disabled ? "gray.500" : "white"}
        transition="all"
        transitionDuration={"300ms"}
        gap={1}
        h="fit-content"
        p="1"
        variant={"solid"}
        onClick={props.onClick}
        cursor={props.disabled ? "revert" : "pointer"}
        disabled={props.disabled}
        color={props.disabled ? "gray.500" : "white"}
    >
        {props.Icon ?? <MdAdd />}
        {props.label && <Text fontSize={"sm"}>{props.label}</Text>}
    </Button>
);

interface ActionButtonProps {
    label: string;
    onClick?: () => void;
}

const ActionButton: React.FunctionComponent<ActionButtonProps> = (props) => (
    <Button
        _hover={{ bg: secondaryBg, gap: 2 }}
        bg={primaryBg}
        border="0.5px solid white"
        transition="all"
        transitionDuration={"300ms"}
        gap={1}
        h="fit-content"
        p="1"
        variant={"solid"}
        marginInline={0.5}
        onClick={props.onClick}
    >
        <MdAdd color={textColor} />
        <Text fontSize={"sm"}>{props.label}</Text>
    </Button>
);

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { QuestionAddHandlerI, TextQuestionT, useApp } from "./hooks/app.hook";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const Editor: React.FunctionComponent<EditorProps> = (props) => (
    <ReactQuill
        value={props.value}
        onChange={props.onChange}
        theme="snow"
        className="text-white "
    />
);

interface ActionButtonsProps {
    isHovered: boolean;
    handlers: {
        section: () => void;
        shortQuestion: () => void;
        longQuestion: () => void;
    };
    sectionNumber: number;
}

const ActionButtons: React.FunctionComponent<ActionButtonsProps> = (props) => (
    <Container
        minW={"fit-content"}
        w={"fit-content"}
        bg="transparent"
        position={"relative"}
        display="flex"
        flexDirection={"row"}
        flexWrap={"wrap"}
        alignItems="center"
        justifyContent={"center"}
        gap="1"
        h="fit-content"
        p="1"
        cursor={"pointer"}
    >
        <ScaleFade initialScale={0.9} in={props.isHovered}>
            <Container
                flexDirection={"row"}
                flexWrap={"wrap"}
                alignItems="center"
                justifyContent={"center"}
                gap="0.5px"
                w="fit-content"
                minW={"fit-content"}
            >
                <ActionButton onClick={props.handlers.section} label="Section" />
                <ActionButton onClick={props.handlers.shortQuestion} label="Short Question" />
                <ActionButton onClick={props.handlers.longQuestion} label="Long Question" />
            </Container>
        </ScaleFade>
    </Container>
);

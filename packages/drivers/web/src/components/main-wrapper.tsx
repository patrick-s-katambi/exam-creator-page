import { Container } from "@chakra-ui/react";

export const MainWrapper: React.FunctionComponent<Props> = (props) => (
    <main className="w-full" {...props}>
        <Container>{props.children}</Container>
    </main>
);

interface Props extends React.HTMLProps<any> {}

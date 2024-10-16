import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { marked } from "marked";

import { IconButton } from "@/components/IconButton";
import { Dialog } from "@/components/Dialog";

import BotSvg from "@/assets/bot.svg";

const Content = styled.div`
  width: 100%;
`;

const Label = styled.span`
  padding: 0.2rem;
  font-size: 0.8rem;
`;

const Container = styled.div`
  margin: 1rem 0;
`;

const Prompt = styled.p`
  font-size: 1.4em;
  padding: 0 0.2rem;
  width: 100%;

  h1,
  h2,
  h3 {
    display: none;
  }

  strong,
  b {
    font-weight: normal;
  }
`;

const Input = styled.textarea`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--grey);
  padding: 0.8rem;
  font: inherit;
  font-size: 1.4em;
  field-sizing: content;
  width: 100%;
  min-height: 2lh;
  max-height: 4lh;
`;

const PrimaryButton = styled.button`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--main);
  color: var(--color--contrast);
  padding: 0.8rem;
  width: 100%;
  transition: transform 0.2s;

  &:hover,
  &:focus {
    transform: scale(1.02);
  }
`;

const Button = styled.button`
  border: 0 none;
  border-radius: 0.4rem;
  background: var(--color--grey);
  color: var(--color--dark);
  padding: 0.8rem;
  width: 100%;
  transition: transform 0.2s;

  &:hover,
  &:focus {
    transform: scale(1.02);
  }
`;

type PromptButtonProps = {
  setDuration?: (value: number) => any;
};

function PromptButton({ setDuration }: PromptButtonProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const prompt = useRef<HTMLTextAreaElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [parsed, setParsed] = useState<number>(0);
  const [submittedPrompt, setSubmittedPrompt] = useState("");

  const handleSubmit = useCallback(async () => {
    try {
      const val = prompt.current?.value || "";

      setSubmitting(true);
      setSubmittedPrompt(val);

      const session = await (window as any).ai?.assistant?.create?.();
      const result = await session?.prompt?.(`
        You are a chatbot that helps the user to determine how long they need to
        set a timer for.
        The following is the task the user needs a suggested timer duration for:
        ${val}
      `);

      const html = await marked.parse(result);
      setResult(html);

      const parsed = await session?.prompt?.(`
        Extract the first time (in minutes) expression mentioned given text. Return the 
        output in the format "Time: {time in minutes}". 
        The text to extract the time from is:
        ${result}
      `);

      const time = parsed.match(/Time: ([0-9]+)/)?.[1];
      setParsed(time ? parseInt(time) * 60_000 : 0);

      console.log({ result, parsed, time });
    } catch (e) {
      setResult(null);
      setParsed(0);

      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSubmittedPrompt("");
    setResult(null);
    setParsed(0);
  }, []);

  const parsedMins = Math.floor(parsed / 60_000);
  const parsedSeconds = `${Math.floor(parsed % 60_000)}`.padStart(2, "0");

  if (typeof window === "undefined" || !("ai" in window)) {
    return null;
  }

  return (
    <>
      <IconButton title="Ask AI" onClick={() => dialog.current?.showModal()}>
        <BotSvg />
      </IconButton>

      <Dialog
        ref={dialog}
        buttons={
          submitting ? undefined : result ? (
            <>
              <Button onClick={handleReset}>Reset</Button>
              <PrimaryButton
                onClick={() => {
                  console.log({ parsed });
                  setDuration?.(parsed);
                  dialog.current?.close();
                  handleReset();
                }}
              >
                Set timer
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton onClick={handleSubmit}>Ask AI</PrimaryButton>
          )
        }
      >
        <Content>
          <Label>Prompt AI to help you set the timer: what is the task?</Label>
          {submittedPrompt ? (
            <Prompt>{submittedPrompt}</Prompt>
          ) : (
            <Input
              ref={prompt}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              name="prompt"
              placeholder="e.g. hard-boil an egg"
            />
          )}

          {submitting ? (
            <Container>
              <Label>Loading...</Label>
            </Container>
          ) : result ? (
            <>
              <Container>
                <Label>Suggested timer</Label>
                <Prompt>
                  {parsedMins}:{parsedSeconds}
                </Prompt>
              </Container>

              <Container>
                <Label>Explaination</Label>
                <Prompt dangerouslySetInnerHTML={{ __html: result }} />
              </Container>
            </>
          ) : null}
        </Content>
      </Dialog>
    </>
  );
}

export { PromptButton };

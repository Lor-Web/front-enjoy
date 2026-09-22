import { useMemo, useState } from "react";
import type { Quiz } from "@/entities/quiz";
import { Button } from "@/shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { useSubmitQuiz } from "../model/use-pass-quiz";

type QuizFormProps = {
  quiz: Quiz;
  onPassed?: () => void;
};

export function QuizForm({ quiz, onPassed }: QuizFormProps) {
  const submitQuiz = useSubmitQuiz();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!submitted) {
      return null;
    }
    return quiz.questions.map((question) => {
      const selected = answers[question.id];
      return {
        questionId: question.id,
        selected,
        correct: selected === question.correctOptionId,
      };
    });
  }, [answers, quiz.questions, submitted]);

  const allCorrect = results?.every((item) => item.correct) ?? false;
  const answeredCount = quiz.questions.filter((q) => answers[q.id]).length;
  const canSubmit = answeredCount === quiz.questions.length;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    setSubmitted(true);
    const passed = quiz.questions.every(
      (question) => answers[question.id] === question.correctOptionId,
    );
    submitQuiz(quiz.slug, passed);
    if (passed) {
      onPassed?.();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      {quiz.questions.map((question, index) => {
        const result = results?.find((item) => item.questionId === question.id);
        return (
          <fieldset key={question.id} className="space-y-3">
            <legend className="text-[15px] leading-6 font-medium">
              {index + 1}. {question.prompt}
            </legend>
            <RadioGroup
              value={answers[question.id] ?? ""}
              onValueChange={(value) => {
                if (submitted) {
                  return;
                }
                setAnswers((prev) => ({ ...prev, [question.id]: value }));
              }}
              disabled={submitted}
              className="gap-2"
            >
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                const isCorrectOption = option.id === question.correctOptionId;
                const showMark = submitted && (isSelected || isCorrectOption);
                const optionId = `${question.id}-${option.id}`;
                return (
                  <div
                    key={option.id}
                    className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-6 transition-colors ${
                      showMark && isCorrectOption
                        ? "border-primary bg-primary/8"
                        : showMark && isSelected && !isCorrectOption
                          ? "border-destructive/50 bg-destructive/5"
                          : "border-border hover:bg-accent/40"
                    }`}
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={option.id}
                      className="mt-0.5"
                      disabled={submitted}
                    />
                    <label htmlFor={optionId} className="cursor-pointer">
                      {option.text}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
            {submitted && result ? (
              <p className="text-muted-foreground text-sm leading-6">
                {question.explanation}
              </p>
            ) : null}
          </fieldset>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        {submitted ? (
          allCorrect ? (
            <p className="text-sm text-primary font-medium">
              Все ответы верны. Квиз засчитан.
            </p>
          ) : (
            <Button type="button" variant="outline" onClick={handleRetry}>
              Попробовать снова
            </Button>
          )
        ) : (
          <Button type="submit" disabled={!canSubmit}>
            Проверить
          </Button>
        )}
      </div>
    </form>
  );
}

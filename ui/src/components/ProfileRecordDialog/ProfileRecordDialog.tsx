import { useId, type FormEvent, type ReactNode } from "react";
import { Button } from "../../primitives/Button/Button";
import { Dialog, type DialogProps } from "../../primitives/Dialog/Dialog";
import { Stack } from "../../primitives/Layout/Layout";
import { FormErrorSummary } from "../../states/FormErrorSummary/FormErrorSummary";

export interface ProfileRecordDialogProps extends Pick<DialogProps, "isOpen" | "defaultOpen" | "onOpenChange" | "size"> {
  /** "Add work experience", "Edit education", … */
  title: ReactNode;
  /** Domain fields. The owning form keeps their values, so they survive a failed save. */
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** While true the save button shows its pending label and the dialog cannot be dismissed. */
  isSaving?: boolean;
  /** Recoverable server error shown above the fields, for example "We couldn’t save this record. Your entries are still here." */
  errorMessage?: ReactNode;
  saveLabel?: string;
  savingLabel?: string;
  cancelLabel?: string;
}

/**
 * Shared dialog baseline for Work Experience, Education and Certification records: title and
 * close, fields spaced 14px apart, a form-level error summary, and a Cancel + Save footer whose
 * pending state blocks duplicate submission and dismissal. Validation stays with the owning form.
 */
export function ProfileRecordDialog({ title, children, onSubmit, isSaving = false, errorMessage, saveLabel = "Save", savingLabel = "Saving…", cancelLabel = "Cancel", ...dialogProps }: ProfileRecordDialogProps) {
  const formId = useId();
  return (
    <Dialog
      {...dialogProps}
      title={title}
      isPending={isSaving}
      footer={
        <>
          <Button variant="secondary" slot="close" isDisabled={isSaving}>{cancelLabel}</Button>
          <Button variant="primary" type="submit" form={formId} isPending={isSaving}>{isSaving ? savingLabel : saveLabel}</Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={(event) => {
          if (isSaving) {
            event.preventDefault();
            return;
          }
          onSubmit(event);
        }}
      >
        <Stack gap={14}>
          <FormErrorSummary>{errorMessage}</FormErrorSummary>
          {children}
        </Stack>
      </form>
    </Dialog>
  );
}

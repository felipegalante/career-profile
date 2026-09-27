import type { HTMLAttributes, ReactNode } from "react";
import { Dialog as RACDialog, Heading, Modal, ModalOverlay, type ModalOverlayProps } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { Button } from "../Button/Button";
import styles from "./Dialog.module.css";

export { DialogTrigger } from "react-aria-components";

/** Marks an open modal that owns focus; global shortcuts stay inactive while one exists. */
export const BLOCKING_DIALOG_ATTRIBUTE = "data-blocking-dialog";

export function isBlockingDialogOpen(root: ParentNode = document): boolean {
  return root.querySelector(`[${BLOCKING_DIALOG_ATTRIBUTE}]`) !== null;
}

export interface DialogHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  closeLabel?: string;
  onClose?: () => void;
  isCloseDisabled?: boolean;
  hideClose?: boolean;
}

/** Dialog title row with the close button. Inside `Dialog` the close button dismisses it. */
export function DialogHeader({ title, closeLabel = "Close", onClose, isCloseDisabled, hideClose, className, ...props }: DialogHeaderProps) {
  return (
    <div {...props} className={cx(styles.head, className)}>
      <Heading slot="title" level={2} className={styles.title}>{title}</Heading>
      {hideClose ? null : (
        <Button variant="ghost" isIconOnly aria-label={closeLabel} slot={onClose ? undefined : "close"} onPress={onClose} isDisabled={isCloseDisabled}>
          <Icon name="close" />
        </Button>
      )}
    </div>
  );
}

export function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx(styles.body, className)} />;
}

/** Action row, right aligned: Cancel then the primary action. */
export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx(styles.foot, className)} />;
}

export type DialogProps = Omit<ModalOverlayProps, "children" | "className"> & {
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "default" | "wide";
  /** While true, Escape, the scrim and the close button cannot dismiss the dialog. */
  isPending?: boolean;
  hideClose?: boolean;
  /** `alertdialog` for confirmations of destructive actions. */
  role?: "dialog" | "alertdialog";
  className?: string;
};

/**
 * Modal dialog. Focus moves inside on open, is trapped, and returns to the trigger on close.
 * Escape closes it unless `isPending`; scrim clicks close it only when `isDismissable`.
 */
export function Dialog({ title, children, footer, size = "default", isPending = false, hideClose, role, className, isDismissable = false, isKeyboardDismissDisabled, ...props }: DialogProps) {
  return (
    <ModalOverlay
      {...props}
      {...{ [BLOCKING_DIALOG_ATTRIBUTE]: "" }}
      isDismissable={isDismissable && !isPending}
      isKeyboardDismissDisabled={isPending || isKeyboardDismissDisabled}
      className={styles.overlay}
    >
      <Modal className={cx(styles.dialog, size === "wide" && styles.wide, className)}>
        <RACDialog role={role} className={styles.content}>
          <DialogHeader title={title} isCloseDisabled={isPending} hideClose={hideClose} />
          <DialogBody>{children}</DialogBody>
          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}

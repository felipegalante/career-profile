import type { ReactNode } from "react";
import { DropZone, FileTrigger, Text as RACText, isFileDropItem } from "react-aria-components";
import { Icon } from "../../foundations/Icon";
import { Button, type ButtonProps } from "../../primitives/Button/Button";
import styles from "./FileDropzone.module.css";

export interface FileDropzoneProps {
  /** MIME types the area accepts, for example application/pdf. Other drops are rejected. */
  acceptedFileTypes: string[];
  onFiles: (files: File[]) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Accessible name for the drop target. */
  "aria-label"?: string;
}

/** Dashed drop area for file import; pair it with `ChooseFileButton` for pointer-free selection. */
export function FileDropzone({ acceptedFileTypes, onFiles, title = "Drop a file here or choose from your computer", description, "aria-label": ariaLabel = "File drop area" }: FileDropzoneProps) {
  return (
    <DropZone
      aria-label={ariaLabel}
      className={styles.zone}
      getDropOperation={(types) => (acceptedFileTypes.some((type) => types.has(type)) ? "copy" : "cancel")}
      onDrop={async (event) => {
        const files = await Promise.all(event.items.filter(isFileDropItem).filter((item) => acceptedFileTypes.includes(item.type)).map((item) => item.getFile()));
        if (files.length > 0) onFiles(files);
      }}
    >
      <div className={styles.icon} aria-hidden="true"><Icon name="upload" /></div>
      <RACText slot="label" className={styles.title}>{title}</RACText>
      {description ? <div className={styles.description}>{description}</div> : null}
    </DropZone>
  );
}

export type ChooseFileButtonProps = Omit<ButtonProps, "onPress" | "isIconOnly"> & {
  acceptedFileTypes: string[];
  onFiles: (files: File[]) => void;
  allowsMultiple?: boolean;
};

/** Button that opens the system file picker. */
export function ChooseFileButton({ acceptedFileTypes, onFiles, allowsMultiple = false, children = "Choose file", ...props }: ChooseFileButtonProps) {
  return (
    <FileTrigger acceptedFileTypes={acceptedFileTypes} allowsMultiple={allowsMultiple} onSelect={(list) => list && onFiles(Array.from(list))}>
      <Button {...props}>{children}</Button>
    </FileTrigger>
  );
}

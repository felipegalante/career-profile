import { useState } from "react";
import { AppShell, Button, ChooseFileButton, Dialog, FileDropzone, PageHeader, Text } from "@career-profile/ui";
import { NotArtifactBacked } from "../../chrome/DocPage";
import { demoAccount, demoCommands, demoNavigation } from "../shell/shellDemo";

const accepted = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export function ResumeUploadPage() {
  const [file, setFile] = useState<string>();
  const choose = (files: File[]) => setFile(files[0]?.name);
  return (
    <AppShell navigation={demoNavigation} currentItemId="profile" account={demoAccount} commands={demoCommands(() => undefined)}>
      <PageHeader title="Profile" description="Manage your professional profile from one place." />
      <Dialog title="Import a resume" isOpen onOpenChange={() => undefined} footer={<><Button variant="secondary">Cancel</Button><ChooseFileButton variant="primary" acceptedFileTypes={accepted} onFiles={choose} /></>}>
        <p className="mt-0 text-ink-2">Upload a resume to propose updates to your Career Profile.</p>
        <FileDropzone acceptedFileTypes={accepted} onFiles={choose} description="PDF or DOCX" aria-label="Resume file" />
        <div className="mt-3 flex items-center gap-2">
          <NotArtifactBacked />
          <Text variant="meta" tone="muted">{file ? `Selected: ${file}` : "The drag-over highlight is not drawn in any artifact."}</Text>
        </div>
      </Dialog>
    </AppShell>
  );
}

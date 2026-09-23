import { useState } from "react";
import { Button, CatalogCombobox, Checkbox, Grid, ProfileRecordDialog, Select, TextField, useToast, type CatalogSelection } from "@career-profile/ui";
import { DocPage, Flow, Specimen } from "../../chrome/DocPage";
import { companies, mockSearch } from "./mockCatalog";

const titles = mockSearch<string | undefined>(() => ["Senior Product Engineer", "Software Engineer", "Engineering Manager"].map((label) => ({ id: label, label, meta: "Global title" })));
const employmentTypes = ["Full-time", "Part-time", "Self-employed", "Contract", "Internship / Co-op", "Apprenticeship", "Seasonal / Summer", "Volunteer", "Other"].map((label) => ({ id: label, label }));

function WorkExperienceDemo() {
  const toast = useToast();
  const [isOpen, setOpen] = useState(false);
  const [company, setCompany] = useState<CatalogSelection | null>(null);
  const [title, setTitle] = useState<CatalogSelection | null>(null);
  const [isSaving, setSaving] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string>();
  const [companyError, setCompanyError] = useState<string>();

  function reset() {
    setCompany(null);
    setTitle(null);
    setAttempts(0);
    setError(undefined);
    setCompanyError(undefined);
  }

  return (
    <>
      <Button variant="primary" onPress={() => { reset(); setOpen(true); }}>Open work experience dialog</Button>
      <ProfileRecordDialog
        title="Add work experience"
        isOpen={isOpen}
        onOpenChange={setOpen}
        isSaving={isSaving}
        errorMessage={error}
        onSubmit={(event) => {
          event.preventDefault();
          if (!company) {
            setCompanyError("Select or create a company.");
            return;
          }
          setCompanyError(undefined);
          setError(undefined);
          setSaving(true);
          window.setTimeout(() => {
            setSaving(false);
            if (attempts === 0) {
              setAttempts(1);
              setError("We couldn’t save this record. Your entries are still here.");
              return;
            }
            setOpen(false);
            toast.show({ title: "Experience added", description: `${title?.label ?? "Role"} at ${company.label}` });
          }, 700);
        }}
      >
        <CatalogCombobox label="Company" isRequired customNoun="company" placeholder="Search companies…" value={company} onChange={(next) => { setCompany(next); setTitle(null); }} search={mockSearch(companies)} onCreateCustom={(query) => setCompany({ kind: "custom", label: query })} errorMessage={companyError} />
        {company ? <CatalogCombobox label="Job Title" isRequired customNoun="job title" value={title} onChange={setTitle} search={titles} parentContext={company.label} onCreateCustom={(query) => setTitle({ kind: "custom", label: query })} /> : null}
        <Select label="Employment Type" placeholder="Select type" items={employmentTypes} />
        <Grid columns={2}>
          <TextField label="Start Date" placeholder="Month / Year" />
          <TextField label="End Date" placeholder="Month / Year" />
        </Grid>
        <Checkbox>I currently work here</Checkbox>
      </ProfileRecordDialog>
    </>
  );
}

export function ProfileRecordDialogPage() {
  return (
    <DocPage overline="Shared component" title="ProfileRecordDialog" description="A reusable dialog baseline for Work Experience, Education, and Certification records. Domain fields differ; title, spacing, validation, footer, loading, and close behavior do not.">
      <Grid columns={3}>
        <Specimen title="Work Experience">
          <TextField label="Company" isRequired defaultValue="Shopify" isReadOnly />
          <TextField label="Job Title" isRequired defaultValue="Product Engineer" isReadOnly className="mt-2.5" />
        </Specimen>
        <Specimen title="Education">
          <TextField label="Institution" isRequired defaultValue="UBC" isReadOnly />
          <TextField label="Major / Specialization" isRequired defaultValue="Computer Science" isReadOnly className="mt-2.5" />
        </Specimen>
        <Specimen title="Certification">
          <TextField label="Certification Board" isRequired defaultValue="Amazon Web Services" isReadOnly />
          <TextField label="Certification / Exam" isRequired defaultValue="AWS Solutions Architect" isReadOnly className="mt-2.5" />
        </Specimen>
      </Grid>
      <Specimen title="Baseline anatomy" style={{ marginTop: 16 }}>
        <Flow steps={[["Header", "Title + close"], ["Form body", "Domain fields"], ["Validation", "Inline + summary"], ["Footer", "Cancel + Save"]]} />
      </Specimen>
      <Specimen title="Behavior" description="The first save fails to show the recoverable error; the second succeeds. Save shows its pending state and the dialog cannot be dismissed while saving." style={{ marginTop: 16 }}>
        <WorkExperienceDemo />
      </Specimen>
    </DocPage>
  );
}

import { useState } from "react";
import { CatalogCombobox, Grid, Stack, type CatalogSelection } from "@career-profile/ui";
import { DocPage, Note, Specimen } from "../../chrome/DocPage";
import { companies, mockSearch } from "../components/mockCatalog";

const titlesByCompany = mockSearch<string | undefined>((company) => ["Senior Product Engineer", "Software Engineer", "Engineering Manager", "Product Designer"].map((label) => ({ id: `${company}-${label}`, label, meta: company ? "At this company" : "Global title" })));
const institutions = mockSearch([{ id: "ubc", label: "University of British Columbia", meta: "Catalog" }, { id: "sfu", label: "Simon Fraser University", meta: "Catalog" }]);
const majors = mockSearch<string | undefined>(() => ["Computer Science", "Data Science", "Design"].map((label) => ({ id: label, label, meta: "Offered here" })));
const degrees = mockSearch<string | undefined>(() => ["Bachelor of Science", "Master of Science"].map((label) => ({ id: label, label, meta: "Catalog" })));
const boards = mockSearch([{ id: "aws", label: "Amazon Web Services", meta: "Catalog" }, { id: "pmi", label: "Project Management Institute", meta: "Catalog" }]);
const exams = mockSearch<string | undefined>(() => ["AWS Certified Cloud Practitioner", "AWS Solutions Architect – Associate"].map((label) => ({ id: label, label, meta: "Catalog" })));

const parentKey = (value: CatalogSelection | null) => (value ? (value.kind === "catalog" ? value.id : `custom:${value.label}`) : undefined);

/** Clears a child selection whenever its parent changes, so a child never outlives an incompatible parent. */
function useDependent(parent: CatalogSelection | null) {
  const [child, setChild] = useState<CatalogSelection | null>(null);
  const [owner, setOwner] = useState(parentKey(parent));
  if (owner !== parentKey(parent)) {
    setOwner(parentKey(parent));
    setChild(null);
  }
  return [child, setChild] as const;
}

export function DependentFieldsPage() {
  const [company, setCompany] = useState<CatalogSelection | null>(null);
  const [title, setTitle] = useDependent(company);
  const [institution, setInstitution] = useState<CatalogSelection | null>(null);
  const [major, setMajor] = useDependent(institution);
  const [degree, setDegree] = useDependent(major);
  const [board, setBoard] = useState<CatalogSelection | null>(null);
  const [exam, setExam] = useDependent(board);
  const custom = (set: (value: CatalogSelection) => void) => (query: string) => set({ kind: "custom", label: query });

  return (
    <DocPage overline="Interaction pattern" title="Dependent fields" description="Children are not rendered until their parent selection exists. Changing a parent clears incompatible child values.">
      <Grid columns={3}>
        <Specimen title="Work Experience">
          <Stack gap={12}>
            <CatalogCombobox label="Company" isRequired customNoun="company" value={company} onChange={setCompany} search={mockSearch(companies)} onCreateCustom={custom(setCompany)} />
            {company ? <CatalogCombobox label="Job Title" isRequired customNoun="job title" value={title} onChange={setTitle} search={titlesByCompany} parentContext={parentKey(company)} onCreateCustom={custom(setTitle)} /> : null}
          </Stack>
        </Specimen>
        <Specimen title="Education">
          <Stack gap={12}>
            <CatalogCombobox label="Institution" isRequired customNoun="institution" value={institution} onChange={setInstitution} search={institutions} onCreateCustom={custom(setInstitution)} />
            {institution ? <CatalogCombobox label="Major / Specialization" isRequired customNoun="major / specialization" value={major} onChange={setMajor} search={majors} parentContext={parentKey(institution)} onCreateCustom={custom(setMajor)} /> : null}
            {major ? <CatalogCombobox label="Degree Type" customNoun="degree type" value={degree} onChange={setDegree} search={degrees} parentContext={parentKey(major)} onCreateCustom={custom(setDegree)} /> : null}
          </Stack>
        </Specimen>
        <Specimen title="Certification">
          <Stack gap={12}>
            <CatalogCombobox label="Certification Board" isRequired customNoun="certification board" value={board} onChange={setBoard} search={boards} onCreateCustom={custom(setBoard)} />
            {board ? <CatalogCombobox label="Certification / Exam" isRequired customNoun="certification" value={exam} onChange={setExam} search={exams} parentContext={parentKey(board)} onCreateCustom={custom(setExam)} /> : null}
          </Stack>
        </Specimen>
      </Grid>
      <Note className="mt-4"><b>Invariant:</b> a child selection cannot remain attached to a parent for which it is invalid.</Note>
    </DocPage>
  );
}

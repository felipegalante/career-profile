import { Button, Checkbox, Dialog, Grid, Select, Stack, TextField } from "@career-profile/ui";
import { DocPage } from "../../chrome/DocPage";

const employmentTypes = ["Full-time", "Part-time", "Contract"].map((label) => ({ id: label, label }));

export function DialogOpenPage() {
  return (
    <DocPage overline="Primitives" title="Dialog (open)" description="A modal record dialog over the page, as in experience/experience-add.html.">
      <Dialog title="Add work experience" isOpen onOpenChange={() => undefined} footer={<><Button variant="secondary">Cancel</Button><Button variant="primary">Save</Button></>}>
        <Stack gap={14}>
          <TextField label="Company" isRequired leadingIcon="search" placeholder="Search companies…" />
          <Select label="Employment Type" placeholder="Select type" items={employmentTypes} />
          <Grid columns={2}>
            <TextField label="Start Date" placeholder="Month / Year" />
            <TextField label="End Date" placeholder="Month / Year" />
          </Grid>
          <Checkbox>I currently work here</Checkbox>
        </Stack>
      </Dialog>
    </DocPage>
  );
}

import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, DialogTrigger, Grid, Icon, Menu, MenuItem, MenuList, MenuSection, MenuSeparator, MenuTrigger, Row, Stack, Surface, Tab, TabList, TabPanel, Tabs, Text, TextField, Tooltip } from "@career-profile/ui";
import { DocPage, NotArtifactBacked, Specimen } from "../../chrome/DocPage";

export function OverlaysPage() {
  return (
    <DocPage overline="Primitives" title="Overlays" description="Dialogs for profile records, menus for contextual actions, and anchored popovers for catalog search.">
      <Grid columns={2}>
        <Specimen title="Dialog shell" description="Shared title, close action, scrollable body, and action footer.">
          <Surface as="div" style={{ boxShadow: "var(--e2)" }}>
            <DialogHeader title="Add work experience" onClose={() => undefined} data-parity-id="dialog-head" />
            <DialogBody data-parity-id="dialog-body">
              <TextField label="Company" defaultValue="Shopify" />
              <TextField label="Job Title" defaultValue="Senior Product Engineer" className="mt-3" />
            </DialogBody>
            <DialogFooter data-parity-id="dialog-foot">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Save</Button>
            </DialogFooter>
          </Surface>
          <DialogTrigger>
            <Button className="mt-4">Open dialog</Button>
            <Dialog title="Add work experience" footer={<><Button slot="close">Cancel</Button><Button variant="primary" slot="close">Save</Button></>}>
              <Stack gap={14}>
                <TextField label="Company" isRequired />
                <TextField label="Start Date" placeholder="Month / Year" />
              </Stack>
            </Dialog>
          </DialogTrigger>
        </Specimen>
        <Specimen title="Menu" description="Use for record and skill contextual actions.">
          <MenuList aria-label="Record actions" data-parity-id="menu">
            <MenuItem id="edit" icon="pencil" data-parity-id="menu-item">Edit</MenuItem>
            <MenuItem id="move" icon="arrow-right">Move to Advanced</MenuItem>
            <MenuItem id="remove" icon="close" tone="danger" data-parity-id="menu-item-danger">Remove</MenuItem>
          </MenuList>
          <Row className="mt-6">
            <MenuTrigger>
              <Button variant="ghost" isIconOnly aria-label="Senior Product Engineer actions"><Icon name="more-horizontal" /></Button>
              <Menu>
                <MenuItem id="edit" icon="pencil">Edit</MenuItem>
                <MenuItem id="remove" icon="close" tone="danger">Remove</MenuItem>
              </Menu>
            </MenuTrigger>
            <MenuTrigger>
              <Button variant="secondary">Move GraphQL</Button>
              <Menu aria-label="Move GraphQL">
                <MenuSection selectionMode="single" defaultSelectedKeys={["INTERMEDIATE"]}>
                  <MenuItem id="BEGINNER">Move to Beginner</MenuItem>
                  <MenuItem id="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem id="ADVANCED">Move to Advanced</MenuItem>
                </MenuSection>
                <MenuSeparator />
                <MenuItem id="remove" tone="danger">Remove skill</MenuItem>
              </Menu>
            </MenuTrigger>
          </Row>
        </Specimen>
        <Specimen title="Tabs" description="Account Profile and Settings tabs. Arrow keys move focus; Enter or Space selects.">
          <Surface as="div" className="shadow-none">
            <Tabs defaultSelectedKey="profile">
              <TabList aria-label="Account" data-parity-id="tabs">
                <Tab id="profile">Profile</Tab>
                <Tab id="settings">Settings</Tab>
              </TabList>
              <TabPanel id="profile" className="p-5"><Text variant="section">Profile information</Text></TabPanel>
              <TabPanel id="settings" className="p-5"><Text variant="section">Security</Text></TabPanel>
            </Tabs>
          </Surface>
        </Specimen>
        <Specimen title="Tooltip" description="Labels for the collapsed navigation rail, shown on hover and keyboard focus.">
          <Row>
            <Tooltip content="Professional Focus"><Button variant="ghost" isIconOnly aria-label="Professional Focus"><Icon name="target" /></Button></Tooltip>
            <NotArtifactBacked />
          </Row>
        </Specimen>
      </Grid>
    </DocPage>
  );
}

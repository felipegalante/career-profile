import { Autocomplete, Button as RACButton, Dialog as RACDialog, Header, Input, Menu, MenuItem, MenuSection, Modal, ModalOverlay, TextField, useFilter } from "react-aria-components";
import { Icon, type IconName } from "../../foundations/Icon";
import { cx } from "../../foundations/classNames";
import { buttonClassName } from "../../primitives/Button/Button";
import dialogStyles from "../../primitives/Dialog/Dialog.module.css";
import { Kbd } from "../../primitives/Kbd/Kbd";
import fieldStyles from "../../primitives/TextField/TextField.module.css";
import styles from "./CommandPalette.module.css";

export interface Command {
  id: string;
  label: string;
  description?: string;
  /** Section heading, for example "Navigation" or "Profile actions". Sections keep first-seen order. */
  group: string;
  icon: IconName;
  href?: string;
  onAction?: () => void;
}

export interface CommandPaletteProps {
  /** Only the commands the current user may run; unavailable commands are omitted, not disabled. */
  commands: Command[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function groupCommands(commands: Command[]): Array<{ group: string; items: Command[] }> {
  const groups = new Map<string, Command[]>();
  for (const command of commands) groups.set(command.group, [...(groups.get(command.group) ?? []), command]);
  return [...groups].map(([group, items]) => ({ group, items }));
}

/**
 * Modal command palette: filter with the search field, move with Arrow Up/Down, run with Enter,
 * close with Escape. Focus returns to whatever was focused when it opened.
 */
export function CommandPalette({ commands, isOpen, onOpenChange }: CommandPaletteProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const close = () => onOpenChange(false);

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className={dialogStyles.overlay}>
      <Modal className={styles.palette}>
        <RACDialog aria-label="Command palette" className={styles.dialog}>
          <Autocomplete filter={contains}>
            <div className={styles.search}>
              <TextField aria-label="Search pages and actions" autoFocus className={fieldStyles.shell}>
                <span className={fieldStyles.lead}><Icon name="search" /></span>
                <Input placeholder="Search pages and actions…" className={cx(fieldStyles.input, fieldStyles.withIcon, styles.input)} />
              </TextField>
            </div>
            <Menu aria-label="Commands" autoFocus="first" className={styles.body} renderEmptyState={() => <div className={styles.empty}>No matching commands</div>}>
              {groupCommands(commands).map(({ group, items }) => (
                <MenuSection key={group} id={group}>
                  <Header className={styles.groupTitle}>{group}</Header>
                  {items.map((command) => (
                    <MenuItem
                      key={command.id}
                      id={command.id}
                      textValue={command.label}
                      href={command.href}
                      onAction={() => {
                        command.onAction?.();
                        close();
                      }}
                      className={styles.item}
                    >
                      {({ isFocused }) => (
                        <>
                          <Icon name={command.icon} />
                          <div className={styles.copy}>
                            <div className={styles.title}>{command.label}</div>
                            {command.description ? <div className={styles.description}>{command.description}</div> : null}
                          </div>
                          {isFocused ? <Kbd aria-hidden="true">Enter</Kbd> : null}
                        </>
                      )}
                    </MenuItem>
                  ))}
                </MenuSection>
              ))}
            </Menu>
          </Autocomplete>
          <div className={cx(dialogStyles.foot, styles.foot)}>
            <span className={styles.hints} aria-hidden="true"><Kbd>↑ ↓</Kbd> Navigate <Kbd>Enter</Kbd> Open</span>
            <RACButton slot="close" className={buttonClassName({ variant: "ghost", size: "sm" })}>
              <Kbd aria-hidden="true">Esc</Kbd> Close
            </RACButton>
          </div>
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}

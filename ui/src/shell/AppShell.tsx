import { useCallback, useId, useState, type ReactNode } from "react";
import { Button as RACButton, Dialog as RACDialog, Link as RACLink, Menu as RACMenu, MenuItem as RACMenuItem, MenuTrigger, Modal, ModalOverlay, Popover, Separator } from "react-aria-components";
import { CommandPalette, type Command } from "../components/CommandPalette/CommandPalette";
import { Icon, type IconName } from "../foundations/Icon";
import { cx } from "../foundations/classNames";
import { Avatar } from "../primitives/Avatar/Avatar";
import { Brand } from "../primitives/Brand/Brand";
import { Button } from "../primitives/Button/Button";
import { Tooltip } from "../primitives/Tooltip/Tooltip";
import { ShellContext, type ShellState } from "./ShellContext";
import { useShellShortcuts } from "./useShellShortcuts";
import styles from "./AppShell.module.css";

export interface ShellNavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

export interface ShellNavSection {
  id: string;
  /** Group heading such as "My profile" or "Administration". */
  label: string;
  items: ShellNavItem[];
}

export interface ShellAccountAction {
  id: string;
  label: string;
  icon: IconName;
  href?: string;
  onAction?: () => void;
  tone?: "default" | "danger";
  /** Draws a separator above this action. */
  separated?: boolean;
}

export interface ShellAccount {
  name: string;
  /** Location or role under the name. */
  subtitle?: string;
  actions: ShellAccountAction[];
}

export interface AppShellProps {
  /** Only the destinations the current user may open; role-gated sections are omitted, not disabled. */
  navigation: ShellNavSection[];
  /** Nav item for the current route; its link is marked with aria-current="page". */
  currentItemId?: string;
  account: ShellAccount;
  /** Commands for the palette. Without commands the palette, its trigger and Cmd/Ctrl+K are off. */
  commands?: Command[];
  defaultCollapsed?: boolean;
  defaultPaletteOpen?: boolean;
  children: ReactNode;
}

function NavLinks({ navigation, currentItemId, isCollapsed, onNavigate }: { navigation: ShellNavSection[]; currentItemId?: string; isCollapsed: boolean; onNavigate?: () => void }) {
  return (
    <>
      {navigation.map((section) => (
        <div key={section.id}>
          <div className={styles.group} aria-hidden="true">{section.label}</div>
          <ul className={styles.nav} aria-label={section.label}>
            {section.items.map((item) => (
              <li key={item.id}>
                <Tooltip content={item.label} isDisabled={!isCollapsed}>
                  <RACLink href={item.href} className={styles.link} aria-current={item.id === currentItemId ? "page" : undefined} onPress={onNavigate}>
                    <Icon name={item.icon} />
                    <span className={styles.collapsible}>{item.label}</span>
                  </RACLink>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function AccountMenu({ account }: { account: ShellAccount }) {
  return (
    <MenuTrigger>
      <RACButton className={styles.userbox} aria-haspopup="menu">
        <Avatar name={account.name} />
        <span className={cx(styles.userText, styles.collapsible)}>
          <span className={styles.userName}>{account.name}</span>
          {account.subtitle ? <span className={styles.userMeta}>{account.subtitle}</span> : null}
        </span>
        <Icon name="chevron-down" className={styles.chevron} />
      </RACButton>
      <Popover placement="top start" offset={6}>
        <RACMenu aria-label="Account" className={styles.accountMenu}>
          {account.actions.flatMap((action) => [
            action.separated ? <Separator key={`${action.id}-separator`} className={styles.separator} /> : null,
            <RACMenuItem key={action.id} id={action.id} href={action.href} onAction={action.onAction} textValue={action.label} className={cx(styles.accountItem, action.tone === "danger" && styles.accountDanger)}>
              <Icon name={action.icon} />
              {action.label}
            </RACMenuItem>,
          ])}
        </RACMenu>
      </Popover>
    </MenuTrigger>
  );
}

function NavigationDrawer({ isOpen, onOpenChange, navigation, currentItemId, account }: { isOpen: boolean; onOpenChange: (open: boolean) => void; navigation: ShellNavSection[]; currentItemId?: string; account: ShellAccount }) {
  const close = () => onOpenChange(false);
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className={styles.drawerOverlay}>
      <Modal className={styles.drawer}>
        <RACDialog aria-label="Navigation" className={styles.drawerDialog}>
          <div className={styles.drawerHead}>
            <Brand className={styles.brand} />
            <Button variant="ghost" isIconOnly slot="close" aria-label="Close navigation"><Icon name="close" /></Button>
          </div>
          <nav aria-label="Primary">
            <NavLinks navigation={navigation} currentItemId={currentItemId} isCollapsed={false} onNavigate={close} />
          </nav>
          <div className={styles.drawerAccount}>
            <div className={styles.drawerIdentity}>
              <Avatar name={account.name} />
              <span className={styles.userText}>
                <span className={styles.userName}>{account.name}</span>
                {account.subtitle ? <span className={styles.userMeta}>{account.subtitle}</span> : null}
              </span>
            </div>
            <ul className={styles.nav} aria-label="Account">
              {account.actions.map((action) => (
                <li key={action.id}>
                  <RACLink
                    href={action.href}
                    onPress={() => {
                      action.onAction?.();
                      close();
                    }}
                    className={cx(styles.accountItem, action.tone === "danger" && styles.accountDanger)}
                  >
                    <Icon name={action.icon} />
                    {action.label}
                  </RACLink>
                </li>
              ))}
            </ul>
          </div>
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}

/**
 * Authenticated application frame: a 236px navigation rail (72px collapsed) with the account
 * menu, the command palette, Cmd/Ctrl+B and Cmd/Ctrl+K, and a top bar with a navigation drawer
 * at 860px and below. Collapsing only changes presentation, so page state and the route persist.
 */
export function AppShell({ navigation, currentItemId, account, commands, defaultCollapsed = false, defaultPaletteOpen = false, children }: AppShellProps) {
  const [isCollapsed, setCollapsed] = useState(defaultCollapsed);
  const [isPaletteOpen, setPaletteOpen] = useState(defaultPaletteOpen);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const sidebarId = useId();
  const hasPalette = Boolean(commands && commands.length > 0);

  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);
  const openPalette = useCallback(() => {
    if (!hasPalette) return;
    if (isPaletteOpen) {
      document.querySelector<HTMLInputElement>('[aria-label="Search pages and actions"]')?.focus();
      return;
    }
    setPaletteOpen(true);
  }, [hasPalette, isPaletteOpen]);

  useShellShortcuts({ onToggleSidebar: toggleCollapsed, onOpenPalette: openPalette });

  const shellState: ShellState = { isCollapsed, toggleCollapsed, openPalette, hasPalette, sidebarId };

  return (
    <ShellContext.Provider value={shellState}>
      <div className={cx(styles.shell, isCollapsed && styles.collapsed)} data-collapsed={isCollapsed || undefined}>
        <aside id={sidebarId} className={styles.side}>
          <Brand className={styles.brand} nameClassName={styles.collapsible} />
          <nav aria-label="Primary">
            <NavLinks navigation={navigation} currentItemId={currentItemId} isCollapsed={isCollapsed} />
          </nav>
          <AccountMenu account={account} />
        </aside>
        <header className={styles.mobileTop}>
          <Brand />
          <Button variant="secondary" isIconOnly aria-label="Open navigation" aria-expanded={isDrawerOpen} onPress={() => setDrawerOpen(true)}>
            <span aria-hidden="true" className={styles.hamburger}>☰</span>
          </Button>
        </header>
        <main className={styles.main}>{children}</main>
        <NavigationDrawer isOpen={isDrawerOpen} onOpenChange={setDrawerOpen} navigation={navigation} currentItemId={currentItemId} account={account} />
        {hasPalette && commands ? <CommandPalette commands={commands} isOpen={isPaletteOpen} onOpenChange={setPaletteOpen} /> : null}
      </div>
    </ShellContext.Provider>
  );
}

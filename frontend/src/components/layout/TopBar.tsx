import { GearIcon, MenuIcon, PlusIcon } from '../common/Icon';
import { IconButton } from '../common/IconButton';

export interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCreateConversation: () => void;
  onOpenSettings: () => void;
}

/**
 * 顶栏：极简三控件（☰ ➕ ⚙），中间留空不遮挡角色。
 * 依据 立项文档 F10 / 3.3 主界面线框。
 */
export function TopBar({
  sidebarOpen,
  onToggleSidebar,
  onCreateConversation,
  onOpenSettings,
}: TopBarProps) {
  return (
    <header
      data-testid="top-bar"
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex animate-rise-in items-center justify-between px-5 py-4"
    >
      <div className="pointer-events-auto">
        <IconButton
          label={sidebarOpen ? '收起会话列表' : '展开会话列表'}
          active={sidebarOpen}
          onClick={onToggleSidebar}
        >
          <MenuIcon />
        </IconButton>
      </div>

      <div
        className="pointer-events-auto flex items-center gap-2"
        style={{ animationDelay: '80ms' }}
      >
        <IconButton label="新建会话" onClick={onCreateConversation}>
          <PlusIcon />
        </IconButton>
        <IconButton label="打开设置" onClick={onOpenSettings}>
          <GearIcon />
        </IconButton>
      </div>
    </header>
  );
}

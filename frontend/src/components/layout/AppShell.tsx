import { Link } from 'react-router-dom';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';
import { selectActiveConfig, useModelStore } from '../../stores/modelStore';
import { useUiStore } from '../../stores/uiStore';
import { ConversationSidebar } from '../chat/ConversationSidebar';
import { ChatDock } from '../chat/ChatDock';
import { MessageList } from '../chat/MessageList';
import { Live2DStage } from '../live2d/Live2DStage';
import { SettingsPanel } from '../settings/SettingsPanel';
import { AtmosphereBackground } from './AtmosphereBackground';
import { TopBar } from './TopBar';

const STAGE_HINT =
  '点击右上角设置导入你的 Live2D 模型吧～（也可以直接把模型丢进 public/models 目录）';

/** 主界面骨架：全屏角色 + 半透明聊天层 + 可滑出的会话侧栏 */
export function AppShell() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);

  const status = useChatStore((state) => state.status);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const createConversation = useChatStore((state) => state.createConversation);
  const messageCount = useChatStore((state) => state.messages.length);

  const characterName = useCharacterStore((state) => state.character?.name ?? '角色');
  const activeConfig = useModelStore((state) => selectActiveConfig(state));

  const missingModel = !activeConfig;

  return (
    <div className="relative h-full overflow-hidden">
      <AtmosphereBackground />

      <Live2DStage hint={messageCount === 0 ? STAGE_HINT : undefined} />

      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onCreateConversation={() => void createConversation()}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ConversationSidebar />
      <SettingsPanel />

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-5">
          <MessageList />

          <div className="pb-5">
            {missingModel ? (
              <p className="mb-2 animate-fade-in text-center text-xs leading-relaxed text-ink-soft">
                还没有可用的模型配置，先去
                <Link
                  className="mx-1 text-pink-deep underline underline-offset-2"
                  to="/diagnostics"
                >
                  骨架自检页
                </Link>
                写入一个 Mock 模型即可开聊（引导向导随后接入）
              </p>
            ) : null}

            <ChatDock
              onSend={(text) => void sendMessage(text)}
              sending={status === 'sending'}
              disabled={missingModel}
              disabledHint={missingModel ? '配置模型后才能开始对话' : undefined}
              placeholder={`和${characterName}说点什么…`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

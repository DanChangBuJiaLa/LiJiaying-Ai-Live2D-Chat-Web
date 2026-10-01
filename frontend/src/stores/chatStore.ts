import { create } from 'zustand';
import type { ChatContextMessage, Conversation, Message } from '@shared';
import {
  createConversation as createConversationRecord,
  deleteConversation as deleteConversationRecord,
  listConversations,
  renameConversationByFirstMessage,
  setConversationActiveModel,
  touchConversation,
} from '../db/repositories/conversationRepository';
import { addMessage, listMessages } from '../db/repositories/messageRepository';
import { sendChatMessage } from '../services/chatApi';
import {
  buildContextMessages,
  buildSystemPrompt,
  DEFAULT_CONTEXT_WINDOW,
} from '../utils/systemPrompt';
import { useCharacterStore } from './characterStore';
import { useLive2dStore } from './live2dStore';
import { selectActiveConfig, useModelStore } from './modelStore';

export type ChatStatus = 'idle' | 'sending' | 'error';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  status: ChatStatus;
  error: string | null;
  /** 启动时加载会话列表，并恢复最近一次会话 */
  load: () => Promise<void>;
  createConversation: () => Promise<string | null>;
  selectConversation: (id: string) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
  /** 发送用户消息并写入模型回复（含持久化与表情联动） */
  sendMessage: (text: string) => Promise<void>;
  /** 新建会话并插入角色开场白（本地生成，不消耗 API） */
  greetInNewConversation: (greeting: string) => Promise<void>;
  /** 切换模型：更新全局激活配置，同时记录到当前会话（上下文不丢） */
  switchModel: (modelConfigId: string) => Promise<void>;
  clearError: () => void;
}

function toHistory(messages: Message[]): Array<{ role: Message['role']; content: string }> {
  return messages.map((message) => ({ role: message.role, content: message.content }));
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  status: 'idle',
  error: null,

  load: async () => {
    try {
      const conversations = await listConversations();
      const [latest] = conversations;
      set({ conversations });

      if (latest) {
        const messages = await listMessages(latest.id);
        set({ activeConversationId: latest.id, messages });
      }
    } catch (cause) {
      set({ error: cause instanceof Error ? cause.message : String(cause) });
    }
  },

  createConversation: async () => {
    const character = useCharacterStore.getState().character;
    const modelConfig = selectActiveConfig(useModelStore.getState());

    if (!character || !modelConfig) {
      set({ status: 'error', error: '请先完成角色与模型配置，再开始新会话' });
      return null;
    }

    const conversation = await createConversationRecord({
      characterId: character.id,
      activeModelId: modelConfig.id,
    });

    set({
      conversations: [conversation, ...get().conversations],
      activeConversationId: conversation.id,
      messages: [],
      status: 'idle',
      error: null,
    });

    return conversation.id;
  },

  selectConversation: async (id) => {
    const messages = await listMessages(id);
    set({ activeConversationId: id, messages, status: 'idle', error: null });
  },

  removeConversation: async (id) => {
    await deleteConversationRecord(id);
    const conversations = await listConversations();
    const nextActive =
      get().activeConversationId === id
        ? (conversations[0]?.id ?? null)
        : get().activeConversationId;
    const messages = nextActive ? await listMessages(nextActive) : [];

    set({ conversations, activeConversationId: nextActive, messages });
  },

  sendMessage: async (text) => {
    const content = text.trim();
    if (!content || get().status === 'sending') {
      return;
    }

    const character = useCharacterStore.getState().character;
    const modelConfig = selectActiveConfig(useModelStore.getState());

    if (!character || !modelConfig) {
      set({ status: 'error', error: '缺少角色设定或模型配置，请先完成引导设置' });
      return;
    }

    // 没有会话时自动开一个，保证「打开就能聊」
    let conversationId = get().activeConversationId;
    if (!conversationId) {
      conversationId = await get().createConversation();
      if (!conversationId) {
        return;
      }
    }

    // 标题取「第一句用户消息」——不能只看会话是否为空，因为角色开场白会先占掉一条消息
    const isFirstUserMessage = !get().messages.some((message) => message.role === 'user');
    const userMessage = await addMessage({ conversationId, role: 'user', content });

    set({ messages: [...get().messages, userMessage], status: 'sending', error: null });

    try {
      const contextMessages: ChatContextMessage[] = buildContextMessages({
        systemPrompt: buildSystemPrompt(character),
        history: toHistory(get().messages),
        contextWindow: modelConfig.contextWindow || DEFAULT_CONTEXT_WINDOW,
      });

      const result = await sendChatMessage({
        conversationId,
        modelConfigId: modelConfig.id,
        messages: contextMessages,
      });

      const assistantMessage = await addMessage({
        conversationId,
        role: 'assistant',
        content: result.response.text,
        emotion: result.response.emotion,
        action: result.response.action,
        expression: result.response.expression,
        toolCalls: result.response.tool_calls,
      });

      await touchConversation(conversationId);
      if (isFirstUserMessage) {
        await renameConversationByFirstMessage(conversationId, content);
      }

      useLive2dStore.getState().setEmotion(result.response.emotion, {
        expression: result.response.expression,
        action: result.response.action,
      });

      set({
        messages: [...get().messages, assistantMessage],
        conversations: await listConversations(),
        status: 'idle',
        error: null,
      });
    } catch (cause) {
      set({
        status: 'error',
        error: cause instanceof Error ? cause.message : String(cause),
      });
    }
  },

  greetInNewConversation: async (greeting) => {
    const conversationId = await get().createConversation();
    if (!conversationId) {
      return;
    }

    const message = await addMessage({
      conversationId,
      role: 'assistant',
      content: greeting,
      emotion: 'happy',
      action: 'greeting',
      expression: 'smile',
    });

    useLive2dStore.getState().setEmotion('happy', { expression: 'smile', action: 'greeting' });
    set({ messages: [message] });
  },

  switchModel: async (modelConfigId) => {
    await useModelStore.getState().activate(modelConfigId);

    const conversationId = get().activeConversationId;
    if (conversationId) {
      await setConversationActiveModel(conversationId, modelConfigId);
      set({ conversations: await listConversations() });
    }
  },

  clearError: () => set({ error: null, status: 'idle' }),
}));

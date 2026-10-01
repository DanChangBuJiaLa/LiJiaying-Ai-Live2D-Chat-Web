import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// 自托管字体：正文用霞鹜文楷，标题用站酷快乐体（不依赖外网，加载稳定）
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css';
import '@fontsource/zcool-kuaile/400.css';
import './styles/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('找不到 #root 挂载节点');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

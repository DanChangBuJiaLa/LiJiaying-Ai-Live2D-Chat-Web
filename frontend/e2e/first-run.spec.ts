import { expect, test, type Page } from '@playwright/test';

/**
 * 首次使用全流程 E2E（对应立项文档 3.1 流程与验收 A6 / R1）。
 * 交流程依赖后端 Mock，所以运行前需要 `npm run dev`（Playwright 会自动复用已在跑的服务）。
 */

/** 走完「欢迎页 → 3 步向导 → 进入聊天」并等角色开口 */
async function completeOnboarding(page: Page): Promise<void> {
  await page.goto('/');

  await page.getByRole('button', { name: '开始使用' }).click();

  const nextStep = page.getByRole('button', { name: '下一步' });
  await page.getByRole('button', { name: '测试连接' }).click();
  await expect(nextStep).toBeEnabled({ timeout: 30_000 });

  await nextStep.click();
  await nextStep.click();
  await page.getByRole('button', { name: '完成，开始聊天' }).click();

  await expect(page.locator('article').first()).toBeVisible({ timeout: 30_000 });
}

test('首次使用：无配置停在欢迎页，测试连接不通过就无法进入聊天', async ({ page }) => {
  await page.goto('/');

  // 无配置 → 欢迎页（而不是直接进聊天）
  await expect(page.getByRole('heading', { name: /聊聊天吧/ })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '聊天输入框' })).toHaveCount(0);

  await page.getByRole('button', { name: '开始使用' }).click();

  // 向导第 1 步：门禁生效，且没有任何跳过入口
  const nextStep = page.getByRole('button', { name: '下一步' });
  await expect(nextStep).toBeDisabled();
  await expect(page.getByText('请先让「测试连接」通过')).toBeVisible();
  await expect(page.getByRole('button', { name: /跳过|稍后/ })).toHaveCount(0);

  // 测试连接通过后放行
  await page.getByRole('button', { name: '测试连接' }).click();
  await expect(nextStep).toBeEnabled({ timeout: 30_000 });
  await expect(page.getByText('请先让「测试连接」通过')).toBeHidden();
});

test('对话链路与持久化：结构化回复 + 刷新后历史仍在', async ({ page }) => {
  await completeOnboarding(page);

  const bubbles = page.locator('article');
  await expect(bubbles).toHaveCount(1);
  await expect(bubbles.first()).toContainText('羽澄糯');

  const composer = page.getByRole('textbox', { name: '聊天输入框' });
  await composer.fill('今天有点累，陪我说说话好吗');
  await composer.press('Enter');

  await expect(bubbles).toHaveCount(3, { timeout: 30_000 });
  await expect(bubbles.last()).toContainText('我不太会安慰人');

  // IndexedDB 持久化：刷新后消息仍在
  await page.reload();
  await expect(bubbles).toHaveCount(3, { timeout: 30_000 });
  await expect(bubbles.last()).toContainText('我不太会安慰人');
});

test('导出聊天记录：JSON 备份与 Markdown 都真的触发下载且内容正确', async ({ page }) => {
  await completeOnboarding(page);

  // 先造点数据
  const composer = page.getByRole('textbox', { name: '聊天输入框' });
  await composer.fill('导出测试');
  await composer.press('Enter');
  await expect(page.locator('article')).toHaveCount(3, { timeout: 30_000 });

  await page.getByRole('button', { name: '打开设置' }).click();
  const settings = page.getByRole('complementary', { name: '设置' });
  await settings.getByRole('button', { name: '偏好' }).click();

  // 1) 导出全部（JSON）
  const jsonDownloadPromise = page.waitForEvent('download');
  await settings.getByRole('button', { name: '导出全部（JSON）' }).click();
  const jsonDownload = await jsonDownloadPromise;
  expect(jsonDownload.suggestedFilename()).toMatch(
    /^ai-live2d-chat_\d{4}-\d{2}-\d{2}_\d{4}\.json$/,
  );
  await expect(settings.getByRole('status')).toContainText('已导出 1 个会话');

  // 2) 导出当前会话（Markdown），并校验内容真的写进去了
  const markdownDownloadPromise = page.waitForEvent('download');
  await settings.getByRole('button', { name: '导出当前会话（Markdown）' }).click();
  const markdownDownload = await markdownDownloadPromise;
  expect(markdownDownload.suggestedFilename()).toMatch(/\.md$/);

  const stream = await markdownDownload.createReadStream();
  const content = await new Promise<string>((resolve, reject) => {
    let text = '';
    stream.on('data', (chunk) => {
      text += chunk.toString();
    });
    stream.on('end', () => resolve(text));
    stream.on('error', reject);
  });

  expect(content).toContain('# 导出测试');
  expect(content).toContain('**你**');
  expect(content).toContain('羽澄糯');
  // 开场白也会被导出
  expect(content).toContain('终于见到你啦');
  // system 提示词不应该泄漏进导出文件
  expect(content).not.toContain('【输出要求】');
});

test('布局约束：不横向溢出、聊天条贴底、顶栏控件可点击且生效', async ({ page }) => {
  await completeOnboarding(page);

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const { width, height } = viewport as { width: number; height: number };

  // 1) 不横向溢出
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  expect(metrics.scrollWidth, `${width}px 下不应横向溢出`).toBeLessThanOrEqual(width + 1);
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(width + 1);

  // 2) 聊天条贴底且完整落在视口内
  const dock = page.getByTestId('chat-dock');
  const dockBox = await dock.boundingBox();
  expect(dockBox).not.toBeNull();
  const dockBottomGap =
    height -
    ((dockBox as { y: number; height: number }).y + (dockBox as { height: number }).height);
  expect(dockBottomGap, '聊天条底部不应超出视口').toBeGreaterThanOrEqual(-1);
  expect(dockBottomGap, '聊天条应贴近底部').toBeLessThan(80);

  // 3) 顶栏三个控件都在视口内，且不与聊天条重叠
  const topBar = page.getByTestId('top-bar');
  const topBarBox = await topBar.boundingBox();
  expect(topBarBox).not.toBeNull();
  expect(
    (topBarBox as { y: number; height: number }).y + (topBarBox as { height: number }).height,
  ).toBeLessThanOrEqual((dockBox as { y: number }).y);

  for (const label of ['展开会话列表', '新建会话', '打开设置']) {
    const box = await topBar.getByRole('button', { name: label }).boundingBox();
    expect(box, `${label} 应当可见`).not.toBeNull();
    const { x, y, width: boxWidth } = box as { x: number; y: number; width: number };
    expect(x).toBeGreaterThanOrEqual(0);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(x + boxWidth).toBeLessThanOrEqual(width + 1);
  }

  // 4) 控件真的可点击且生效（侧栏与设置抽屉必须真的滑入）
  const sidebar = page.getByRole('complementary', { name: '会话列表' });
  const sidebarToggle = topBar.getByRole('button', { name: /(展开|收起)会话列表/ });

  await sidebarToggle.click();
  await expect(sidebar).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  // 抽屉里的关闭按钮（与顶栏开关同名，必须限定在抽屉内）
  await sidebar.getByRole('button', { name: '收起会话列表' }).click();
  await expect(sidebar).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  const settings = page.getByRole('complementary', { name: '设置' });
  await topBar.getByRole('button', { name: '打开设置' }).click();
  await expect(settings).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await settings.getByRole('button', { name: '关闭设置' }).click();
  await expect(settings).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await page.screenshot({ path: `frontend/e2e/.artifacts/chat-${width}x${height}.png` });
});

/**
 * 全屏氛围背景：多层柔光 + 缓慢漂移的光斑 + 纸纹噪点。
 * 纯装饰，不接收指针事件，也不进无障碍树。
 */
export function AtmosphereBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 基础柔光层 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58rem 40rem at 10% -12%, #FFE3A3 0%, transparent 58%),' +
            'radial-gradient(52rem 38rem at 94% 6%, #FFD9E2 0%, transparent 62%),' +
            'radial-gradient(48rem 36rem at 72% 104%, #DCF3E9 0%, transparent 60%),' +
            'linear-gradient(180deg, #FDF9F4 0%, #FBF3EC 100%)',
        }}
      />

      {/* 漂移光斑：给画面一点呼吸感 */}
      <div
        className="absolute -left-24 top-1/4 h-[26rem] w-[26rem] animate-drift rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFD9E2 0%, transparent 70%)' }}
      />
      <div
        className="absolute -right-20 top-8 h-[22rem] w-[22rem] animate-drift rounded-full opacity-50 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #FFF1CC 0%, transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute bottom-[-6rem] left-1/3 h-[24rem] w-[24rem] animate-drift rounded-full opacity-45 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #DCF3E9 0%, transparent 70%)',
          animationDelay: '-11s',
        }}
      />

      {/* 纸纹噪点 */}
      <div className="noise-overlay absolute inset-0" />

      {/* 几颗小心心 / 星星点缀 */}
      <div
        className="absolute left-[12%] top-[18%] animate-float text-pink/50"
        style={{ animationDelay: '-1s' }}
      >
        <Sparkle size={18} />
      </div>
      <div
        className="absolute right-[18%] top-[28%] animate-float text-yolk/70"
        style={{ animationDelay: '-3s' }}
      >
        <Sparkle size={12} />
      </div>
      <div
        className="absolute right-[30%] bottom-[22%] animate-float text-mint/70"
        style={{ animationDelay: '-2s' }}
      >
        <Sparkle size={14} />
      </div>
    </div>
  );
}

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.6l1.9 5.3 5.3 1.9-5.3 1.9L12 17l-1.9-5.3L4.8 9.8l5.3-1.9L12 2.6z" />
    </svg>
  );
}

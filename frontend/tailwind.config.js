/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主基调：奶白纸感
        cream: {
          DEFAULT: '#FDF9F4',
          deep: '#F6EDE4',
          sunk: '#EFE3D8',
        },
        // 糯糯主题色：淡粉 / 鹅黄 / 薄荷绿 / 雾蓝
        pink: {
          DEFAULT: '#FFB8C8',
          soft: '#FFD9E2',
          deep: '#F79CB0',
        },
        yolk: {
          DEFAULT: '#FFE3A3',
          soft: '#FFF1CC',
        },
        mint: {
          DEFAULT: '#B7E4D0',
          soft: '#DCF3E9',
        },
        sky: {
          DEFAULT: '#C7DCEF',
          soft: '#E4EFF8',
        },
        // 文字：暖棕，不用纯黑
        ink: {
          DEFAULT: '#6B5B57',
          soft: '#9C8B86',
          deep: '#4A3E3B',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"LXGW WenKai"', 'system-ui', 'sans-serif'],
        body: [
          '"LXGW WenKai"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
      borderRadius: {
        bubble: '22px',
        blob: '28px',
        panel: '32px',
      },
      boxShadow: {
        soft: '0 12px 32px -12px rgba(160, 130, 130, 0.35)',
        frosted: '0 8px 40px -8px rgba(160, 130, 130, 0.28)',
        lift: '0 18px 42px -14px rgba(160, 130, 130, 0.45)',
        glow: '0 0 60px -10px rgba(255, 184, 200, 0.65)',
      },
      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(8px)' },
          '60%': { opacity: '1', transform: 'scale(1.02) translateY(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(24px, -18px, 0) scale(1.06)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.45' },
          '40%': { transform: 'translateY(-6px)', opacity: '1' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'pop-in': 'pop-in 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-in-left': 'slide-in-left 0.32s cubic-bezier(0.22, 1, 0.36, 1) both',
        drift: 'drift 16s ease-in-out infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

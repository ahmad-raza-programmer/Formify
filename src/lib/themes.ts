export type ThemeConfig = {
  id: string;
  name: string;
  canvasBg: string;
  formBg: string;
  textColor: string;
  headingColor: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  fontFamily: string;
  borderRadius: string;
};

export const THEMES: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    name: 'Default',
    canvasBg: 'bg-gray-50',
    formBg: 'bg-white',
    textColor: 'text-gray-700',
    headingColor: 'text-gray-900',
    inputBg: 'bg-gray-50',
    inputBorder: 'border-gray-300',
    inputFocus: 'focus:ring-green-500 focus:border-green-500',
    buttonBg: 'bg-green-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-green-700',
    fontFamily: 'font-sans',
    borderRadius: 'rounded-xl',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    canvasBg: 'bg-white',
    formBg: 'bg-white',
    textColor: 'text-gray-600',
    headingColor: 'text-black',
    inputBg: 'bg-transparent',
    inputBorder: 'border-b border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none',
    inputFocus: 'focus:ring-0 focus:border-black',
    buttonBg: 'bg-black',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-gray-800',
    fontFamily: 'font-sans',
    borderRadius: 'rounded-none',
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    canvasBg: 'bg-gray-900',
    formBg: 'bg-gray-800',
    textColor: 'text-gray-300',
    headingColor: 'text-white',
    inputBg: 'bg-gray-700',
    inputBorder: 'border-gray-600',
    inputFocus: 'focus:ring-emerald-500 focus:border-emerald-500',
    buttonBg: 'bg-emerald-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-emerald-700',
    fontFamily: 'font-sans',
    borderRadius: 'rounded-lg',
  },
  playful: {
    id: 'playful',
    name: 'Playful',
    canvasBg: 'bg-yellow-50',
    formBg: 'bg-white',
    textColor: 'text-indigo-900',
    headingColor: 'text-pink-600',
    inputBg: 'bg-yellow-50/50',
    inputBorder: 'border-pink-200',
    inputFocus: 'focus:ring-pink-500 focus:border-pink-500',
    buttonBg: 'bg-pink-500',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-pink-600',
    fontFamily: 'font-sans',
    borderRadius: 'rounded-3xl',
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    canvasBg: 'bg-slate-100',
    formBg: 'bg-white',
    textColor: 'text-slate-700',
    headingColor: 'text-slate-900',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-300',
    inputFocus: 'focus:ring-blue-600 focus:border-blue-600',
    buttonBg: 'bg-blue-600',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-blue-700',
    fontFamily: 'font-sans',
    borderRadius: 'rounded-sm',
  }
};

export const getTheme = (themeId?: string): ThemeConfig => {
  return THEMES[themeId || 'default'] || THEMES['default'];
};

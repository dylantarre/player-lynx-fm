import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { themes } from 'storybook/theming'
import { ColorSchemeContext } from '../src/App'
import '../src/index.css'
import '../src/styles/global.css'

const defaultColorScheme = {
  from: 'from-pink-950',
  via: 'via-fuchsia-950',
  to: 'to-slate-900',
  accent1: 'from-cyan-400/30',
  accent2: 'from-teal-400/30',
  accent3: 'from-emerald-400/30'
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      theme: themes.dark,
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ColorSchemeContext.Provider value={{ colorScheme: defaultColorScheme, setColorScheme: () => {} }}>
          <Story />
        </ColorSchemeContext.Provider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
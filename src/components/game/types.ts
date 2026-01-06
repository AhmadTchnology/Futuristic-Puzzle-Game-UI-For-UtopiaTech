export type ModuleType = 'AUTH' | 'DATA' | 'RENDER';

export interface GameModule {
  id: string;
  type: ModuleType;
  label: string;
  subLabel: string;
  color: string; // Hex color for glow
  icon: string;
}

export const MODULES: GameModule[] = [
  {
    id: 'auth_mod',
    type: 'AUTH',
    label: 'USER_AUTH',
    subLabel: '[Login]',
    color: '#00E6FF', // Cyan
    icon: 'Lock'
  },
  {
    id: 'data_mod',
    type: 'DATA',
    label: 'DATA_CORE',
    subLabel: '[Database]',
    color: '#B066FF', // Purple
    icon: 'Database'
  },
  {
    id: 'render_mod',
    type: 'RENDER',
    label: 'INTERFACE_RENDER',
    subLabel: '[Design]',
    color: '#58A6FF', // Mixed/Blueish
    icon: 'Layout'
  }
];

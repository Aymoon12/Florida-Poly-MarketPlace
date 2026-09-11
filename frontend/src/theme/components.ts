import { Components, Theme } from '@mui/material/styles';

export const getComponentOverrides = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: mode === 'light' ? '#F3F4F6' : '#1F2937',
        },
        '&::-webkit-scrollbar-thumb': {
          background: mode === 'light' ? '#D1D5DB' : '#4B5563',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: mode === 'light' ? '#9CA3AF' : '#6B7280',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '10px 20px',
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
      },
      containedPrimary: {
        background: mode === 'light'
          ? 'linear-gradient(135deg, #532D8E 0%, #6B46C1 100%)'
          : 'linear-gradient(135deg, #6B46C1 0%, #8B6DC4 100%)',
        '&:hover': {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #3D2066 0%, #532D8E 100%)'
            : 'linear-gradient(135deg, #532D8E 0%, #6B46C1 100%)',
        },
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
      outlinedPrimary: {
        borderColor: mode === 'light' ? '#532D8E' : '#8B6DC4',
        color: mode === 'light' ? '#532D8E' : '#8B6DC4',
        '&:hover': {
          borderColor: mode === 'light' ? '#3D2066' : '#A78BDB',
          backgroundColor: mode === 'light'
            ? 'rgba(83, 45, 142, 0.04)'
            : 'rgba(139, 109, 196, 0.08)',
        },
      },
      sizeSmall: {
        padding: '6px 14px',
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: '14px 28px',
        fontSize: '1rem',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: mode === 'light'
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: mode === 'light'
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '16px',
        '&:last-child': {
          paddingBottom: '16px',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          transition: 'all 0.2s ease-in-out',
          '& fieldset': {
            borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: mode === 'light' ? '#532D8E' : '#8B6DC4',
          },
          '&.Mui-focused fieldset': {
            borderColor: mode === 'light' ? '#532D8E' : '#8B6DC4',
            borderWidth: '2px',
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorPrimary': {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #532D8E 0%, #6B46C1 100%)'
            : 'linear-gradient(135deg, #6B46C1 0%, #8B6DC4 100%)',
        },
      },
      outlined: {
        borderWidth: '1.5px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: mode === 'light'
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
      },
      elevation2: {
        boxShadow: mode === 'light'
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
      },
      elevation3: {
        boxShadow: mode === 'light'
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: mode === 'light'
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9375rem',
        minHeight: '48px',
        '&.Mui-selected': {
          fontWeight: 600,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: '3px',
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: mode === 'light'
            ? 'rgba(83, 45, 142, 0.08)'
            : 'rgba(139, 109, 196, 0.12)',
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'light' ? '#532D8E' : '#8B6DC4',
        color: '#FFFFFF',
        fontWeight: 600,
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
      },
      standardSuccess: {
        backgroundColor: mode === 'light'
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(52, 211, 153, 0.15)',
      },
      standardError: {
        backgroundColor: mode === 'light'
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(248, 113, 113, 0.15)',
      },
      standardWarning: {
        backgroundColor: mode === 'light'
          ? 'rgba(245, 158, 11, 0.1)'
          : 'rgba(251, 191, 36, 0.15)',
      },
      standardInfo: {
        backgroundColor: mode === 'light'
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(96, 165, 250, 0.15)',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        margin: '2px 8px',
        '&.Mui-selected': {
          backgroundColor: mode === 'light'
            ? 'rgba(83, 45, 142, 0.08)'
            : 'rgba(139, 109, 196, 0.12)',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(83, 45, 142, 0.12)'
              : 'rgba(139, 109, 196, 0.16)',
          },
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: mode === 'light' ? '#1F2937' : '#F9FAFB',
        color: mode === 'light' ? '#F9FAFB' : '#1F2937',
        fontSize: '0.8125rem',
        fontWeight: 500,
        borderRadius: '6px',
        padding: '8px 12px',
      },
      arrow: {
        color: mode === 'light' ? '#1F2937' : '#F9FAFB',
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: mode === 'light'
          ? 'rgba(0, 0, 0, 0.08)'
          : 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
});

import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onClear?: () => void;
  onFilterClick?: () => void;
  placeholder?: string;
  showButton?: boolean;
  showFilterButton?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  onChange,
  onSubmit,
  onClear,
  onFilterClick,
  placeholder = 'Search for items...',
  showButton = true,
  showFilterButton = false,
  fullWidth = true,
  variant = 'default',
  size = 'medium',
  autoFocus = false,
}) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onClear?.();
    onChange?.('');
  };

  const sizeStyles = {
    small: {
      py: 0.75,
      px: 1.5,
      fontSize: '0.875rem',
      iconSize: 18,
      buttonPy: 0.75,
      buttonPx: 2,
    },
    medium: {
      py: 1,
      px: 2,
      fontSize: '1rem',
      iconSize: 20,
      buttonPy: 1.25,
      buttonPx: 3,
    },
    large: {
      py: 1.25,
      px: 2.5,
      fontSize: '1.125rem',
      iconSize: 24,
      buttonPy: 1.5,
      buttonPx: 4,
    },
  };

  const styles = sizeStyles[size];

  const variantStyles = {
    default: {
      backgroundColor: theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
      border: `1px solid ${theme.palette.divider}`,
      '&:hover, &:focus-within': {
        boxShadow: theme.palette.mode === 'light'
          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
        borderColor: 'primary.main',
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `1.5px solid ${theme.palette.divider}`,
      '&:hover, &:focus-within': {
        borderColor: 'primary.main',
      },
    },
    filled: {
      backgroundColor: theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
      border: 'none',
      '&:hover, &:focus-within': {
        backgroundColor: theme.palette.mode === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[600],
      },
    },
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '50px',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        width: fullWidth ? '100%' : 'auto',
        ...variantStyles[variant],
      }}
    >
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
        sx={{
          flexGrow: 1,
          py: styles.py,
          px: styles.px,
          fontSize: styles.fontSize,
          fontWeight: 500,
          '& input': {
            '&::placeholder': {
              color: theme.palette.text.secondary,
              opacity: 1,
            },
          },
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon
              sx={{
                color: 'text.secondary',
                fontSize: styles.iconSize,
              }}
            />
          </InputAdornment>
        }
        endAdornment={
          value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ mr: -0.5 }}
              >
                <CloseIcon sx={{ fontSize: styles.iconSize - 2 }} />
              </IconButton>
            </InputAdornment>
          )
        }
      />

      {showFilterButton && (
        <IconButton
          onClick={onFilterClick}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <TuneIcon sx={{ fontSize: styles.iconSize }} />
        </IconButton>
      )}

      {showButton && (
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: 0,
            py: styles.buttonPy,
            px: styles.buttonPx,
            minHeight: '100%',
            fontSize: styles.fontSize,
          }}
        >
          Search
        </Button>
      )}
    </Paper>
  );
};

export default SearchBar;

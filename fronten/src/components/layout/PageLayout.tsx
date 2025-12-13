import React, { ReactNode } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import AppNavbar from './AppNavbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  variant?: 'public' | 'app' | 'dashboard';
  showNavbar?: boolean;
  showFooter?: boolean;
  showSearch?: boolean;
  showCategories?: boolean;
  currentTab?: number;
  onTabChange?: (event: React.SyntheticEvent, newValue: number) => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  noPadding?: boolean;
  notificationCount?: number;
  favoriteCount?: number;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  variant = 'app',
  showNavbar = true,
  showFooter = true,
  showSearch = true,
  showCategories = true,
  currentTab = 0,
  onTabChange,
  maxWidth = 'xl',
  noPadding = false,
  notificationCount = 0,
  favoriteCount = 0,
}) => {
  const theme = useTheme();

  // For public pages (like landing page), don't show the app navbar
  if (variant === 'public') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {children}
        {showFooter && <Footer variant="full" />}
      </Box>
    );
  }

  // For dashboard pages, don't constrain with Container - let children handle their own layout
  if (variant === 'dashboard') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {showNavbar && (
          <AppNavbar
            showSearch={showSearch}
            showCategories={showCategories}
            currentTab={currentTab}
            onTabChange={onTabChange}
            notificationCount={notificationCount}
            favoriteCount={favoriteCount}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          {children}
        </Box>

        {showFooter && <Footer variant="minimal" />}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {showNavbar && (
        <AppNavbar
          showSearch={showSearch}
          showCategories={showCategories}
          currentTab={currentTab}
          onTabChange={onTabChange}
          notificationCount={notificationCount}
          favoriteCount={favoriteCount}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 0,
          pb: 4,
        }}
      >
        {maxWidth ? (
          <Container
            maxWidth={maxWidth}
            sx={{
              px: noPadding ? 0 : { xs: 2, sm: 3 },
            }}
          >
            {children}
          </Container>
        ) : (
          <Box sx={{ px: noPadding ? 0 : { xs: 2, sm: 3 } }}>
            {children}
          </Box>
        )}
      </Box>

      {showFooter && <Footer variant="full" />}
    </Box>
  );
};

export default PageLayout;

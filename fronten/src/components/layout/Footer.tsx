import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface FooterProps {
  variant?: 'full' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({ variant = 'full' }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const quickLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Browse Listings', path: '/listings' },
    { label: 'Sell an Item', path: '/create-listing' },
    { label: 'My Listings', path: '/myselling' },
  ];

  const supportLinks = [
    { label: 'Help Center', path: '/help' },
    { label: 'Safety Tips', path: '/safety' },
    { label: 'Community Guidelines', path: '/guidelines' },
    { label: 'Contact Us', path: '/contact' },
  ];

  if (variant === 'minimal') {
    return (
      <Box
        component="footer"
        sx={{
          width: '100%',
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
          py: 2,
          mt: 'auto',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'text.secondary' }}
          >
            © {new Date().getFullYear()} PolyMart - Florida Polytechnic University Marketplace. All rights reserved.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #532D8E 0%, #5A67D8 100%)'
          : 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        py: 5,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              PolyMart
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 3,
                maxWidth: 280,
                lineHeight: 1.7,
              }}
            >
              The official student marketplace for Florida Polytechnic University.
              Buy, sell, and connect with your campus community.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Box component="nav">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  component="button"
                  onClick={() => navigate(link.path)}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.7)',
                    py: 0.5,
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    textAlign: 'left',
                    '&:hover': {
                      color: '#fff',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Support
            </Typography>
            <Box component="nav">
              {supportLinks.map((link) => (
                <Link
                  key={link.path}
                  component="button"
                  onClick={() => navigate(link.path)}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.7)',
                    py: 0.5,
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    textAlign: 'left',
                    '&:hover': {
                      color: '#fff',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fff',
                mb: 2,
              }}
            >
              Contact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 1,
              }}
            >
              Florida Polytechnic University
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 1,
              }}
            >
              4700 Research Way
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
              }}
            >
              Lakeland, FL 33805
            </Typography>
            <Link
              href="mailto:support@polymart.edu"
              underline="none"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  color: '#fff',
                },
              }}
            >
              support@polymart.edu
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.15)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            © {new Date().getFullYear()} PolyMart. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8125rem',
                  '&:hover': {
                    color: '#fff',
                  },
                }}
              >
                {text}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

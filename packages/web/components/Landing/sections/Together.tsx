import { Box, Container, Text } from '@metafam/ds';
import BackgroundImage from 'assets/landing/together-background.png';

export const Together: React.FC = () => (
  <Box
    width="100%"
    minHeight="100%"
    maxHeight="100%"
    backgroundImage={`url(${BackgroundImage})`}
    bgPosition="center"
    bgSize="cover"
  >
    <Container
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      maxWidth="75rem"
      alignItems="center"
    >
      <Box
        fontSize={{ base: '1.5rem', md: '3rem' }}
        lineHeight={{ base: '2.25rem', md: '4rem' }}
        fontWeight="normal"
        color="white"
        bgGradient=" linear-gradient(180deg, #FFFFFF 15.3%, #FD208A 85.41%);                    "
        bgClip="text"
        maxWidth="75rem"
        display="inline"
        pb="2.188rem"
        pt="8.125rem"
        textAlign="center"
      >
        <Text pb={{ base: '1.188rem', md: '3.125rem' }}>
          {' '}
          We are bringing together the people & building blocks aligned on the
          idea of creating a new kind of society.
        </Text>
        <Text pb={{ base: '1.188rem', md: '3.125rem' }}>
          {' '}
          One that is optimized for human wellbeing rather than profit.
        </Text>
        <Text pb={{ base: '1.188rem', md: '3.125rem' }}>
          One that revolves around solving problems & living well, in balance
          with nature.
        </Text>
      </Box>
    </Container>
  </Box>
);

import {
  Box,
  EditIcon,
  Flex,
  getTimeZoneFor,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from '@metafam/ds';
import BackgroundImage from 'assets/main-background.jpg';
import { FlexContainer } from 'components/Container';
import { EditProfileForm } from 'components/EditProfileForm';
import { PlayerAvatar } from 'components/Player/PlayerAvatar';
import { PlayerContacts } from 'components/Player/PlayerContacts';
import { PlayerHeroTile } from 'components/Player/Section/PlayerHeroTile';
import { PlayerPronouns } from 'components/Player/Section/PlayerPronouns';
import { ProfileSection } from 'components/Profile/ProfileSection';
import { Player } from 'graphql/autogen/types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { PersonalityInfo } from 'graphql/queries/enums/getPersonalityInfo';
import { useUser } from 'lib/hooks';
import { useAnimateProfileChanges } from 'lib/hooks/players';
import React, { useEffect, useState } from 'react';
import { FaClock, FaGlobe } from 'react-icons/fa';
import { BoxType } from 'utils/boxTypes';
import { getPlayerDescription, getPlayerName } from 'utils/playerHelpers';

import { ColorBar } from '../ColorBar';

const MAX_BIO_LENGTH = 240;

type Props = {
  player: Player;
  personalityInfo: PersonalityInfo;
  isOwnProfile?: boolean;
  canEdit?: boolean;
};
type AvailabilityProps = { person?: Maybe<Player> };
type TimeZoneDisplayProps = {
  person?: Maybe<Player>;
};
type ColorDispositionProps = {
  person?: Maybe<Player>;
  personalityInfo: PersonalityInfo;
};

export const PlayerHero: React.FC<Props> = ({
  player,
  isOwnProfile,
  canEdit,
}) => {
  const description = getPlayerDescription(player);
  const [show, setShow] = useState(
    (description ?? '').length <= MAX_BIO_LENGTH,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [playerName, setPlayerName] = useState<string>();
  const { user } = useUser();

  const person = isOwnProfile ? user : player;
  useEffect(() => {
    if (person) {
      setPlayerName(getPlayerName(person));
    }
  }, [person]);

  return (
    <ProfileSection canEdit={canEdit} boxType={BoxType.PLAYER_HERO} withoutBG>
      {isOwnProfile && !canEdit && (
        <Box pos="absolute" right={5} top={5}>
          <IconButton
            _focus={{ boxShadow: 'none' }}
            variant="outline"
            borderWidth={2}
            aria-label="Edit Profile Info"
            size="lg"
            borderColor="pinkShadeOne"
            bg="rgba(17, 17, 17, 0.9)"
            color="pinkShadeOne"
            _hover={{ color: 'white', borderColor: 'white' }}
            onClick={onOpen}
            icon={<EditIcon />}
            isRound
            _active={{
              transform: 'scale(0.8)',
              backgroundColor: 'transparent',
            }}
          />
        </Box>
      )}
      <Box textAlign="center" mb={8} mt={2}>
        <PlayerAvatar
          w={{ base: 32, md: 56 }}
          h={{ base: 32, md: 56 }}
          {...{ player }}
        />
      </Box>
      <VStack spacing={6}>
        <Box textAlign="center" maxW="full">
          <Text
            fontSize="xl"
            fontFamily="heading"
            mb={1}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflowX="hidden"
            title={playerName}
          >
            {playerName}
          </Text>
        </Box>
        <Box w="100%">
          {description && (
            <Box align="flexStart" w="100%">
              <PlayerHeroTile title="Bio">
                <Text
                  fontSize={{ base: 'sm', sm: 'md' }}
                  textAlign="justify"
                  whiteSpace="pre-wrap"
                >
                  {show
                    ? description
                    : `${description.substring(0, MAX_BIO_LENGTH - 9)}…`}
                  {description.length > MAX_BIO_LENGTH && (
                    <Text
                      as="span"
                      fontSize="xs"
                      color="cyanText"
                      cursor="pointer"
                      onClick={() => setShow((s) => !s)}
                      pl={1}
                    >
                      Read {show ? 'less' : 'more'}
                    </Text>
                  )}
                </Text>
              </PlayerHeroTile>
            </Box>
          )}
        </Box>

        <HStack mt={2}>
          <PlayerContacts {...{ player }} />
        </HStack>

        {person?.profile?.pronouns && <PlayerPronouns {...{ person }} />}
        {/* <PlayerHeroTile title="Website">
          <Text>www.mycoolportfolio.com</Text>
        </PlayerHeroTile> */}

        <Flex justify="stretch" w="full">
          <PlayerHeroTile title="Availability">
            <Availability {...{ person }} />
          </PlayerHeroTile>
          <PlayerHeroTile title="Time Zone">
            <TimeZoneDisplay {...{ person }} />
          </PlayerHeroTile>
        </Flex>

        {/* <SimpleGrid columns={2} gap={6} width="full">
          <PlayerHeroTile title="Country">
              <Text>United Kingdom</Text>
            </PlayerHeroTile>
          <PlayerHeroTile title="Office hours">
            <Flex dir="row" alignItems="center">
              9:00
              <Text fontSize="md" mr={1} ml={1}>
                AM
              </Text>
              - 5:00
              <Text fontSize="md" mr={1} ml={1}>
                PM
              </Text>
            </Flex>
          </PlayerHeroTile>
        </SimpleGrid> */}

        {player?.profile?.emoji && (
          <PlayerHeroTile title="Favorite Emoji">
            <Text fontSize="1.25rem">{player.profile.emoji}</Text>
          </PlayerHeroTile>
        )}
        {/* player?.profile?.colorMask && (
          <PlayerHeroTile title="Color Disposition">
            <ColorDispositionDisplay {...{ person, personalityInfo }} />
          </PlayerHeroTile>
        ) */}
      </VStack>

      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent
          maxW={['100%', 'min(80%, 60rem)']}
          backgroundImage={`url(${BackgroundImage})`}
          bgSize="cover"
          bgAttachment="fixed"
          p={[0, 8, 12]}
        >
          <ModalHeader
            color="white"
            fontSize="4xl"
            alignSelf="center"
            fontWeight="normal"
          >
            Edit Profile
          </ModalHeader>
          <ModalCloseButton
            color="pinkShadeOne"
            size="xl"
            p={{ base: 1, sm: 4 }}
            _focus={{
              boxShadow: 'none',
            }}
          />
          <ModalBody p={[0, 2]}>
            <EditProfileForm {...{ user, onClose }} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </ProfileSection>
  );
};

const Availability: React.FC<AvailabilityProps> = ({ person }) => {
  const [hours, setHours] = useState<number | null>(
    person?.profile?.availableHours ?? null,
  );
  const updateFN = () => setHours(person?.profile?.availableHours ?? null);
  const { animation } = useAnimateProfileChanges(
    person?.profile?.availableHours,
    updateFN,
  );
  return (
    <Flex alignItems="center">
      <Box pr={2}>
        <FaClock color="blueLight" />
      </Box>
      <FlexContainer
        align="stretch"
        transition=" opacity 0.4s"
        opacity={animation === 'fadeIn' ? 1 : 0}
      >
        <Text fontSize={{ base: 'md', sm: 'lg' }} pr={2}>
          {hours == null ? (
            <Text as="em">Unspecified</Text>
          ) : (
            <>
              <Text as="span" mr={0.5}>
                {hours}
              </Text>
              <Text as="span" title="hours per week">
                <Text as="sup">hr</Text>⁄<Text as="sub">week</Text>
              </Text>
            </>
          )}
        </Text>
      </FlexContainer>
    </Flex>
  );
};

const TimeZoneDisplay: React.FC<TimeZoneDisplayProps> = ({ person }) => {
  const tz = getTimeZoneFor({ title: person?.profile?.timeZone });
  const [timeZone, setTimeZone] = useState<string | null>(
    tz?.abbreviation ?? null,
  );
  const [offset, setOffset] = useState<string>(tz?.utc ?? '');
  const updateFN = () => {
    if (tz?.abbreviation) setTimeZone(tz.abbreviation);
    if (tz?.utc) setOffset(tz.utc);
  };
  const short = offset.replace(/:00\)$/, ')').replace(/ +/g, '');
  const { animation } = useAnimateProfileChanges(timeZone, updateFN);

  return (
    <Flex alignItems="center">
      <FlexContainer
        align="stretch"
        transition=" opacity 0.4s"
        opacity={animation === 'fadeIn' ? 1 : 0}
      >
        <Flex align="center" whiteSpace="pre">
          <Box pr={2}>
            <FaGlobe color="blueLight" />
          </Box>
          {timeZone === null ? (
            <Text fontStyle="italic">Unspecified</Text>
          ) : (
            <Tooltip label={tz?.name} hasArrow>
              <Wrap justify="center" align="center">
                <WrapItem my="0 !important">
                  <Text
                    fontSize={{ base: 'md', sm: 'lg' }}
                    pr={1}
                    overflowX="hidden"
                    textOverflow="ellipsis"
                  >
                    {timeZone || '−'}
                  </Text>
                </WrapItem>
                {short && (
                  <WrapItem my="0 !important">
                    <Text fontSize={{ base: 'sm', sm: 'md' }} whiteSpace="pre">
                      {short}
                    </Text>
                  </WrapItem>
                )}
              </Wrap>
            </Tooltip>
          )}
        </Flex>
      </FlexContainer>
    </Flex>
  );
};

export const ColorDispositionDisplay: React.FC<ColorDispositionProps> = ({
  person,
  personalityInfo: types,
}) => {
  const [mask, setMask] = useState<number | null>(
    person?.profile?.colorMask ?? null,
  );

  const updateFN = () => setMask(mask);
  const { animation } = useAnimateProfileChanges(mask, updateFN);

  return (
    <FlexContainer
      align="stretch"
      justify="stretch"
      w="100%"
      transition=" opacity 0.4s"
      opacity={animation === 'fadeIn' ? 1 : 0}
      mb={-12}
    >
      <Flex align="center" whiteSpace="pre" w="100%">
        {mask == null ? (
          <Text fontStyle="italic" textAlign="center" mb={6}>
            Unspecified
          </Text>
        ) : (
          <Link
            isExternal
            href={`//dysbulic.github.io/5-color-radar/#/combos/${mask
              .toString(2)
              .padStart(5, '0')}`}
            w="100%"
            fontSize={{ base: 'md', sm: 'lg' }}
            fontWeight={600}
            _focus={{ border: 'none' }}
          >
            <ColorBar {...{ mask, types }} />
          </Link>
        )}
      </Flex>
    </FlexContainer>
  );
};

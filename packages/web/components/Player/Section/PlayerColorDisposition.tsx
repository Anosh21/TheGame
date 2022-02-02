import { Link, Text } from '@metafam/ds';
import { FlexContainer } from 'components/Container';
import { ColorBar } from 'components/Player/ColorBar';
import { ProfileSection } from 'components/Profile/ProfileSection';
import { Player } from 'graphql/autogen/types';
import { PersonalityInfo } from 'graphql/queries/enums/getPersonalityInfo';
import { useProfileField } from 'lib/hooks';
import { useAnimateProfileChanges } from 'lib/hooks/players';
import React from 'react';
import { BoxType } from 'utils/boxTypes';

type Props = {
  player: Player;
  personalityInfo: PersonalityInfo;
  isOwnProfile?: boolean;
  canEdit?: boolean;
};
export const PlayerColorDisposition: React.FC<Props> = ({
  player,
  personalityInfo,
  isOwnProfile,
  canEdit,
}) => {
  const { value: mask } = useProfileField<number>({
    field: 'colorMask',
    player,
    owner: isOwnProfile,
  });
  const { animation } = useAnimateProfileChanges(mask);

  return (
    <ProfileSection
      title="Color Disposition"
      boxType={BoxType.PLAYER_COLOR_DISPOSITION}
      withoutBG
      {...{ isOwnProfile, canEdit }}
    >
      {mask == null ? (
        <Text fontStyle="italic" textAlign="center" mb={6}>
          Unspecified
        </Text>
      ) : (
        <FlexContainer
          align="stretch"
          transition="opacity 0.4s"
          opacity={animation === 'fadeIn' ? 1 : 0}
        >
          <Link
            isExternal
            href={`//dysbulic.github.io/5-color-radar/#/combos/${mask
              .toString(2)
              .padStart(5, '0')}`}
            maxH={125}
            fontSize={{ base: 'md', sm: 'lg' }}
            fontWeight={600}
            _focus={{ border: 'none' }}
          >
            <ColorBar {...{ mask, personalityInfo }} />
          </Link>
        </FlexContainer>
      )}
    </ProfileSection>
  );
};

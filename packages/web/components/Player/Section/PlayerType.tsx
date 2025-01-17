import { Text } from '@metafam/ds';
import { FlexContainer } from 'components/Container';
import { ProfileSection } from 'components/Profile/ProfileSection';
import { ExplorerType, Player } from 'graphql/autogen/types';
import { useAnimateProfileChanges } from 'lib/hooks/players';
import React, { useState } from 'react';
import { BoxType } from 'utils/boxTypes';

type Props = {
  player: Player;
  isOwnProfile?: boolean;
  canEdit?: boolean;
};

export const PlayerType: React.FC<Props> = ({
  player,
  isOwnProfile,
  canEdit,
}) => {
  const [playerType, setPlayerType] = useState<ExplorerType | null>(
    (player.profile?.explorerType as ExplorerType) ?? null,
  );
  const updateFN = () =>
    setPlayerType(player.profile?.explorerType as ExplorerType);
  const { animation } = useAnimateProfileChanges(
    player.profile?.explorerType,
    updateFN,
  );

  return (
    <ProfileSection
      title="Player type"
      {...{ isOwnProfile, canEdit }}
      boxType={BoxType.PLAYER_TYPE}
      withoutBG
    >
      {!playerType ? (
        <Text fontStyle="italic" textAlign="center" mb={6}>
          Unspecified
        </Text>
      ) : (
        <FlexContainer
          align="stretch"
          transition=" opacity 0.4s"
          opacity={animation === 'fadeIn' ? 1 : 0}
        >
          <Text
            color="white"
            fontWeight="600"
            casing="uppercase"
            fontSize={{ base: 'md', sm: 'lg' }}
          >
            {playerType.title}
          </Text>
          <Text
            fontSize={{ base: 'sm', sm: 'md' }}
            color="blueLight"
            textAlign="justify"
          >
            {playerType.description}
          </Text>
        </FlexContainer>
      )}
    </ProfileSection>
  );
};

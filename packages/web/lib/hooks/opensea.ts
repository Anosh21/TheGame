import { CONFIG } from 'config';
import { utils } from 'ethers';
import { Player } from 'graphql/autogen/types';
import { OpenSeaAPI } from 'opensea-js';
import {
  AssetEvent,
  OpenSeaAsset,
  OpenSeaAssetQuery,
} from 'opensea-js/lib/types';
import { useEffect, useState } from 'react';

const opensea = new OpenSeaAPI({ apiKey: CONFIG.openseaApiKey });

type OpenSeaCollectiblesOpts = {
  player: Player;
};

export type Collectible = {
  address: string;
  tokenId: string;
  title: string;
  imageUrl: string;
  openseaLink: string;
  priceString: string;
};

export const useOpenSeaCollectibles = ({
  player,
}: OpenSeaCollectiblesOpts): {
  favorites: Array<Collectible>;
  data: Array<Collectible>;
  loading: boolean;
} => {
  const [favorites, setFavorites] = useState<Array<Collectible>>([]);
  const [data, setData] = useState<Array<Collectible>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const owner = player.ethereumAddress;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (owner) {
          const allData = await fetchAllOpenSeaData(owner);
          setData(allData);
          setFavorites(allData.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }

    if (owner) {
      load();
    }
  }, [owner]);

  return { favorites, data, loading };
};

const fetchAllOpenSeaData = async (
  owner: string,
): Promise<Array<Collectible>> => {
  let offset = 0;
  let data: Array<Collectible> = [];
  let lastData: Array<Collectible> = [];
  const block = 50;
  do {
    const query = { owner, offset, limit: block };
    // eslint-disable-next-line no-await-in-loop
    lastData = await fetchOpenSeaData(query);
    data = data.concat(lastData);
    offset += block;
  } while (lastData.length > 0);
  return data;
};

const fetchOpenSeaData = async (
  query: OpenSeaAssetQuery,
): Promise<Array<Collectible>> => {
  try {
    const response = await opensea.getAssets(query);
    return await parseAssets(response.assets);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error Retrieving OpenSea Assets: ${(err as Error).message}`);
    return Promise.resolve([]);
  }
};

const parseAssets = async (
  assets: Array<OpenSeaAsset>,
): Promise<Array<Collectible>> =>
  assets
    .map(
      (asset) =>
        ({
          address: asset.assetContract.address,
          tokenId: asset.tokenId,
          title: asset.name,
          imageUrl: asset.imageUrl,
          openseaLink: asset.openseaLink,
          priceString: getPriceString(asset.lastSale),
        } as Collectible),
    )
    .filter(
      (collectible: Collectible) =>
        !!collectible.title && !!collectible.imageUrl,
    );

const ETH_ADDRESSES = [
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // wETH
  '0x0000000000000000000000000000000000000000', // ETH
];

const getPriceString = (event: AssetEvent | null): string => {
  if (event?.paymentToken) {
    const {
      address,
      symbol: tokenSymbol,
      decimals,
      usdPrice,
    } = event.paymentToken;

    const symbol = ETH_ADDRESSES.includes(address) ? 'Ξ' : tokenSymbol;
    const price = Number(utils.formatUnits(event.totalPrice, decimals));
    const priceInUSD = usdPrice ? price * Number(usdPrice) : 0;
    return `${price.toFixed(2)}${symbol}${
      priceInUSD ? ` ($${priceInUSD.toFixed(2)})` : ''
    }`;
  }
  return '';
};

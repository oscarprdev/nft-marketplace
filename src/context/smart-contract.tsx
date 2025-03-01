'use client';

import { ethers } from 'ethers';
import React, { createContext } from 'react';
import { connectWithSmartContract } from '~/lib/ethers/connect-contract';
import { getContract } from '~/lib/ethers/get-contract';
import { ContractNFT, ContractNFTItem, CreateNFTInput } from '~/types';

type SmartContractContextType = {
  createNFT: (input: CreateNFTInput) => Promise<void>;
  fetchNFTs: () => Promise<ContractNFTItem[]>;
} | null;

export const SmartContractContext = createContext<SmartContractContextType>(null);

export const SmartContractProvider = ({ children }: { children: React.ReactNode }) => {
  const createNFT = async ({ metadataUrl, price }: CreateNFTInput): Promise<void> => {
    try {
      const contract = await connectWithSmartContract();

      await contract.mintNFT(metadataUrl, ethers.parseUnits(price, 'ether'));
    } catch (error) {
      console.log(`Something went wrong creating NFT ${error}`);
    }
  };

  const fetchNFTs = async (): Promise<ContractNFTItem[]> => {
    try {
      const contract = getContract();
      const data = await contract.getNFTs();

      return data.map(mapContractNFTtoApp);
    } catch (error) {
      console.log(`Something went wrong fetching NFTs ${error}`);
      return [];
    }
  };

  return (
    <SmartContractContext.Provider
      value={{
        createNFT,
        fetchNFTs,
      }}>
      {children}
    </SmartContractContext.Provider>
  );
};

const mapContractNFTtoApp = (nft: ContractNFT): ContractNFTItem => {
  const [tokenId, creator, owner, uri, price, isListed, timestamp] = Object.values(nft);

  return {
    tokenId: Number(tokenId),
    creator,
    owner,
    uri,
    isListed,
    price: ethers.formatEther(price),
    timestamp: Number(timestamp).toString(),
  } satisfies ContractNFTItem;
};

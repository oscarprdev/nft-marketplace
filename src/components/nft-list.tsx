'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { SmartContractContext } from '~/context/smart-contract';

const NFTList = () => {
  const { fetchNFTs } = useContext(SmartContractContext)!;
  const { data, isLoading } = useQuery({ queryKey: ['nfts'], queryFn: () => fetchNFTs });

  return <div>{!isLoading && data && JSON.stringify(data)}</div>;
};

export default NFTList;

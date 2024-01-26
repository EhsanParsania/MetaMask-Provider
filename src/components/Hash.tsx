import React from "react";
import { addressUrl } from '../utils/helper';

interface HashProps {
  address: string | undefined;
}

const Hash: React.FC<HashProps> = ({ address }) => {
  const url = `${addressUrl}${address}`;

  return (
    <div>
      <h4>Connected wallet address is: </h4>
      <a href={url} target="_blank" rel="noreferrer">
        [{address && address.slice(0, 5)}...{address && address.slice(-3)}]
      </a>
    </div>
  );
};

export default Hash;

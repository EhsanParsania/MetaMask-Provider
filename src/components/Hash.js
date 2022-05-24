import React from "react";
import {addressUrl} from '../utils/helper'
export const Hash = ({address}) => {
  const url=`${addressUrl}${address}`

  return (
    <div>
      <h4>Connected wallet address is : </h4>
      <a href={url} target="_blank" rel="noreferrer"  > [ {address?.slice(0, 5)} . . . {address?.slice(-3)} ]</a>
    </div>
  );
}
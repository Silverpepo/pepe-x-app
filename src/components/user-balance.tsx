'use client'

import Image from 'next/image'
import { useAccount, useBalance } from 'wagmi'
import { tokenAddress } from '@/config/contract'
import { formatNumber } from '@/lib/formatting'

const UserBalance = () => {
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  const { data: pepoBalance } = useBalance({ 
    address,
    token: tokenAddress
  })

  return (
    <div className="font-bold">
      {address ? (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center space-x-[4px]">
            <Image src="/tokens/PEPO.svg" width={16} height={16} alt="PEPO" />
            <span className="text-xs">{`${pepoBalance?.formatted ? formatNumber(pepoBalance.formatted, 2) : '0.00'} ${
              pepoBalance?.symbol || 'PEPO'
            }`}</span>
          </div>
          <div className="flex items-center space-x-[4px]">
            <Image src="/tokens/eth.svg" width={16} height={16} alt="ETH" />
            <span className="text-xs">{`${ethBalance?.formatted ? formatNumber(ethBalance.formatted, 4) : '0.0000'} ${
              ethBalance?.symbol || 'ETH'
            }`}</span>
          </div>
        </div>
      ) : (
        <p>Connect to play!</p>
      )}
    </div>
  )
}

export default UserBalance

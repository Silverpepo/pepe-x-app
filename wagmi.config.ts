import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    hardhat({
      project: '../pepe-x-smart-contracts',
      artifacts: '../pepe-x-smart-contracts/artifacts',
      include: [
        'contracts/Pepo.sol/**',
        'contracts/MultiPredictionMarket.sol/**',
        'contracts/PepoDutchAuction.sol/**',
      ],
    }),
    react({
      useContractRead: true,
      useContractFunctionRead: true,
    }),
  ],
})

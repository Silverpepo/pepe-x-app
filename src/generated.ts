import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MultiPredictionMarket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const multiPredictionMarketABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [{ name: 'pepoAddress', internalType: 'address', type: 'address' }],
  },
  { type: 'error', inputs: [], name: 'ContractPaused' },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidDuration' },
  { type: 'error', inputs: [], name: 'InvalidFee' },
  { type: 'error', inputs: [], name: 'InvalidPriceFeed' },
  { type: 'error', inputs: [], name: 'InvalidTimeRange' },
  { type: 'error', inputs: [], name: 'InvalidWindow' },
  { type: 'error', inputs: [], name: 'MarketAlreadyExists' },
  { type: 'error', inputs: [], name: 'MarketNotEnabled' },
  { type: 'error', inputs: [], name: 'MarketNotFound' },
  { type: 'error', inputs: [], name: 'NothingToClaim' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'PriceFeedError' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'WindowAlreadyExists' },
  { type: 'error', inputs: [], name: 'WindowNotActive' },
  { type: 'error', inputs: [], name: 'WindowNotFound' },
  { type: 'error', inputs: [], name: 'WindowNotResolved' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'AutomationPerformed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'status',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ManualWindowTransition',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'pair', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'priceFeed',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'windowDuration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'treasuryFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarketCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'MarketEnabled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'newFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarketFeeUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'newPriceFeed',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MarketPriceFeedUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'newDuration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarketWindowDurationUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'lockTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'closeTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NewWindow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'paused', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PausedStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'direction',
        internalType: 'enum IMultiPredictionMarket.Direction',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PredictionPlaced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TreasuryFeesWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'lockPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WindowLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'windowId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'winner',
        internalType: 'enum IMultiPredictionMarket.Direction',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'closePrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'upVolume',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'downVolume',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WindowResolved',
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MAXIMUM_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MAXIMUM_WINDOW_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'MINIMUM_WINDOW_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'PRICE_DEVIATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'activeWindowId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'calculateReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'checkUpkeep',
    outputs: [
      { name: 'upkeepNeeded', internalType: 'bool', type: 'bool' },
      { name: 'performData', internalType: 'bytes', type: 'bytes' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'claimMultiple',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'pair', internalType: 'string', type: 'string' },
      { name: 'priceFeed', internalType: 'address', type: 'address' },
      { name: 'windowDuration', internalType: 'uint256', type: 'uint256' },
      { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createMarket',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'emergencyResolveWindow',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimableWindows',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCurrentWindow',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Window',
        type: 'tuple',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'windowId', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'lockTime', internalType: 'uint256', type: 'uint256' },
          { name: 'lockPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'closeTime', internalType: 'uint256', type: 'uint256' },
          { name: 'closePrice', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum IMultiPredictionMarket.Status',
            type: 'uint8',
          },
          {
            name: 'winner',
            internalType: 'enum IMultiPredictionMarket.Direction',
            type: 'uint8',
          },
          { name: 'upVolume', internalType: 'uint256', type: 'uint256' },
          { name: 'downVolume', internalType: 'uint256', type: 'uint256' },
          {
            name: 'rewardBaseAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getEnabledMarkets',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Market[]',
        type: 'tuple[]',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'pair', internalType: 'string', type: 'string' },
          { name: 'priceFeed', internalType: 'address', type: 'address' },
          { name: 'windowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
          { name: 'enabled', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'count', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLatestCompleteWindows',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.CompleteWindowData[]',
        type: 'tuple[]',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'windowId', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'lockPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'closePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'lockTime', internalType: 'uint256', type: 'uint256' },
          { name: 'closeTime', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum IMultiPredictionMarket.Status',
            type: 'uint8',
          },
          {
            name: 'winner',
            internalType: 'enum IMultiPredictionMarket.Direction',
            type: 'uint8',
          },
          { name: 'upVolume', internalType: 'uint256', type: 'uint256' },
          { name: 'downVolume', internalType: 'uint256', type: 'uint256' },
          {
            name: 'rewardBaseAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'totalVolume', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'count', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLatestWindows',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Window[]',
        type: 'tuple[]',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'windowId', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'lockTime', internalType: 'uint256', type: 'uint256' },
          { name: 'lockPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'closeTime', internalType: 'uint256', type: 'uint256' },
          { name: 'closePrice', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum IMultiPredictionMarket.Status',
            type: 'uint8',
          },
          {
            name: 'winner',
            internalType: 'enum IMultiPredictionMarket.Direction',
            type: 'uint8',
          },
          { name: 'upVolume', internalType: 'uint256', type: 'uint256' },
          { name: 'downVolume', internalType: 'uint256', type: 'uint256' },
          {
            name: 'rewardBaseAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMarket',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Market',
        type: 'tuple',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'pair', internalType: 'string', type: 'string' },
          { name: 'priceFeed', internalType: 'address', type: 'address' },
          { name: 'windowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
          { name: 'enabled', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'pair', internalType: 'string', type: 'string' }],
    name: 'getMarketByPair',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Market',
        type: 'tuple',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'pair', internalType: 'string', type: 'string' },
          { name: 'priceFeed', internalType: 'address', type: 'address' },
          { name: 'windowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
          { name: 'enabled', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getMarkets',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Market[]',
        type: 'tuple[]',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'pair', internalType: 'string', type: 'string' },
          { name: 'priceFeed', internalType: 'address', type: 'address' },
          { name: 'windowDuration', internalType: 'uint256', type: 'uint256' },
          { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
          { name: 'enabled', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUserPredictions',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Prediction[]',
        type: 'tuple[]',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'direction',
            internalType: 'enum IMultiPredictionMarket.Direction',
            type: 'uint8',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'claimed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getUserWindows',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getWindow',
    outputs: [
      {
        name: '',
        internalType: 'struct IMultiPredictionMarket.Window',
        type: 'tuple',
        components: [
          { name: 'marketId', internalType: 'uint256', type: 'uint256' },
          { name: 'windowId', internalType: 'uint256', type: 'uint256' },
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'startPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'lockTime', internalType: 'uint256', type: 'uint256' },
          { name: 'lockPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'closeTime', internalType: 'uint256', type: 'uint256' },
          { name: 'closePrice', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum IMultiPredictionMarket.Status',
            type: 'uint8',
          },
          {
            name: 'winner',
            internalType: 'enum IMultiPredictionMarket.Direction',
            type: 'uint8',
          },
          { name: 'upVolume', internalType: 'uint256', type: 'uint256' },
          { name: 'downVolume', internalType: 'uint256', type: 'uint256' },
          {
            name: 'rewardBaseAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'rewardAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getWindowStatus',
    outputs: [
      {
        name: '',
        internalType: 'enum IMultiPredictionMarket.Status',
        type: 'uint8',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'isMarketEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isWindowActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isWindowResolved',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'lastResolvedWindowId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lockWindow',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'manualTriggerWindow',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'uint256', type: 'uint256' }],
    name: 'nextWindowId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pepo',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'performData', internalType: 'bytes', type: 'bytes' }],
    name: 'performUpkeep',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'direction',
        internalType: 'enum IMultiPredictionMarket.Direction',
        type: 'uint8',
      },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'predict',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'resolveWindow',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setMarketEnabled',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMarketFee',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'newPriceFeed', internalType: 'address', type: 'address' },
    ],
    name: 'setMarketPriceFeed',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'newDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMarketWindowDuration',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newPaused', internalType: 'bool', type: 'bool' }],
    name: 'setPaused',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'treasuryFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'uint256', type: 'uint256' },
      { name: 'windowId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'windowExists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'withdrawTreasuryFees',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pepo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pepoABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_treasury', internalType: 'address', type: 'address' },
      { name: '_team', internalType: 'address', type: 'address' },
      { name: '_marketing', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'CannotRecoverPEPO' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'NoETHAccepted' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newMarketing',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MarketingWalletUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'market',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PredictionMarketRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RewardVaultSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'distributor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RewardsDistributorRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'staking',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'StakingContractRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTeam',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TeamWalletUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTreasury',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TreasuryWalletUpdated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'market', internalType: 'address', type: 'address' }],
    name: 'isPredictionMarket',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'vault', internalType: 'address', type: 'address' }],
    name: 'isRewardVault',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'distributor', internalType: 'address', type: 'address' }],
    name: 'isRewardsDistributor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'staking', internalType: 'address', type: 'address' }],
    name: 'isStakingContract',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'marketingWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'market', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerPredictionMarket',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'vault', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerRewardVault',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'distributor', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerRewardsDistributor',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'staking', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerStakingContract',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newMarketing', internalType: 'address', type: 'address' },
    ],
    name: 'setMarketingWallet',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newTeam', internalType: 'address', type: 'address' }],
    name: 'setTeamWallet',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newTreasury', internalType: 'address', type: 'address' }],
    name: 'setTreasuryWallet',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'teamWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'treasuryWallet',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PepoDutchAuction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pepoDutchAuctionABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_tokensForSale', internalType: 'uint256', type: 'uint256' },
      { name: '_startPrice', internalType: 'uint256', type: 'uint256' },
      { name: '_endPrice', internalType: 'uint256', type: 'uint256' },
      { name: '_duration', internalType: 'uint256', type: 'uint256' },
    ],
  },
  { type: 'error', inputs: [], name: 'AlreadyStarted' },
  { type: 'error', inputs: [], name: 'AuctionAlreadyEnded' },
  { type: 'error', inputs: [], name: 'AuctionNotEnded' },
  { type: 'error', inputs: [], name: 'CannotEndYet' },
  { type: 'error', inputs: [], name: 'ContractStopped' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExceedsAvailable' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'InsufficientTokens' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidDuration' },
  { type: 'error', inputs: [], name: 'InvalidPrices' },
  { type: 'error', inputs: [], name: 'InvalidToken' },
  { type: 'error', inputs: [], name: 'NoContribution' },
  { type: 'error', inputs: [], name: 'NotStarted' },
  { type: 'error', inputs: [], name: 'NothingToClaim' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'PriceInconsistency' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'TooEarlyForEmergency' },
  { type: 'error', inputs: [], name: 'TransferAmountMismatch' },
  { type: 'error', inputs: [], name: 'TransferFailed' },
  { type: 'error', inputs: [], name: 'UnauthorizedCaller' },
  { type: 'error', inputs: [], name: 'ZeroContribution' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'totalSold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'finalPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AuctionEnded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'startPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'duration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AuctionStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'contributor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'tokenAllocation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContributionMade',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'stopped', internalType: 'bool', type: 'bool', indexed: false },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EmergencyStatusChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'totalAllocation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'unlockedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vestedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenDistributionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensPurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UnlockedTokensClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'totalContribution',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'totalAllocation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'unlockedClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vestedClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vestingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserParticipationUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'vestingPercent',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VestedTokensClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'vestingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'remainingVested',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nextUnlockTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VestingUpdated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'UNLOCKED_PERCENT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'VESTED_PERCENT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'VESTING_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'auctionEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'claimUnlocked', internalType: 'bool', type: 'bool' },
      { name: 'claimVested', internalType: 'bool', type: 'bool' },
    ],
    name: 'claimTokens',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'contribute',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'emergencyStop',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'emergencyWithdraw',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'endAuction',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'endPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'endTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAuctionInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IPepoDutchAuction.AuctionInfo',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'currentPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'tokensForSale', internalType: 'uint256', type: 'uint256' },
          { name: 'tokensSold', internalType: 'uint256', type: 'uint256' },
          { name: 'minPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPrice', internalType: 'uint256', type: 'uint256' },
          { name: 'isEnded', internalType: 'bool', type: 'bool' },
          {
            name: 'participantCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'emergencyStopped', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getClaimableAmounts',
    outputs: [
      { name: 'unlockedClaimable', internalType: 'uint256', type: 'uint256' },
      { name: 'vestedClaimable', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCurrentPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getParticipantCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getParticipants',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTimeElapsed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getTimeRemaining',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getTotalAllocation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getUserDistributionInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IPepoDutchAuction.UserDistributionInfo',
        type: 'tuple',
        components: [
          { name: 'totalAllocation', internalType: 'uint256', type: 'uint256' },
          { name: 'unlockedAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'vestedAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'unlockedClaimed', internalType: 'uint256', type: 'uint256' },
          { name: 'vestedClaimed', internalType: 'uint256', type: 'uint256' },
          {
            name: 'claimableUnlocked',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'claimableVested', internalType: 'uint256', type: 'uint256' },
          {
            name: 'vestingStatus',
            internalType: 'struct IPepoDutchAuction.VestingStatus',
            type: 'tuple',
            components: [
              { name: 'totalVested', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastClaimTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'nextUnlockTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'vestedPerSecond',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'vestingId', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getUserInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IPepoDutchAuction.UserInfo',
        type: 'tuple',
        components: [
          { name: 'contribution', internalType: 'uint256', type: 'uint256' },
          { name: 'totalAllocation', internalType: 'uint256', type: 'uint256' },
          { name: 'unlockedClaimed', internalType: 'uint256', type: 'uint256' },
          { name: 'vestedClaimed', internalType: 'uint256', type: 'uint256' },
          { name: 'hasParticipated', internalType: 'bool', type: 'bool' },
          {
            name: 'vestingStatus',
            internalType: 'struct IPepoDutchAuction.VestingStatus',
            type: 'tuple',
            components: [
              { name: 'totalVested', internalType: 'uint256', type: 'uint256' },
              {
                name: 'lastClaimTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'nextUnlockTime',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'vestedPerSecond',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'vestingId', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVestingInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IPepoDutchAuction.VestingInfo',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'vestedPercent', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          { name: 'isComplete', internalType: 'bool', type: 'bool' },
          {
            name: 'totalTokensVested',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalTokensClaimed',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getVestingProgress',
    outputs: [
      { name: 'percentComplete', internalType: 'uint256', type: 'uint256' },
      { name: 'timeRemaining', internalType: 'uint256', type: 'uint256' },
      { name: 'isActive', internalType: 'bool', type: 'bool' },
      { name: 'isComplete', internalType: 'bool', type: 'bool' },
      { name: 'totalVested', internalType: 'uint256', type: 'uint256' },
      { name: 'totalClaimed', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'hasClaimableTokens',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'pepo',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_stopped', internalType: 'bool', type: 'bool' }],
    name: 'setEmergencyStop',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'startAuction',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'startPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tokensForSale',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tokensSold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalParticipants',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__.
 */
export function useMultiPredictionMarketRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"BASIS_POINTS"`.
 */
export function useMultiPredictionMarketBasisPoints<
  TFunctionName extends 'BASIS_POINTS',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'BASIS_POINTS',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"MAXIMUM_FEE"`.
 */
export function useMultiPredictionMarketMaximumFee<
  TFunctionName extends 'MAXIMUM_FEE',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'MAXIMUM_FEE',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"MAXIMUM_WINDOW_DURATION"`.
 */
export function useMultiPredictionMarketMaximumWindowDuration<
  TFunctionName extends 'MAXIMUM_WINDOW_DURATION',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'MAXIMUM_WINDOW_DURATION',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"MINIMUM_WINDOW_DURATION"`.
 */
export function useMultiPredictionMarketMinimumWindowDuration<
  TFunctionName extends 'MINIMUM_WINDOW_DURATION',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'MINIMUM_WINDOW_DURATION',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"PRICE_DEVIATION"`.
 */
export function useMultiPredictionMarketPriceDeviation<
  TFunctionName extends 'PRICE_DEVIATION',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'PRICE_DEVIATION',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"activeWindowId"`.
 */
export function useMultiPredictionMarketActiveWindowId<
  TFunctionName extends 'activeWindowId',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'activeWindowId',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"calculateReward"`.
 */
export function useMultiPredictionMarketCalculateReward<
  TFunctionName extends 'calculateReward',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'calculateReward',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"checkUpkeep"`.
 */
export function useMultiPredictionMarketCheckUpkeep<
  TFunctionName extends 'checkUpkeep',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'checkUpkeep',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getClaimableWindows"`.
 */
export function useMultiPredictionMarketGetClaimableWindows<
  TFunctionName extends 'getClaimableWindows',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getClaimableWindows',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getCurrentWindow"`.
 */
export function useMultiPredictionMarketGetCurrentWindow<
  TFunctionName extends 'getCurrentWindow',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getCurrentWindow',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getEnabledMarkets"`.
 */
export function useMultiPredictionMarketGetEnabledMarkets<
  TFunctionName extends 'getEnabledMarkets',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getEnabledMarkets',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getLatestCompleteWindows"`.
 */
export function useMultiPredictionMarketGetLatestCompleteWindows<
  TFunctionName extends 'getLatestCompleteWindows',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getLatestCompleteWindows',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getLatestWindows"`.
 */
export function useMultiPredictionMarketGetLatestWindows<
  TFunctionName extends 'getLatestWindows',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getLatestWindows',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getMarket"`.
 */
export function useMultiPredictionMarketGetMarket<
  TFunctionName extends 'getMarket',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getMarket',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getMarketByPair"`.
 */
export function useMultiPredictionMarketGetMarketByPair<
  TFunctionName extends 'getMarketByPair',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getMarketByPair',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getMarkets"`.
 */
export function useMultiPredictionMarketGetMarkets<
  TFunctionName extends 'getMarkets',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getMarkets',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getUserPredictions"`.
 */
export function useMultiPredictionMarketGetUserPredictions<
  TFunctionName extends 'getUserPredictions',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getUserPredictions',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getUserWindows"`.
 */
export function useMultiPredictionMarketGetUserWindows<
  TFunctionName extends 'getUserWindows',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getUserWindows',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getWindow"`.
 */
export function useMultiPredictionMarketGetWindow<
  TFunctionName extends 'getWindow',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getWindow',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"getWindowStatus"`.
 */
export function useMultiPredictionMarketGetWindowStatus<
  TFunctionName extends 'getWindowStatus',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'getWindowStatus',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"isMarketEnabled"`.
 */
export function useMultiPredictionMarketIsMarketEnabled<
  TFunctionName extends 'isMarketEnabled',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'isMarketEnabled',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"isWindowActive"`.
 */
export function useMultiPredictionMarketIsWindowActive<
  TFunctionName extends 'isWindowActive',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'isWindowActive',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"isWindowResolved"`.
 */
export function useMultiPredictionMarketIsWindowResolved<
  TFunctionName extends 'isWindowResolved',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'isWindowResolved',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"lastResolvedWindowId"`.
 */
export function useMultiPredictionMarketLastResolvedWindowId<
  TFunctionName extends 'lastResolvedWindowId',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'lastResolvedWindowId',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"nextWindowId"`.
 */
export function useMultiPredictionMarketNextWindowId<
  TFunctionName extends 'nextWindowId',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'nextWindowId',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"owner"`.
 */
export function useMultiPredictionMarketOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"paused"`.
 */
export function useMultiPredictionMarketPaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"pepo"`.
 */
export function useMultiPredictionMarketPepo<
  TFunctionName extends 'pepo',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'pepo',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"treasuryFees"`.
 */
export function useMultiPredictionMarketTreasuryFees<
  TFunctionName extends 'treasuryFees',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'treasuryFees',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"windowExists"`.
 */
export function useMultiPredictionMarketWindowExists<
  TFunctionName extends 'windowExists',
  TSelectData = ReadContractResult<
    typeof multiPredictionMarketABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof multiPredictionMarketABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: multiPredictionMarketABI,
    functionName: 'windowExists',
    ...config,
  } as UseContractReadConfig<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__.
 */
export function useMultiPredictionMarketWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    TFunctionName,
    TMode
  >({ abi: multiPredictionMarketABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"claim"`.
 */
export function useMultiPredictionMarketClaim<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'claim'
        >['request']['abi'],
        'claim',
        TMode
      > & { functionName?: 'claim' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'claim',
        TMode
      > & {
        abi?: never
        functionName?: 'claim'
      } = {} as any,
) {
  return useContractWrite<typeof multiPredictionMarketABI, 'claim', TMode>({
    abi: multiPredictionMarketABI,
    functionName: 'claim',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"claimMultiple"`.
 */
export function useMultiPredictionMarketClaimMultiple<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'claimMultiple'
        >['request']['abi'],
        'claimMultiple',
        TMode
      > & { functionName?: 'claimMultiple' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'claimMultiple',
        TMode
      > & {
        abi?: never
        functionName?: 'claimMultiple'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'claimMultiple',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'claimMultiple',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"createMarket"`.
 */
export function useMultiPredictionMarketCreateMarket<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'createMarket'
        >['request']['abi'],
        'createMarket',
        TMode
      > & { functionName?: 'createMarket' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'createMarket',
        TMode
      > & {
        abi?: never
        functionName?: 'createMarket'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'createMarket',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'createMarket',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"emergencyResolveWindow"`.
 */
export function useMultiPredictionMarketEmergencyResolveWindow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'emergencyResolveWindow'
        >['request']['abi'],
        'emergencyResolveWindow',
        TMode
      > & { functionName?: 'emergencyResolveWindow' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'emergencyResolveWindow',
        TMode
      > & {
        abi?: never
        functionName?: 'emergencyResolveWindow'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'emergencyResolveWindow',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'emergencyResolveWindow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"lockWindow"`.
 */
export function useMultiPredictionMarketLockWindow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'lockWindow'
        >['request']['abi'],
        'lockWindow',
        TMode
      > & { functionName?: 'lockWindow' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'lockWindow',
        TMode
      > & {
        abi?: never
        functionName?: 'lockWindow'
      } = {} as any,
) {
  return useContractWrite<typeof multiPredictionMarketABI, 'lockWindow', TMode>(
    {
      abi: multiPredictionMarketABI,
      functionName: 'lockWindow',
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"manualTriggerWindow"`.
 */
export function useMultiPredictionMarketManualTriggerWindow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'manualTriggerWindow'
        >['request']['abi'],
        'manualTriggerWindow',
        TMode
      > & { functionName?: 'manualTriggerWindow' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'manualTriggerWindow',
        TMode
      > & {
        abi?: never
        functionName?: 'manualTriggerWindow'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'manualTriggerWindow',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'manualTriggerWindow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"performUpkeep"`.
 */
export function useMultiPredictionMarketPerformUpkeep<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'performUpkeep'
        >['request']['abi'],
        'performUpkeep',
        TMode
      > & { functionName?: 'performUpkeep' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'performUpkeep',
        TMode
      > & {
        abi?: never
        functionName?: 'performUpkeep'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'performUpkeep',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'performUpkeep',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"predict"`.
 */
export function useMultiPredictionMarketPredict<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'predict'
        >['request']['abi'],
        'predict',
        TMode
      > & { functionName?: 'predict' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'predict',
        TMode
      > & {
        abi?: never
        functionName?: 'predict'
      } = {} as any,
) {
  return useContractWrite<typeof multiPredictionMarketABI, 'predict', TMode>({
    abi: multiPredictionMarketABI,
    functionName: 'predict',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useMultiPredictionMarketRenounceOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'renounceOwnership',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"resolveWindow"`.
 */
export function useMultiPredictionMarketResolveWindow<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'resolveWindow'
        >['request']['abi'],
        'resolveWindow',
        TMode
      > & { functionName?: 'resolveWindow' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'resolveWindow',
        TMode
      > & {
        abi?: never
        functionName?: 'resolveWindow'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'resolveWindow',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'resolveWindow',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketEnabled"`.
 */
export function useMultiPredictionMarketSetMarketEnabled<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'setMarketEnabled'
        >['request']['abi'],
        'setMarketEnabled',
        TMode
      > & { functionName?: 'setMarketEnabled' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'setMarketEnabled',
        TMode
      > & {
        abi?: never
        functionName?: 'setMarketEnabled'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'setMarketEnabled',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketEnabled',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketFee"`.
 */
export function useMultiPredictionMarketSetMarketFee<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'setMarketFee'
        >['request']['abi'],
        'setMarketFee',
        TMode
      > & { functionName?: 'setMarketFee' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'setMarketFee',
        TMode
      > & {
        abi?: never
        functionName?: 'setMarketFee'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'setMarketFee',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketFee',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketPriceFeed"`.
 */
export function useMultiPredictionMarketSetMarketPriceFeed<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'setMarketPriceFeed'
        >['request']['abi'],
        'setMarketPriceFeed',
        TMode
      > & { functionName?: 'setMarketPriceFeed' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'setMarketPriceFeed',
        TMode
      > & {
        abi?: never
        functionName?: 'setMarketPriceFeed'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'setMarketPriceFeed',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketPriceFeed',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketWindowDuration"`.
 */
export function useMultiPredictionMarketSetMarketWindowDuration<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'setMarketWindowDuration'
        >['request']['abi'],
        'setMarketWindowDuration',
        TMode
      > & { functionName?: 'setMarketWindowDuration' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'setMarketWindowDuration',
        TMode
      > & {
        abi?: never
        functionName?: 'setMarketWindowDuration'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'setMarketWindowDuration',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketWindowDuration',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setPaused"`.
 */
export function useMultiPredictionMarketSetPaused<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'setPaused'
        >['request']['abi'],
        'setPaused',
        TMode
      > & { functionName?: 'setPaused' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'setPaused',
        TMode
      > & {
        abi?: never
        functionName?: 'setPaused'
      } = {} as any,
) {
  return useContractWrite<typeof multiPredictionMarketABI, 'setPaused', TMode>({
    abi: multiPredictionMarketABI,
    functionName: 'setPaused',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useMultiPredictionMarketTransferOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'transferOwnership',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"withdrawTreasuryFees"`.
 */
export function useMultiPredictionMarketWithdrawTreasuryFees<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof multiPredictionMarketABI,
          'withdrawTreasuryFees'
        >['request']['abi'],
        'withdrawTreasuryFees',
        TMode
      > & { functionName?: 'withdrawTreasuryFees' }
    : UseContractWriteConfig<
        typeof multiPredictionMarketABI,
        'withdrawTreasuryFees',
        TMode
      > & {
        abi?: never
        functionName?: 'withdrawTreasuryFees'
      } = {} as any,
) {
  return useContractWrite<
    typeof multiPredictionMarketABI,
    'withdrawTreasuryFees',
    TMode
  >({
    abi: multiPredictionMarketABI,
    functionName: 'withdrawTreasuryFees',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__.
 */
export function usePrepareMultiPredictionMarketWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      TFunctionName
    >,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"claim"`.
 */
export function usePrepareMultiPredictionMarketClaim(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multiPredictionMarketABI, 'claim'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'claim',
    ...config,
  } as UsePrepareContractWriteConfig<typeof multiPredictionMarketABI, 'claim'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"claimMultiple"`.
 */
export function usePrepareMultiPredictionMarketClaimMultiple(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'claimMultiple'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'claimMultiple',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'claimMultiple'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"createMarket"`.
 */
export function usePrepareMultiPredictionMarketCreateMarket(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'createMarket'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'createMarket',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'createMarket'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"emergencyResolveWindow"`.
 */
export function usePrepareMultiPredictionMarketEmergencyResolveWindow(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'emergencyResolveWindow'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'emergencyResolveWindow',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'emergencyResolveWindow'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"lockWindow"`.
 */
export function usePrepareMultiPredictionMarketLockWindow(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'lockWindow'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'lockWindow',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'lockWindow'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"manualTriggerWindow"`.
 */
export function usePrepareMultiPredictionMarketManualTriggerWindow(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'manualTriggerWindow'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'manualTriggerWindow',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'manualTriggerWindow'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"performUpkeep"`.
 */
export function usePrepareMultiPredictionMarketPerformUpkeep(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'performUpkeep'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'performUpkeep',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'performUpkeep'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"predict"`.
 */
export function usePrepareMultiPredictionMarketPredict(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multiPredictionMarketABI, 'predict'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'predict',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'predict'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareMultiPredictionMarketRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'renounceOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"resolveWindow"`.
 */
export function usePrepareMultiPredictionMarketResolveWindow(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'resolveWindow'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'resolveWindow',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'resolveWindow'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketEnabled"`.
 */
export function usePrepareMultiPredictionMarketSetMarketEnabled(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'setMarketEnabled'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketEnabled',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'setMarketEnabled'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketFee"`.
 */
export function usePrepareMultiPredictionMarketSetMarketFee(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'setMarketFee'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketFee',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'setMarketFee'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketPriceFeed"`.
 */
export function usePrepareMultiPredictionMarketSetMarketPriceFeed(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'setMarketPriceFeed'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketPriceFeed',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'setMarketPriceFeed'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setMarketWindowDuration"`.
 */
export function usePrepareMultiPredictionMarketSetMarketWindowDuration(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'setMarketWindowDuration'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'setMarketWindowDuration',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'setMarketWindowDuration'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"setPaused"`.
 */
export function usePrepareMultiPredictionMarketSetPaused(
  config: Omit<
    UsePrepareContractWriteConfig<typeof multiPredictionMarketABI, 'setPaused'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'setPaused',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'setPaused'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareMultiPredictionMarketTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'transferOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `functionName` set to `"withdrawTreasuryFees"`.
 */
export function usePrepareMultiPredictionMarketWithdrawTreasuryFees(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof multiPredictionMarketABI,
      'withdrawTreasuryFees'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: multiPredictionMarketABI,
    functionName: 'withdrawTreasuryFees',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof multiPredictionMarketABI,
    'withdrawTreasuryFees'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__.
 */
export function useMultiPredictionMarketEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"AutomationPerformed"`.
 */
export function useMultiPredictionMarketAutomationPerformedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'AutomationPerformed'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'AutomationPerformed',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'AutomationPerformed'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"ManualWindowTransition"`.
 */
export function useMultiPredictionMarketManualWindowTransitionEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'ManualWindowTransition'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'ManualWindowTransition',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'ManualWindowTransition'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"MarketCreated"`.
 */
export function useMultiPredictionMarketMarketCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'MarketCreated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'MarketCreated',
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, 'MarketCreated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"MarketEnabled"`.
 */
export function useMultiPredictionMarketMarketEnabledEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'MarketEnabled'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'MarketEnabled',
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, 'MarketEnabled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"MarketFeeUpdated"`.
 */
export function useMultiPredictionMarketMarketFeeUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'MarketFeeUpdated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'MarketFeeUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'MarketFeeUpdated'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"MarketPriceFeedUpdated"`.
 */
export function useMultiPredictionMarketMarketPriceFeedUpdatedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'MarketPriceFeedUpdated'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'MarketPriceFeedUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'MarketPriceFeedUpdated'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"MarketWindowDurationUpdated"`.
 */
export function useMultiPredictionMarketMarketWindowDurationUpdatedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'MarketWindowDurationUpdated'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'MarketWindowDurationUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'MarketWindowDurationUpdated'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"NewWindow"`.
 */
export function useMultiPredictionMarketNewWindowEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'NewWindow'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'NewWindow',
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, 'NewWindow'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useMultiPredictionMarketOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'OwnershipTransferred'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'OwnershipTransferred'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"PausedStateChanged"`.
 */
export function useMultiPredictionMarketPausedStateChangedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'PausedStateChanged'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'PausedStateChanged',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'PausedStateChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"PredictionPlaced"`.
 */
export function useMultiPredictionMarketPredictionPlacedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'PredictionPlaced'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'PredictionPlaced',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'PredictionPlaced'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"RewardClaimed"`.
 */
export function useMultiPredictionMarketRewardClaimedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'RewardClaimed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'RewardClaimed',
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, 'RewardClaimed'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"TreasuryFeesWithdrawn"`.
 */
export function useMultiPredictionMarketTreasuryFeesWithdrawnEvent(
  config: Omit<
    UseContractEventConfig<
      typeof multiPredictionMarketABI,
      'TreasuryFeesWithdrawn'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'TreasuryFeesWithdrawn',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'TreasuryFeesWithdrawn'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"WindowLocked"`.
 */
export function useMultiPredictionMarketWindowLockedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'WindowLocked'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'WindowLocked',
    ...config,
  } as UseContractEventConfig<typeof multiPredictionMarketABI, 'WindowLocked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link multiPredictionMarketABI}__ and `eventName` set to `"WindowResolved"`.
 */
export function useMultiPredictionMarketWindowResolvedEvent(
  config: Omit<
    UseContractEventConfig<typeof multiPredictionMarketABI, 'WindowResolved'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: multiPredictionMarketABI,
    eventName: 'WindowResolved',
    ...config,
  } as UseContractEventConfig<
    typeof multiPredictionMarketABI,
    'WindowResolved'
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__.
 */
export function usePepoRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any,
) {
  return useContractRead({ abi: pepoABI, ...config } as UseContractReadConfig<
    typeof pepoABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"allowance"`.
 */
export function usePepoAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"balanceOf"`.
 */
export function usePepoBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"decimals"`.
 */
export function usePepoDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"isPredictionMarket"`.
 */
export function usePepoIsPredictionMarket<
  TFunctionName extends 'isPredictionMarket',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'isPredictionMarket',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"isRewardVault"`.
 */
export function usePepoIsRewardVault<
  TFunctionName extends 'isRewardVault',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'isRewardVault',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"isRewardsDistributor"`.
 */
export function usePepoIsRewardsDistributor<
  TFunctionName extends 'isRewardsDistributor',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'isRewardsDistributor',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"isStakingContract"`.
 */
export function usePepoIsStakingContract<
  TFunctionName extends 'isStakingContract',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'isStakingContract',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"marketingWallet"`.
 */
export function usePepoMarketingWallet<
  TFunctionName extends 'marketingWallet',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'marketingWallet',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"name"`.
 */
export function usePepoName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"owner"`.
 */
export function usePepoOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"symbol"`.
 */
export function usePepoSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"teamWallet"`.
 */
export function usePepoTeamWallet<
  TFunctionName extends 'teamWallet',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'teamWallet',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"totalSupply"`.
 */
export function usePepoTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"treasuryWallet"`.
 */
export function usePepoTreasuryWallet<
  TFunctionName extends 'treasuryWallet',
  TSelectData = ReadContractResult<typeof pepoABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoABI,
    functionName: 'treasuryWallet',
    ...config,
  } as UseContractReadConfig<typeof pepoABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__.
 */
export function usePepoWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof pepoABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof pepoABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, TFunctionName, TMode>({
    abi: pepoABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"approve"`.
 */
export function usePepoApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof pepoABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof pepoABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'approve', TMode>({
    abi: pepoABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function usePepoRecoverErc20<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'recoverERC20'
        >['request']['abi'],
        'recoverERC20',
        TMode
      > & { functionName?: 'recoverERC20' }
    : UseContractWriteConfig<typeof pepoABI, 'recoverERC20', TMode> & {
        abi?: never
        functionName?: 'recoverERC20'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'recoverERC20', TMode>({
    abi: pepoABI,
    functionName: 'recoverERC20',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerPredictionMarket"`.
 */
export function usePepoRegisterPredictionMarket<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'registerPredictionMarket'
        >['request']['abi'],
        'registerPredictionMarket',
        TMode
      > & { functionName?: 'registerPredictionMarket' }
    : UseContractWriteConfig<
        typeof pepoABI,
        'registerPredictionMarket',
        TMode
      > & {
        abi?: never
        functionName?: 'registerPredictionMarket'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'registerPredictionMarket', TMode>({
    abi: pepoABI,
    functionName: 'registerPredictionMarket',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerRewardVault"`.
 */
export function usePepoRegisterRewardVault<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'registerRewardVault'
        >['request']['abi'],
        'registerRewardVault',
        TMode
      > & { functionName?: 'registerRewardVault' }
    : UseContractWriteConfig<typeof pepoABI, 'registerRewardVault', TMode> & {
        abi?: never
        functionName?: 'registerRewardVault'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'registerRewardVault', TMode>({
    abi: pepoABI,
    functionName: 'registerRewardVault',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerRewardsDistributor"`.
 */
export function usePepoRegisterRewardsDistributor<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'registerRewardsDistributor'
        >['request']['abi'],
        'registerRewardsDistributor',
        TMode
      > & { functionName?: 'registerRewardsDistributor' }
    : UseContractWriteConfig<
        typeof pepoABI,
        'registerRewardsDistributor',
        TMode
      > & {
        abi?: never
        functionName?: 'registerRewardsDistributor'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'registerRewardsDistributor', TMode>({
    abi: pepoABI,
    functionName: 'registerRewardsDistributor',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerStakingContract"`.
 */
export function usePepoRegisterStakingContract<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'registerStakingContract'
        >['request']['abi'],
        'registerStakingContract',
        TMode
      > & { functionName?: 'registerStakingContract' }
    : UseContractWriteConfig<
        typeof pepoABI,
        'registerStakingContract',
        TMode
      > & {
        abi?: never
        functionName?: 'registerStakingContract'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'registerStakingContract', TMode>({
    abi: pepoABI,
    functionName: 'registerStakingContract',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePepoRenounceOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<typeof pepoABI, 'renounceOwnership', TMode> & {
        abi?: never
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'renounceOwnership', TMode>({
    abi: pepoABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setMarketingWallet"`.
 */
export function usePepoSetMarketingWallet<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'setMarketingWallet'
        >['request']['abi'],
        'setMarketingWallet',
        TMode
      > & { functionName?: 'setMarketingWallet' }
    : UseContractWriteConfig<typeof pepoABI, 'setMarketingWallet', TMode> & {
        abi?: never
        functionName?: 'setMarketingWallet'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'setMarketingWallet', TMode>({
    abi: pepoABI,
    functionName: 'setMarketingWallet',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setTeamWallet"`.
 */
export function usePepoSetTeamWallet<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'setTeamWallet'
        >['request']['abi'],
        'setTeamWallet',
        TMode
      > & { functionName?: 'setTeamWallet' }
    : UseContractWriteConfig<typeof pepoABI, 'setTeamWallet', TMode> & {
        abi?: never
        functionName?: 'setTeamWallet'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'setTeamWallet', TMode>({
    abi: pepoABI,
    functionName: 'setTeamWallet',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setTreasuryWallet"`.
 */
export function usePepoSetTreasuryWallet<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'setTreasuryWallet'
        >['request']['abi'],
        'setTreasuryWallet',
        TMode
      > & { functionName?: 'setTreasuryWallet' }
    : UseContractWriteConfig<typeof pepoABI, 'setTreasuryWallet', TMode> & {
        abi?: never
        functionName?: 'setTreasuryWallet'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'setTreasuryWallet', TMode>({
    abi: pepoABI,
    functionName: 'setTreasuryWallet',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transfer"`.
 */
export function usePepoTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof pepoABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'transfer', TMode>({
    abi: pepoABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePepoTransferFrom<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof pepoABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'transferFrom', TMode>({
    abi: pepoABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePepoTransferOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<typeof pepoABI, 'transferOwnership', TMode> & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<typeof pepoABI, 'transferOwnership', TMode>({
    abi: pepoABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__.
 */
export function usePreparePepoWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"approve"`.
 */
export function usePreparePepoApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"recoverERC20"`.
 */
export function usePreparePepoRecoverErc20(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'recoverERC20'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'recoverERC20',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'recoverERC20'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerPredictionMarket"`.
 */
export function usePreparePepoRegisterPredictionMarket(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'registerPredictionMarket'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'registerPredictionMarket',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoABI,
    'registerPredictionMarket'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerRewardVault"`.
 */
export function usePreparePepoRegisterRewardVault(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'registerRewardVault'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'registerRewardVault',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'registerRewardVault'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerRewardsDistributor"`.
 */
export function usePreparePepoRegisterRewardsDistributor(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'registerRewardsDistributor'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'registerRewardsDistributor',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoABI,
    'registerRewardsDistributor'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"registerStakingContract"`.
 */
export function usePreparePepoRegisterStakingContract(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'registerStakingContract'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'registerStakingContract',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'registerStakingContract'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePreparePepoRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'renounceOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'renounceOwnership'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setMarketingWallet"`.
 */
export function usePreparePepoSetMarketingWallet(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'setMarketingWallet'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'setMarketingWallet',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'setMarketingWallet'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setTeamWallet"`.
 */
export function usePreparePepoSetTeamWallet(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'setTeamWallet'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'setTeamWallet',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'setTeamWallet'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"setTreasuryWallet"`.
 */
export function usePreparePepoSetTreasuryWallet(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'setTreasuryWallet'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'setTreasuryWallet',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'setTreasuryWallet'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transfer"`.
 */
export function usePreparePepoTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePreparePepoTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePreparePepoTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoABI, 'transferOwnership'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoABI, 'transferOwnership'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__.
 */
export function usePepoEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({ abi: pepoABI, ...config } as UseContractEventConfig<
    typeof pepoABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"Approval"`.
 */
export function usePepoApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"MarketingWalletUpdated"`.
 */
export function usePepoMarketingWalletUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'MarketingWalletUpdated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'MarketingWalletUpdated',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'MarketingWalletUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function usePepoOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'OwnershipTransferred'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"PredictionMarketRegistered"`.
 */
export function usePepoPredictionMarketRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'PredictionMarketRegistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'PredictionMarketRegistered',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'PredictionMarketRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"RewardVaultSet"`.
 */
export function usePepoRewardVaultSetEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'RewardVaultSet'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'RewardVaultSet',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'RewardVaultSet'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"RewardsDistributorRegistered"`.
 */
export function usePepoRewardsDistributorRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'RewardsDistributorRegistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'RewardsDistributorRegistered',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'RewardsDistributorRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"StakingContractRegistered"`.
 */
export function usePepoStakingContractRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'StakingContractRegistered'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'StakingContractRegistered',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'StakingContractRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"TeamWalletUpdated"`.
 */
export function usePepoTeamWalletUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'TeamWalletUpdated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'TeamWalletUpdated',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'TeamWalletUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"Transfer"`.
 */
export function usePepoTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoABI}__ and `eventName` set to `"TreasuryWalletUpdated"`.
 */
export function usePepoTreasuryWalletUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoABI, 'TreasuryWalletUpdated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoABI,
    eventName: 'TreasuryWalletUpdated',
    ...config,
  } as UseContractEventConfig<typeof pepoABI, 'TreasuryWalletUpdated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__.
 */
export function usePepoDutchAuctionRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"UNLOCKED_PERCENT"`.
 */
export function usePepoDutchAuctionUnlockedPercent<
  TFunctionName extends 'UNLOCKED_PERCENT',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'UNLOCKED_PERCENT',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"VESTED_PERCENT"`.
 */
export function usePepoDutchAuctionVestedPercent<
  TFunctionName extends 'VESTED_PERCENT',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'VESTED_PERCENT',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"VESTING_DURATION"`.
 */
export function usePepoDutchAuctionVestingDuration<
  TFunctionName extends 'VESTING_DURATION',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'VESTING_DURATION',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"auctionEnded"`.
 */
export function usePepoDutchAuctionAuctionEnded<
  TFunctionName extends 'auctionEnded',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'auctionEnded',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"emergencyStop"`.
 */
export function usePepoDutchAuctionEmergencyStop<
  TFunctionName extends 'emergencyStop',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'emergencyStop',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"endPrice"`.
 */
export function usePepoDutchAuctionEndPrice<
  TFunctionName extends 'endPrice',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'endPrice',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"endTime"`.
 */
export function usePepoDutchAuctionEndTime<
  TFunctionName extends 'endTime',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'endTime',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getAuctionInfo"`.
 */
export function usePepoDutchAuctionGetAuctionInfo<
  TFunctionName extends 'getAuctionInfo',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getAuctionInfo',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getClaimableAmounts"`.
 */
export function usePepoDutchAuctionGetClaimableAmounts<
  TFunctionName extends 'getClaimableAmounts',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getClaimableAmounts',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getCurrentPrice"`.
 */
export function usePepoDutchAuctionGetCurrentPrice<
  TFunctionName extends 'getCurrentPrice',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getCurrentPrice',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getParticipantCount"`.
 */
export function usePepoDutchAuctionGetParticipantCount<
  TFunctionName extends 'getParticipantCount',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getParticipantCount',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getParticipants"`.
 */
export function usePepoDutchAuctionGetParticipants<
  TFunctionName extends 'getParticipants',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getParticipants',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getTimeElapsed"`.
 */
export function usePepoDutchAuctionGetTimeElapsed<
  TFunctionName extends 'getTimeElapsed',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getTimeElapsed',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getTimeRemaining"`.
 */
export function usePepoDutchAuctionGetTimeRemaining<
  TFunctionName extends 'getTimeRemaining',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getTimeRemaining',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getTotalAllocation"`.
 */
export function usePepoDutchAuctionGetTotalAllocation<
  TFunctionName extends 'getTotalAllocation',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getTotalAllocation',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getUserDistributionInfo"`.
 */
export function usePepoDutchAuctionGetUserDistributionInfo<
  TFunctionName extends 'getUserDistributionInfo',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getUserDistributionInfo',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getUserInfo"`.
 */
export function usePepoDutchAuctionGetUserInfo<
  TFunctionName extends 'getUserInfo',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getUserInfo',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getVestingInfo"`.
 */
export function usePepoDutchAuctionGetVestingInfo<
  TFunctionName extends 'getVestingInfo',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getVestingInfo',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"getVestingProgress"`.
 */
export function usePepoDutchAuctionGetVestingProgress<
  TFunctionName extends 'getVestingProgress',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'getVestingProgress',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"hasClaimableTokens"`.
 */
export function usePepoDutchAuctionHasClaimableTokens<
  TFunctionName extends 'hasClaimableTokens',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'hasClaimableTokens',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"owner"`.
 */
export function usePepoDutchAuctionOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"paused"`.
 */
export function usePepoDutchAuctionPaused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'paused',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"pepo"`.
 */
export function usePepoDutchAuctionPepo<
  TFunctionName extends 'pepo',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'pepo',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"startPrice"`.
 */
export function usePepoDutchAuctionStartPrice<
  TFunctionName extends 'startPrice',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'startPrice',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"startTime"`.
 */
export function usePepoDutchAuctionStartTime<
  TFunctionName extends 'startTime',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'startTime',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"tokensForSale"`.
 */
export function usePepoDutchAuctionTokensForSale<
  TFunctionName extends 'tokensForSale',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'tokensForSale',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"tokensSold"`.
 */
export function usePepoDutchAuctionTokensSold<
  TFunctionName extends 'tokensSold',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'tokensSold',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"totalParticipants"`.
 */
export function usePepoDutchAuctionTotalParticipants<
  TFunctionName extends 'totalParticipants',
  TSelectData = ReadContractResult<typeof pepoDutchAuctionABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof pepoDutchAuctionABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: pepoDutchAuctionABI,
    functionName: 'totalParticipants',
    ...config,
  } as UseContractReadConfig<
    typeof pepoDutchAuctionABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__.
 */
export function usePepoDutchAuctionWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, TFunctionName, TMode>({
    abi: pepoDutchAuctionABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"claimTokens"`.
 */
export function usePepoDutchAuctionClaimTokens<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'claimTokens'
        >['request']['abi'],
        'claimTokens',
        TMode
      > & { functionName?: 'claimTokens' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'claimTokens',
        TMode
      > & {
        abi?: never
        functionName?: 'claimTokens'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'claimTokens', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'claimTokens',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"contribute"`.
 */
export function usePepoDutchAuctionContribute<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'contribute'
        >['request']['abi'],
        'contribute',
        TMode
      > & { functionName?: 'contribute' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'contribute',
        TMode
      > & {
        abi?: never
        functionName?: 'contribute'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'contribute', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'contribute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"emergencyWithdraw"`.
 */
export function usePepoDutchAuctionEmergencyWithdraw<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'emergencyWithdraw'
        >['request']['abi'],
        'emergencyWithdraw',
        TMode
      > & { functionName?: 'emergencyWithdraw' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'emergencyWithdraw',
        TMode
      > & {
        abi?: never
        functionName?: 'emergencyWithdraw'
      } = {} as any,
) {
  return useContractWrite<
    typeof pepoDutchAuctionABI,
    'emergencyWithdraw',
    TMode
  >({
    abi: pepoDutchAuctionABI,
    functionName: 'emergencyWithdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"endAuction"`.
 */
export function usePepoDutchAuctionEndAuction<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'endAuction'
        >['request']['abi'],
        'endAuction',
        TMode
      > & { functionName?: 'endAuction' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'endAuction',
        TMode
      > & {
        abi?: never
        functionName?: 'endAuction'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'endAuction', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'endAuction',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"pause"`.
 */
export function usePepoDutchAuctionPause<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'pause'
        >['request']['abi'],
        'pause',
        TMode
      > & { functionName?: 'pause' }
    : UseContractWriteConfig<typeof pepoDutchAuctionABI, 'pause', TMode> & {
        abi?: never
        functionName?: 'pause'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'pause', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'pause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePepoDutchAuctionRenounceOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'renounceOwnership'
        >['request']['abi'],
        'renounceOwnership',
        TMode
      > & { functionName?: 'renounceOwnership' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'renounceOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'renounceOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof pepoDutchAuctionABI,
    'renounceOwnership',
    TMode
  >({
    abi: pepoDutchAuctionABI,
    functionName: 'renounceOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"setEmergencyStop"`.
 */
export function usePepoDutchAuctionSetEmergencyStop<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'setEmergencyStop'
        >['request']['abi'],
        'setEmergencyStop',
        TMode
      > & { functionName?: 'setEmergencyStop' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'setEmergencyStop',
        TMode
      > & {
        abi?: never
        functionName?: 'setEmergencyStop'
      } = {} as any,
) {
  return useContractWrite<
    typeof pepoDutchAuctionABI,
    'setEmergencyStop',
    TMode
  >({
    abi: pepoDutchAuctionABI,
    functionName: 'setEmergencyStop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"startAuction"`.
 */
export function usePepoDutchAuctionStartAuction<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'startAuction'
        >['request']['abi'],
        'startAuction',
        TMode
      > & { functionName?: 'startAuction' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'startAuction',
        TMode
      > & {
        abi?: never
        functionName?: 'startAuction'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'startAuction', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'startAuction',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePepoDutchAuctionTransferOwnership<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'transferOwnership'
        >['request']['abi'],
        'transferOwnership',
        TMode
      > & { functionName?: 'transferOwnership' }
    : UseContractWriteConfig<
        typeof pepoDutchAuctionABI,
        'transferOwnership',
        TMode
      > & {
        abi?: never
        functionName?: 'transferOwnership'
      } = {} as any,
) {
  return useContractWrite<
    typeof pepoDutchAuctionABI,
    'transferOwnership',
    TMode
  >({
    abi: pepoDutchAuctionABI,
    functionName: 'transferOwnership',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"unpause"`.
 */
export function usePepoDutchAuctionUnpause<
  TMode extends WriteContractMode = undefined,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof pepoDutchAuctionABI,
          'unpause'
        >['request']['abi'],
        'unpause',
        TMode
      > & { functionName?: 'unpause' }
    : UseContractWriteConfig<typeof pepoDutchAuctionABI, 'unpause', TMode> & {
        abi?: never
        functionName?: 'unpause'
      } = {} as any,
) {
  return useContractWrite<typeof pepoDutchAuctionABI, 'unpause', TMode>({
    abi: pepoDutchAuctionABI,
    functionName: 'unpause',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__.
 */
export function usePreparePepoDutchAuctionWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, TFunctionName>,
    'abi'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"claimTokens"`.
 */
export function usePreparePepoDutchAuctionClaimTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'claimTokens'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'claimTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'claimTokens'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"contribute"`.
 */
export function usePreparePepoDutchAuctionContribute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'contribute'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'contribute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'contribute'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"emergencyWithdraw"`.
 */
export function usePreparePepoDutchAuctionEmergencyWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof pepoDutchAuctionABI,
      'emergencyWithdraw'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'emergencyWithdraw',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoDutchAuctionABI,
    'emergencyWithdraw'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"endAuction"`.
 */
export function usePreparePepoDutchAuctionEndAuction(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'endAuction'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'endAuction',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'endAuction'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"pause"`.
 */
export function usePreparePepoDutchAuctionPause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'pause'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'pause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'pause'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePreparePepoDutchAuctionRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof pepoDutchAuctionABI,
      'renounceOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'renounceOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoDutchAuctionABI,
    'renounceOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"setEmergencyStop"`.
 */
export function usePreparePepoDutchAuctionSetEmergencyStop(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof pepoDutchAuctionABI,
      'setEmergencyStop'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'setEmergencyStop',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoDutchAuctionABI,
    'setEmergencyStop'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"startAuction"`.
 */
export function usePreparePepoDutchAuctionStartAuction(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'startAuction'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'startAuction',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoDutchAuctionABI,
    'startAuction'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePreparePepoDutchAuctionTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof pepoDutchAuctionABI,
      'transferOwnership'
    >,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'transferOwnership',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof pepoDutchAuctionABI,
    'transferOwnership'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `functionName` set to `"unpause"`.
 */
export function usePreparePepoDutchAuctionUnpause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'unpause'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: pepoDutchAuctionABI,
    functionName: 'unpause',
    ...config,
  } as UsePrepareContractWriteConfig<typeof pepoDutchAuctionABI, 'unpause'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__.
 */
export function usePepoDutchAuctionEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"AuctionEnded"`.
 */
export function usePepoDutchAuctionAuctionEndedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'AuctionEnded'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'AuctionEnded',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'AuctionEnded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"AuctionStarted"`.
 */
export function usePepoDutchAuctionAuctionStartedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'AuctionStarted'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'AuctionStarted',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'AuctionStarted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"ContributionMade"`.
 */
export function usePepoDutchAuctionContributionMadeEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'ContributionMade'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'ContributionMade',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'ContributionMade'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"EmergencyStatusChanged"`.
 */
export function usePepoDutchAuctionEmergencyStatusChangedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof pepoDutchAuctionABI,
      'EmergencyStatusChanged'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'EmergencyStatusChanged',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'EmergencyStatusChanged'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function usePepoDutchAuctionOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'OwnershipTransferred'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'OwnershipTransferred'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"Paused"`.
 */
export function usePepoDutchAuctionPausedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'Paused'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'Paused',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'Paused'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"TokenDistributionUpdated"`.
 */
export function usePepoDutchAuctionTokenDistributionUpdatedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof pepoDutchAuctionABI,
      'TokenDistributionUpdated'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'TokenDistributionUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'TokenDistributionUpdated'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"TokensPurchased"`.
 */
export function usePepoDutchAuctionTokensPurchasedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'TokensPurchased'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'TokensPurchased',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'TokensPurchased'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"UnlockedTokensClaimed"`.
 */
export function usePepoDutchAuctionUnlockedTokensClaimedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'UnlockedTokensClaimed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'UnlockedTokensClaimed',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'UnlockedTokensClaimed'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"Unpaused"`.
 */
export function usePepoDutchAuctionUnpausedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'Unpaused'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'Unpaused',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'Unpaused'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"UserParticipationUpdate"`.
 */
export function usePepoDutchAuctionUserParticipationUpdateEvent(
  config: Omit<
    UseContractEventConfig<
      typeof pepoDutchAuctionABI,
      'UserParticipationUpdate'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'UserParticipationUpdate',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'UserParticipationUpdate'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"VestedTokensClaimed"`.
 */
export function usePepoDutchAuctionVestedTokensClaimedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'VestedTokensClaimed'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'VestedTokensClaimed',
    ...config,
  } as UseContractEventConfig<
    typeof pepoDutchAuctionABI,
    'VestedTokensClaimed'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link pepoDutchAuctionABI}__ and `eventName` set to `"VestingUpdated"`.
 */
export function usePepoDutchAuctionVestingUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof pepoDutchAuctionABI, 'VestingUpdated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: pepoDutchAuctionABI,
    eventName: 'VestingUpdated',
    ...config,
  } as UseContractEventConfig<typeof pepoDutchAuctionABI, 'VestingUpdated'>)
}

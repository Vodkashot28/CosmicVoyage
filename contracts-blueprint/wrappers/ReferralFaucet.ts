import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendResult } from '@ton/core';

export type ReferralFaucetConfig = Record<string, never>;

export function referralFaucetConfigToCell(config: ReferralFaucetConfig): Cell {
  return beginCell().endCell();
}

export class ReferralFaucet implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new ReferralFaucet(address);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, opts: any) {
    await provider.internal(via, opts);
  }
}

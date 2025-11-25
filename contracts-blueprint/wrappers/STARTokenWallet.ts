import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendResult } from '@ton/core';

export type STARTokenWalletConfig = Record<string, never>;

export function starTokenWalletConfigToCell(config: STARTokenWalletConfig): Cell {
  return beginCell().endCell();
}

export class STARTokenWallet implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new STARTokenWallet(address);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, opts: any) {
    await provider.internal(via, opts);
  }
}

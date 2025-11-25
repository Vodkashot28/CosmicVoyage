import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendResult } from '@ton/core';

export type STARTokenConfig = Record<string, never>;

export function starTokenConfigToCell(config: STARTokenConfig): Cell {
  return beginCell().endCell();
}

export class STARToken implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new STARToken(address);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, opts: any) {
    await provider.internal(via, opts);
  }
}

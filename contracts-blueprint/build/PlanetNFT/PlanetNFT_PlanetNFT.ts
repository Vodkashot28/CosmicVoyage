import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    queryId: bigint;
    planet: string;
    receiver: Address;
    amount: bigint;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(601378205, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeStringRefTail(src.planet);
        b_0.storeAddress(src.receiver);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 601378205) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadIntBig(257);
    const _planet = sc_0.loadStringRefTail();
    const _receiver = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'Mint' as const, queryId: _queryId, planet: _planet, receiver: _receiver, amount: _amount };
}

export function loadTupleMint(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _planet = source.readString();
    const _receiver = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'Mint' as const, queryId: _queryId, planet: _planet, receiver: _receiver, amount: _amount };
}

export function loadGetterTupleMint(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _planet = source.readString();
    const _receiver = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'Mint' as const, queryId: _queryId, planet: _planet, receiver: _receiver, amount: _amount };
}

export function storeTupleMint(source: Mint) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeString(source.planet);
    builder.writeAddress(source.receiver);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type SetBaseURI = {
    $$type: 'SetBaseURI';
    newBaseURI: string;
}

export function storeSetBaseURI(src: SetBaseURI) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1872812344, 32);
        b_0.storeStringRefTail(src.newBaseURI);
    };
}

export function loadSetBaseURI(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1872812344) { throw Error('Invalid prefix'); }
    const _newBaseURI = sc_0.loadStringRefTail();
    return { $$type: 'SetBaseURI' as const, newBaseURI: _newBaseURI };
}

export function loadTupleSetBaseURI(source: TupleReader) {
    const _newBaseURI = source.readString();
    return { $$type: 'SetBaseURI' as const, newBaseURI: _newBaseURI };
}

export function loadGetterTupleSetBaseURI(source: TupleReader) {
    const _newBaseURI = source.readString();
    return { $$type: 'SetBaseURI' as const, newBaseURI: _newBaseURI };
}

export function storeTupleSetBaseURI(source: SetBaseURI) {
    const builder = new TupleBuilder();
    builder.writeString(source.newBaseURI);
    return builder.build();
}

export function dictValueParserSetBaseURI(): DictionaryValue<SetBaseURI> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetBaseURI(src)).endCell());
        },
        parse: (src) => {
            return loadSetBaseURI(src.loadRef().beginParse());
        }
    }
}

export type SetRoyalty = {
    $$type: 'SetRoyalty';
    numerator: bigint;
    denominator: bigint;
}

export function storeSetRoyalty(src: SetRoyalty) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(638969865, 32);
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
    };
}

export function loadSetRoyalty(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 638969865) { throw Error('Invalid prefix'); }
    const _numerator = sc_0.loadIntBig(257);
    const _denominator = sc_0.loadIntBig(257);
    return { $$type: 'SetRoyalty' as const, numerator: _numerator, denominator: _denominator };
}

export function loadTupleSetRoyalty(source: TupleReader) {
    const _numerator = source.readBigNumber();
    const _denominator = source.readBigNumber();
    return { $$type: 'SetRoyalty' as const, numerator: _numerator, denominator: _denominator };
}

export function loadGetterTupleSetRoyalty(source: TupleReader) {
    const _numerator = source.readBigNumber();
    const _denominator = source.readBigNumber();
    return { $$type: 'SetRoyalty' as const, numerator: _numerator, denominator: _denominator };
}

export function storeTupleSetRoyalty(source: SetRoyalty) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    return builder.build();
}

export function dictValueParserSetRoyalty(): DictionaryValue<SetRoyalty> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetRoyalty(src)).endCell());
        },
        parse: (src) => {
            return loadSetRoyalty(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    nftId: bigint;
    receiver: Address;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1510310028, 32);
        b_0.storeInt(src.nftId, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadTokenTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1510310028) { throw Error('Invalid prefix'); }
    const _nftId = sc_0.loadIntBig(257);
    const _receiver = sc_0.loadAddress();
    return { $$type: 'TokenTransfer' as const, nftId: _nftId, receiver: _receiver };
}

export function loadTupleTokenTransfer(source: TupleReader) {
    const _nftId = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'TokenTransfer' as const, nftId: _nftId, receiver: _receiver };
}

export function loadGetterTupleTokenTransfer(source: TupleReader) {
    const _nftId = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'TokenTransfer' as const, nftId: _nftId, receiver: _receiver };
}

export function storeTupleTokenTransfer(source: TokenTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nftId);
    builder.writeAddress(source.receiver);
    return builder.build();
}

export function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type CollectionInfo = {
    $$type: 'CollectionInfo';
    name: string;
    symbol: string;
    description: string;
    nextNFTId: bigint;
    totalMinted: bigint;
}

export function storeCollectionInfo(src: CollectionInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
        b_0.storeStringRefTail(src.description);
        b_0.storeInt(src.nextNFTId, 257);
        b_0.storeInt(src.totalMinted, 257);
    };
}

export function loadCollectionInfo(slice: Slice) {
    const sc_0 = slice;
    const _name = sc_0.loadStringRefTail();
    const _symbol = sc_0.loadStringRefTail();
    const _description = sc_0.loadStringRefTail();
    const _nextNFTId = sc_0.loadIntBig(257);
    const _totalMinted = sc_0.loadIntBig(257);
    return { $$type: 'CollectionInfo' as const, name: _name, symbol: _symbol, description: _description, nextNFTId: _nextNFTId, totalMinted: _totalMinted };
}

export function loadTupleCollectionInfo(source: TupleReader) {
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _nextNFTId = source.readBigNumber();
    const _totalMinted = source.readBigNumber();
    return { $$type: 'CollectionInfo' as const, name: _name, symbol: _symbol, description: _description, nextNFTId: _nextNFTId, totalMinted: _totalMinted };
}

export function loadGetterTupleCollectionInfo(source: TupleReader) {
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _nextNFTId = source.readBigNumber();
    const _totalMinted = source.readBigNumber();
    return { $$type: 'CollectionInfo' as const, name: _name, symbol: _symbol, description: _description, nextNFTId: _nextNFTId, totalMinted: _totalMinted };
}

export function storeTupleCollectionInfo(source: CollectionInfo) {
    const builder = new TupleBuilder();
    builder.writeString(source.name);
    builder.writeString(source.symbol);
    builder.writeString(source.description);
    builder.writeNumber(source.nextNFTId);
    builder.writeNumber(source.totalMinted);
    return builder.build();
}

export function dictValueParserCollectionInfo(): DictionaryValue<CollectionInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionInfo(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionInfo(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyInfo = {
    $$type: 'RoyaltyInfo';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeRoyaltyInfo(src: RoyaltyInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}

export function loadRoyaltyInfo(slice: Slice) {
    const sc_0 = slice;
    const _numerator = sc_0.loadIntBig(257);
    const _denominator = sc_0.loadIntBig(257);
    const _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyInfo' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

export function loadTupleRoyaltyInfo(source: TupleReader) {
    const _numerator = source.readBigNumber();
    const _denominator = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'RoyaltyInfo' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

export function loadGetterTupleRoyaltyInfo(source: TupleReader) {
    const _numerator = source.readBigNumber();
    const _denominator = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'RoyaltyInfo' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

export function storeTupleRoyaltyInfo(source: RoyaltyInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserRoyaltyInfo(): DictionaryValue<RoyaltyInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyInfo(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyInfo(src.loadRef().beginParse());
        }
    }
}

export type PlanetNFT$Data = {
    $$type: 'PlanetNFT$Data';
    name: string;
    symbol: string;
    description: string;
    owner: Address;
    nextNFTId: bigint;
    totalMinted: bigint;
    baseURI: string;
    royaltyNumerator: bigint;
    royaltyDenominator: bigint;
    royaltyDestination: Address;
    nftOwners: Dictionary<bigint, Address>;
    allowedMinters: Dictionary<Address, boolean>;
}

export function storePlanetNFT$Data(src: PlanetNFT$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.description);
        b_1.storeAddress(src.owner);
        b_1.storeInt(src.nextNFTId, 257);
        b_1.storeInt(src.totalMinted, 257);
        b_1.storeStringRefTail(src.baseURI);
        const b_2 = new Builder();
        b_2.storeInt(src.royaltyNumerator, 257);
        b_2.storeInt(src.royaltyDenominator, 257);
        b_2.storeAddress(src.royaltyDestination);
        b_2.storeDict(src.nftOwners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_2.storeDict(src.allowedMinters, Dictionary.Keys.Address(), Dictionary.Values.Bool());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadPlanetNFT$Data(slice: Slice) {
    const sc_0 = slice;
    const _name = sc_0.loadStringRefTail();
    const _symbol = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _description = sc_1.loadStringRefTail();
    const _owner = sc_1.loadAddress();
    const _nextNFTId = sc_1.loadIntBig(257);
    const _totalMinted = sc_1.loadIntBig(257);
    const _baseURI = sc_1.loadStringRefTail();
    const sc_2 = sc_1.loadRef().beginParse();
    const _royaltyNumerator = sc_2.loadIntBig(257);
    const _royaltyDenominator = sc_2.loadIntBig(257);
    const _royaltyDestination = sc_2.loadAddress();
    const _nftOwners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_2);
    const _allowedMinters = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_2);
    return { $$type: 'PlanetNFT$Data' as const, name: _name, symbol: _symbol, description: _description, owner: _owner, nextNFTId: _nextNFTId, totalMinted: _totalMinted, baseURI: _baseURI, royaltyNumerator: _royaltyNumerator, royaltyDenominator: _royaltyDenominator, royaltyDestination: _royaltyDestination, nftOwners: _nftOwners, allowedMinters: _allowedMinters };
}

export function loadTuplePlanetNFT$Data(source: TupleReader) {
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _owner = source.readAddress();
    const _nextNFTId = source.readBigNumber();
    const _totalMinted = source.readBigNumber();
    const _baseURI = source.readString();
    const _royaltyNumerator = source.readBigNumber();
    const _royaltyDenominator = source.readBigNumber();
    const _royaltyDestination = source.readAddress();
    const _nftOwners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _allowedMinters = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'PlanetNFT$Data' as const, name: _name, symbol: _symbol, description: _description, owner: _owner, nextNFTId: _nextNFTId, totalMinted: _totalMinted, baseURI: _baseURI, royaltyNumerator: _royaltyNumerator, royaltyDenominator: _royaltyDenominator, royaltyDestination: _royaltyDestination, nftOwners: _nftOwners, allowedMinters: _allowedMinters };
}

export function loadGetterTuplePlanetNFT$Data(source: TupleReader) {
    const _name = source.readString();
    const _symbol = source.readString();
    const _description = source.readString();
    const _owner = source.readAddress();
    const _nextNFTId = source.readBigNumber();
    const _totalMinted = source.readBigNumber();
    const _baseURI = source.readString();
    const _royaltyNumerator = source.readBigNumber();
    const _royaltyDenominator = source.readBigNumber();
    const _royaltyDestination = source.readAddress();
    const _nftOwners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _allowedMinters = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'PlanetNFT$Data' as const, name: _name, symbol: _symbol, description: _description, owner: _owner, nextNFTId: _nextNFTId, totalMinted: _totalMinted, baseURI: _baseURI, royaltyNumerator: _royaltyNumerator, royaltyDenominator: _royaltyDenominator, royaltyDestination: _royaltyDestination, nftOwners: _nftOwners, allowedMinters: _allowedMinters };
}

export function storeTuplePlanetNFT$Data(source: PlanetNFT$Data) {
    const builder = new TupleBuilder();
    builder.writeString(source.name);
    builder.writeString(source.symbol);
    builder.writeString(source.description);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.nextNFTId);
    builder.writeNumber(source.totalMinted);
    builder.writeString(source.baseURI);
    builder.writeNumber(source.royaltyNumerator);
    builder.writeNumber(source.royaltyDenominator);
    builder.writeAddress(source.royaltyDestination);
    builder.writeCell(source.nftOwners.size > 0 ? beginCell().storeDictDirect(source.nftOwners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    builder.writeCell(source.allowedMinters.size > 0 ? beginCell().storeDictDirect(source.allowedMinters, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    return builder.build();
}

export function dictValueParserPlanetNFT$Data(): DictionaryValue<PlanetNFT$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePlanetNFT$Data(src)).endCell());
        },
        parse: (src) => {
            return loadPlanetNFT$Data(src.loadRef().beginParse());
        }
    }
}

 type PlanetNFT_init_args = {
    $$type: 'PlanetNFT_init_args';
    owner: Address;
    royaltyDestination: Address;
}

function initPlanetNFT_init_args(src: PlanetNFT_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.royaltyDestination);
    };
}

async function PlanetNFT_init(owner: Address, royaltyDestination: Address) {
    const __code = Cell.fromHex('b5ee9c7241020c0100040b0003fcff00208f783001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e37d401d001d401d0d401d001d401d001fa40810101d700810101d700d401d001d430d0810101d700810101d700fa40f404f4043010bc6c1c8e8afa40fa405902d101db3ce20d925f0de0702cd74920c21f95310cd31f0dde21e101040b02d88d0514dbdb185c8814de5cdd195b48141b185b995d1ce08b6504c414e455488d0e911a5cd8dbdd995c88185b99081bdddb881c1b185b995d1cc81a5b881d1a194814dbdb185c8814de5cdd195b48115e1c1b1bdc995c8819d85b59607020897580646d6d2b81010b500d7f710203004868747470733a2f2f736f6c617273797374656d6578706c6f7265722e636f6d2f6e66742f0048216e955b59f4593098c801cf004133f441e2109b108a107910781067105610451034102302fe821023d84d9dba8ef65b0b810101d70031d431fa40810101d7003081010bf8422f59714133f40a6fa19401d70030925b6de270216eb39630206ef2d0809131e2810aba01917f95f8422ac705e2f2f481259c01c001f2f426a406a4102c8101015082206e953059f45a30944133f414e2109b108a107910685e241035440302090504fae02182105a05808cba8ed55b0b810101d700fa40302c8101012359f40c6fa192306ddff842216eb39630206ef2d0809131e28200c7615112c705f2f4102c81010159206e953059f45a30944133f414e2109b108a107910681057104610354403e02182106fa0d938bae3022182102615e809bae302218210946a98b6ba0906070800c45b340ad430d08111eaf84228c705f2f4109b108a10791068105710464435c87f01ca0055b00bc8ce1ccdc80ac8ce1acd08c8ce18cd16ce14810101cf0012810101cf0001c8cecd01c8810101cf0012810101cf0012ce14f40012f40012cdcdc9ed5400d85b6c2209810101d700810101d7003081136ef84228c705f2f4109b108a1079106810571046035045c87f01ca0055b00bc8ce1ccdc80ac8ce1acd08c8ce18cd16ce14810101cf0012810101cf0001c8cecd01c8810101cf0012810101cf0012ce14f40012f40012cdcdc9ed5402b68ec95b0bd33f30c8018210aff90f5758cb1fcb3fc910ac109b108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e03dc0000cc1211cb0e3025f0cf2c082090a0088c87f01ca0055b00bc8ce1ccdc80ac8ce1acd08c8ce18cd16ce14810101cf0012810101cf0001c8cecd01c8810101cf0012810101cf0012ce14f40012f40012cdcdc9ed540090109b5518c87f01ca0055b00bc8ce1ccdc80ac8ce1acd08c8ce18cd16ce14810101cf0012810101cf0001c8cecd01c8810101cf0012810101cf0012ce14f40012f40012cdcdc9ed540006f2c80bfff9dafb');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initPlanetNFT_init_args({ $$type: 'PlanetNFT_init_args', owner, royaltyDestination })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const PlanetNFT_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    2746: { message: "Not authorized to mint" },
    4586: { message: "Only owner can set base URI" },
    4974: { message: "Only owner can set royalty" },
    9628: { message: "Can only mint 1 NFT at a time" },
    28969: { message: "Only owner can add minters" },
    51041: { message: "Not NFT owner" },
    63335: { message: "Only owner can remove minters" },
} as const

export const PlanetNFT_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Not authorized to mint": 2746,
    "Only owner can set base URI": 4586,
    "Only owner can set royalty": 4974,
    "Can only mint 1 NFT at a time": 9628,
    "Only owner can add minters": 28969,
    "Not NFT owner": 51041,
    "Only owner can remove minters": 63335,
} as const

const PlanetNFT_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Mint","header":601378205,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"planet","type":{"kind":"simple","type":"string","optional":false}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SetBaseURI","header":1872812344,"fields":[{"name":"newBaseURI","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"SetRoyalty","header":638969865,"fields":[{"name":"numerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"TokenTransfer","header":1510310028,"fields":[{"name":"nftId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CollectionInfo","header":null,"fields":[{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"symbol","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"nextNFTId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalMinted","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"RoyaltyInfo","header":null,"fields":[{"name":"numerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"PlanetNFT$Data","header":null,"fields":[{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"symbol","type":{"kind":"simple","type":"string","optional":false}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"nextNFTId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalMinted","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"baseURI","type":{"kind":"simple","type":"string","optional":false}},{"name":"royaltyNumerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"royaltyDenominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"royaltyDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"nftOwners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"allowedMinters","type":{"kind":"dict","key":"address","value":"bool"}}]},
]

const PlanetNFT_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "Mint": 601378205,
    "SetBaseURI": 1872812344,
    "SetRoyalty": 638969865,
    "TokenTransfer": 1510310028,
}

const PlanetNFT_getters: ABIGetter[] = [
]

export const PlanetNFT_getterMapping: { [key: string]: string } = {
}

const PlanetNFT_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetBaseURI"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetRoyalty"}},
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class PlanetNFT implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = PlanetNFT_errors_backward;
    public static readonly opcodes = PlanetNFT_opcodes;
    
    static async init(owner: Address, royaltyDestination: Address) {
        return await PlanetNFT_init(owner, royaltyDestination);
    }
    
    static async fromInit(owner: Address, royaltyDestination: Address) {
        const __gen_init = await PlanetNFT_init(owner, royaltyDestination);
        const address = contractAddress(0, __gen_init);
        return new PlanetNFT(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new PlanetNFT(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  PlanetNFT_types,
        getters: PlanetNFT_getters,
        receivers: PlanetNFT_receivers,
        errors: PlanetNFT_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | TokenTransfer | SetBaseURI | SetRoyalty | null | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenTransfer') {
            body = beginCell().store(storeTokenTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetBaseURI') {
            body = beginCell().store(storeSetBaseURI(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetRoyalty') {
            body = beginCell().store(storeSetRoyalty(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
}
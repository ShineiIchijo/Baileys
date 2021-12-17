import type { Contact } from "./Contact"
import type { proto } from "../../WAProto"

export type KeyPair = { public: Uint8Array, private: Uint8Array }
export type SignedKeyPair = { keyPair: KeyPair, signature: Uint8Array, keyId: number }

export type ProtocolAddress = {
	name: string // jid
	deviceId: number
}
export type SignalIdentity = {
	identifier: ProtocolAddress
	identifierKey: Uint8Array
}

export type LTHashState = { 
    version: number
    hash: Buffer
    indexValueMap: { 
        [indexMacBase64: string]: { valueMac: Uint8Array | Buffer }
    }
}

export type SignalCreds = {
    readonly signedIdentityKey: KeyPair
    readonly signedPreKey: SignedKeyPair
    readonly registrationId: number
}

export type AuthenticationCreds = SignalCreds & {
    readonly noiseKey: KeyPair
    readonly advSecretKey: string
    
    me?: Contact
    account?: proto.IADVSignedDeviceIdentity
    signalIdentities?: SignalIdentity[]
    myAppStateKeyId?: string
    firstUnuploadedPreKeyId: number
    serverHasPreKeys: boolean
    nextPreKeyId: number

    lastAccountSyncTimestamp?: number
}

export type SignalDataTypeMap = {
    'pre-key': KeyPair
    'session': any
    'sender-key': any
    'sender-key-memory': { [jid: string]: boolean }
    'app-state-sync-key': proto.IAppStateSyncKeyData
    'app-state-sync-version': LTHashState
}

export type SignalDataSet = { [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] | null } }

type Awaitable<T> = T | Promise<T>

export type SignalKeyStore = {
    get<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Awaitable<{ [id: string]: SignalDataTypeMap[T] }>
    set(data: SignalDataSet): Awaitable<void>
}

export type SignalKeyStoreWithTransaction = SignalKeyStore & {
    isInTransaction: () => boolean
    transaction(exec: () => Promise<void>): Promise<void>
    prefetch<T extends keyof SignalDataTypeMap>(type: T, ids: string[]): Promise<void>
}

export type SignalAuthState = {
    creds: SignalCreds
    keys: SignalKeyStore
}

export type AuthenticationState = {
    creds: AuthenticationCreds
    keys: SignalKeyStore
}
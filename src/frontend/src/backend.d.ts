import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface User {
    principal: Principal;
    displayName: string;
}
export interface backendInterface {
    connectUsers(myId: bigint, targetId: bigint): Promise<void>;
    getAllUsers(): Promise<Array<User>>;
    isConnected(userId1: bigint, userId2: bigint): Promise<boolean>;
    registerUser(displayName: string): Promise<bigint>;
}

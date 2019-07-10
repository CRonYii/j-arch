import { BinaryDigit } from "../CPU8086/arch/BitBuffer";

export function halfAdd
    (digit1: BinaryDigit, digit2: BinaryDigit, carry: BinaryDigit)
    : [BinaryDigit, BinaryDigit] {
    const currentDigit = (digit1 ^ digit2 ^ carry) === 1 ? 1 : 0;
    carry = digit1 && digit2 || digit1 && carry || digit2 && carry;
    return [currentDigit, carry];
}
import { BINARY } from "../../constants";
import { Register } from "../registers/Register";

export type BinaryDigit = 0 | 1;

export type BitBuffer = Array<BinaryDigit>;

export type BitBufferable = BitBuffer | Register | string | number;

const BASE = {
    2: '0b',
    16: '0x'
} as const;

const HEX: any = {
    '0': '0000',
    '1': '1000',
    '2': '0100',
    '3': '1100',
    '4': '0010',
    '5': '1010',
    '6': '0110',
    '7': '1110',
    '8': '0001',
    '9': '1001',
    'A': '0101',
    'B': '1101',
    'C': '0011',
    'D': '1011',
    'E': '0111',
    'F': '1111',
};

function fromBase2(num: string, size: number) {
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
        let digit;
        switch (num[size - i - 1]) {
            case '0':
                digit = BINARY[0];
                break;
            case '1':
                digit = BINARY[1];
                break;
            default: throw new Error('The argument is not valid binary');
        }
        result[i] = digit;
    }
    return result;
}

function fromBase10(num: number, size: number): BitBuffer {
    num = Math.floor(num);

    let numMax = 1 << (size - 1);
    const result = new Array(size);

    for (let i = 0; i < size; i++) {
        if (num >= numMax) {
            result[size - i - 1] = BINARY[1];
            num -= numMax;
        } else {
            result[size - i - 1] = BINARY[0];
        }
        numMax >>= 1;
    }
    return result;
}

function fromBase16(num: string, size: number) {
    let result: (0 | 1)[] = [];
    for (const i of num) {
        const digit = HEX[i];
        if (!digit) {
            throw new Error('The argument is not valid hex');
        }
        result = result.concat(fromBase2(digit, 4));
    }
    return result.reverse().slice(0, size);
}

export function toBitBuffer(num: string | number, size: number): BitBuffer {
    if (typeof num === 'string') {
        const base = num.substring(0, 2);
        num = num.substring(2);
        switch (base) {
            case BASE[2]: return fromBase2(num, size);
            case BASE[16]: return fromBase16(num, size);
        };
    } else if (typeof num === 'number') {
        return fromBase10(num, size);
    }
    return new Array(size);
};
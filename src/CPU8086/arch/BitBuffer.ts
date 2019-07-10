import { BINARY } from "../../constants";
import { Register } from "../registers/Register";

export type BinaryDigit = 0 | 1;

export type BitBuffer = Array<BinaryDigit>;

export type BitBufferable = BitBuffer | Register | string | number;

const SupportedBase = {
    2: '0b',
    16: '0x'
} as const;

const hexToBinary: any = {
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

const decToHex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

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
        const digit = hexToBinary[i];
        if (!digit) {
            throw new Error('The argument is not valid hex');
        }
        result = result.concat(fromBase2(digit, 4));
    }
    return result.reverse().slice(0, size);
}

export const bitBuffer = {
    from: function (num: string | number, size: number): BitBuffer {
        if (typeof num === 'string') {
            const base = num.substring(0, 2);
            num = num.substring(2);
            switch (base) {
                case SupportedBase[2]: return fromBase2(num, size);
                case SupportedBase[16]: return fromBase16(num, size);
            };
        } else if (typeof num === 'number') {
            return fromBase10(num, size);
        }
        return new Array(size);
    },
    /**
     * Returns a decimal representation of the data stored in the buffer.
     */
    toDecimal: function (buffer: BitBuffer) {
        let result = 0;
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === BINARY[1]) {
                result += 1 << i;
            }
        }
        return result;
    },
    toHex: function (buffer: BitBuffer) {
        let dec = this.toDecimal(buffer);
        let result = '';
        while (dec > 0) {
            const letter = decToHex[dec % 16];
            result = letter + result;
            dec >>= 4;
        }
        return '0x' + result;
    },
    toPrecision: function(num: string, precision: number) {
        const prefix = num.substring(0, 2);
        if (prefix !== '0b' && prefix !== '0x') {
            return num;
        }
        num = num.substring(2);
        const offset = num.length - precision;
        if (offset < 0) {
            return prefix + '0'.repeat(-offset) + num;
        } else if (offset > 0) {
            return prefix + num.substring(offset);
        }
        return prefix + num;
    }
};
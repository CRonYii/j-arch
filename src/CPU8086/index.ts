import { BinaryDigit, BitBufferable } from "./arch/BitBuffer";
import { FlagsRegister } from "./registers/FlagsRegister";
import { GeneralPurposeRegister } from "./registers/GeneralPurposeRegister";
import { InstructionPointerRegister } from "./registers/InstructionPointerRegister";
import { PointerRegister } from "./registers/PointerRegister";
import { SegmentRegister } from "./registers/SegmentRegister";

export type RegisterID8086 =
    'ax' | 'bx' | 'cx' | 'dx'
    | 'ah' | 'al' | 'bh' | 'bl'
    | 'ch' | 'cl' | 'dh' | 'dl'
    | 'sp' | 'bp' | 'si' | 'di'
    | 'cs' | 'ds' | 'ss' | 'es'
    | 'ip' | 'flags';

export class CPU8086 {

    // General Purpose Registers
    private readonly ax = new GeneralPurposeRegister(); // Accumulator: Multiply, divide, I/O
    private readonly bx = new GeneralPurposeRegister(); // Base: Count for loops, shifts
    private readonly cx = new GeneralPurposeRegister(); // Count: Pointer to base addresss (data)
    private readonly dx = new GeneralPurposeRegister(); // Data: Multiply, divide, I/O

    // The Eight 8-bit Registers
    private readonly ah = this.ax.high;
    private readonly al = this.ax.low;
    private readonly bh = this.bx.high;
    private readonly bl = this.bx.low;
    private readonly ch = this.cx.high;
    private readonly cl = this.cx.low;
    private readonly dh = this.dx.high;
    private readonly dl = this.dx.low;

    // Pointer and Index Registers
    private readonly sp = new PointerRegister(); // Pointer to top of stack
    private readonly bp = new PointerRegister(); // Pointer to base address (stack)
    private readonly si = new PointerRegister(); // Source string/index pointer
    private readonly di = new PointerRegister(); // Destination string/index pointer

    // Segment Registers
    private readonly cs = new SegmentRegister('0xFFFF'); // Code Segment
    private readonly ds = new SegmentRegister(); // Data Segment
    private readonly ss = new SegmentRegister(); // Stack Segment
    private readonly es = new SegmentRegister(); // Extra Segment

    // Other Registers
    private readonly ip = new InstructionPointerRegister();
    private readonly flags = new FlagsRegister();

    public mov(registerID: RegisterID8086, value: BitBufferable) {
        this[registerID].set(value);
    }

    public add(registerID: RegisterID8086, value: BitBufferable) {
        const register = this[registerID];

        const size = register.size();
        const d1 = register.data();
        const d2 = register.toBitBuffer(value);

        let currentDigit: BinaryDigit = 0;
        let carry: BinaryDigit = 0;

        const result = register.toBitBuffer(0);

        for (let i = 0; i < size; i++) {
            const digit1 = d1[i];
            const digit2 = d2[i];

            const halfAddResult = this.fullAdd(digit1, digit2, carry);
            currentDigit = halfAddResult[0];
            carry = halfAddResult[1];
            result[i] = currentDigit;
        }

        register.set(result);
    }

    public jmp(csValue: BitBufferable, ipValue: BitBufferable): void;
    public jmp(registerID: RegisterID8086): void;

    public jmp(arg1: any, arg2?: BitBufferable) {
        if (arg1 && arg2) {
            this.cs.set(arg1);
            this.ip.set(arg2);
        } else if (arg1) {
            const value = this.get(arg1);
            this.ip.set(value);
        }
    }

    public get(registerID: RegisterID8086) {
        return this[registerID].data();
    }

    private fullAdd(
        digit1: BinaryDigit,
        digit2: BinaryDigit,
        carry: BinaryDigit
    ): [BinaryDigit, BinaryDigit] {
        const currentDigit = (digit1 ^ digit2 ^ carry) === 1 ? 1 : 0;
        carry = digit1 && digit2 || digit1 ^ digit2 && carry;
        return [currentDigit, carry];
    }

    /**
     * TODO: implement the mechanism to execute instructions with CS and IP (pg.46)
     * 1. Read the addresses from CS and IP, compute the actual memory address using the address adder
     * 2. Retrieve the data stored in the memory address and the length of the insturcion
     * 3. Write the data into Instruction Buffer, increment the IP
     * 4. Execute the instruction, repeat from step 1
     */

}
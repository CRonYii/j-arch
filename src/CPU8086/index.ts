import { BinaryDigit, ByteBufferable, ByteBuffer, BYTE_MAX, byteBuffer } from "./arch/ByteBuffer";
import { FlagsRegister } from "./registers/FlagsRegister";
import { GeneralPurposeRegister, InnerRegister8 } from "./registers/GeneralPurposeRegister";
import { InstructionPointerRegister } from "./registers/InstructionPointerRegister";
import { PointerRegister } from "./registers/PointerRegister";
import { SegmentRegister } from "./registers/SegmentRegister";
import { RegisterID8086, isRegisterID8086, SegmentRegisterID, isSegmentID8086 } from "./registers/types";
import { Memory8086, MemoryOffsetAddress } from "./memory/Memory8086";

export class CPU8086 {

    private readonly memory: Memory8086 = new Memory8086();

    // General Purpose Registers
    private readonly ax = new GeneralPurposeRegister(); // Accumulator: Multiply, divide, I/O
    private readonly bx = new GeneralPurposeRegister(); // Base: Count for loops, shifts
    private readonly cx = new GeneralPurposeRegister(); // Count: Pointer to base addresss (data)
    private readonly dx = new GeneralPurposeRegister(); // Data: Multiply, divide, I/O

    // The Eight 8-bit Registers
    private readonly ah: InnerRegister8 = this.ax.high;
    private readonly al: InnerRegister8 = this.ax.low;
    private readonly bh: InnerRegister8 = this.bx.high;
    private readonly bl: InnerRegister8 = this.bx.low;
    private readonly ch: InnerRegister8 = this.cx.high;
    private readonly cl: InnerRegister8 = this.cx.low;
    private readonly dh: InnerRegister8 = this.dx.high;
    private readonly dl: InnerRegister8 = this.dx.low;

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

    public mov(segmentRegisterID: SegmentRegisterID, value: RegisterID8086): void;
    public mov(registerID: RegisterID8086, value: ByteBufferable): void;
    public mov(registerID: RegisterID8086, value: RegisterID8086): void;
    public mov(registerID: RegisterID8086, value: MemoryOffsetAddress): void;
    public mov(memoryAddress: MemoryOffsetAddress, value: RegisterID8086): void;

    public mov(arg1: any, arg2: any) {
        if (isSegmentID8086(arg1) && isRegisterID8086(arg2)) {
            this[arg1].set(this.get(arg2));
        } else if (isRegisterID8086(arg1) && byteBuffer.is(arg2)) {
            this[arg1].set(arg2);
        } else if (isRegisterID8086(arg1) && isRegisterID8086(arg2)) {
            this[arg1].set(this.get(arg2));
        } else if (isRegisterID8086(arg1) && arg2 instanceof MemoryOffsetAddress) {
            this[arg1].set(this.readData(arg2));
        } else if (arg1 instanceof MemoryOffsetAddress && isRegisterID8086(arg2)) {
            this.writeData(arg1, this.get(arg2));
        } else {
            throw new Error(`Invalid mov operands. [arg1=${arg1}, arg2=${arg2}]`);
        }
    }

    public add(registerID: RegisterID8086, value: ByteBufferable) {
        const register = this[registerID];

        const size = register.size();
        const d1 = register.data();
        const d2 = register.toByteBuffer(value);

        const result: ByteBuffer = new Uint8Array(size);

        let carry = 0;

        for (let i = 0; i < size; i++) {
            const index = size - i - 1;
            const sum = d1[index] + d2[index] + carry;
            carry = sum > BYTE_MAX ? 1 : 0; // carry-in set to 1 if overflow
            result[index] = sum; // the Int8Array will handle overflow
        }

        register.set(result);
    }

    public jmp(csValue: ByteBufferable, ipValue: ByteBufferable): void;
    public jmp(registerID: RegisterID8086): void;

    public jmp(arg1: any, arg2?: ByteBufferable) {
        if (isRegisterID8086(arg1)) {
            const value = this.get(arg1);
            this.ip.set(value);
        } else if (arg1 && arg2) {
            this.cs.set(arg1);
            this.ip.set(arg2);
        }
    }

    public get(registerID: RegisterID8086) {
        return this[registerID].data();
    }

    private readData(offset: MemoryOffsetAddress) {
        return this.readMemory(this.get('ds'), offset);
    }

    private writeData(offset: MemoryOffsetAddress, data: ByteBuffer) {
        return this.writeMemory(this.get('ds'), offset, data);
    }

    private readInstruction() {
        return this.readMemory(
            this.get('cs'),
            new MemoryOffsetAddress(this.get('ip'))
        );
    }

    private readMemory(root: ByteBuffer, offset: MemoryOffsetAddress, size = 2): ByteBuffer {
        const address = this.computeAddress(root, offset);
        if (size === 2)
            return byteBuffer.from(
                new Uint8Array([this.memory.get(address + 1), this.memory.get(address)]),
                2
            );
        else if (size === 1)
            return byteBuffer.from(
                this.memory.get(address),
                1
            );
        else
            throw new Error('Fatal error, unsupported buffer size when reading memory');
    }

    private writeMemory(root: ByteBuffer, offset: MemoryOffsetAddress, data: ByteBuffer): void {
        const address: number = this.computeAddress(root, offset);
        if (data.length === 2) {
            this.memory.set(address, data[1]);
            this.memory.set(address + 1, data[0]);
        } else if (data.length === 1) {
            this.memory.set(address, data[0]);
        } else {
            throw new Error('Fatal error, unsupported buffer size when writing memory');
        }
    }

    private computeAddress(root: ByteBuffer, offset: MemoryOffsetAddress): number {
        return byteBuffer.value(root) << 1 | byteBuffer.value(offset.address);
    }

    /**
     * TODO: implement the mechanism to execute instructions with CS and IP (pg.46)
     * 1. Read the addresses from CS and IP, compute the actual memory address using the address adder
     * 2. Retrieve the data stored in the memory address and the length of the insturcion
     * 3. Write the data into Instruction Buffer, increment the IP
     * 4. Execute the instruction, repeat from step 1
     */

}
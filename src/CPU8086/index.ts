import { FlagsRegister } from "./registers/FlagsRegister";
import { GeneralPurposeRegister } from "./registers/GeneralPurposeRegister";
import { InstructionPointerRegister } from "./registers/InstructionPointerRegister";
import { PointerRegister } from "./registers/PointerRegister";
import { SegmentRegister } from "./registers/SegmentRegister";

export class CPU8086 {

    // General Purpose Registers
    private readonly ax = new GeneralPurposeRegister(); // Accumulator: Multiply, divide, I/O
    private readonly bx = new GeneralPurposeRegister(); // Base: Count for loops, shifts
    private readonly cx = new GeneralPurposeRegister(); // Count: Pointer to base addresss (data)
    private readonly dx = new GeneralPurposeRegister(); // Data: Multiply, divide, I/O

    // Pointer and Index Registers
    private readonly sp = new PointerRegister(); // Pointer to top of stack
    private readonly bp = new PointerRegister(); // Pointer to base address (stack)
    private readonly si = new PointerRegister(); // Source string/index pointer
    private readonly di = new PointerRegister(); // Destination string/index pointer

    // Segment Registers
    private readonly cs = new SegmentRegister('0xFFFF'); // Code Segment (pg.46)
    private readonly ds = new SegmentRegister(); // Data Segment
    private readonly ss = new SegmentRegister(); // Stack Segment
    private readonly es = new SegmentRegister(); // Extra Segment

    // Other Registers
    private readonly ip = new InstructionPointerRegister();
    private readonly flags = new FlagsRegister();

    /**
     * TODO: implement the following instructions:
     * mov: (Register, BitBufferable)
     * add: (Register, BitBufferable)
     * jmp: (BitBufferable, BitBufferable) | (Register) (pg.45)
     */

     /**
      * TODO: implement the mechanism to execute instructions with CS and IP (pg.46)
      * 1. Read the addresses from CS and IP, compute the actual memory address using the address adder
      * 2. Retrieve the data stored in the memory address and the length of the insturcion
      * 3. Write the data into Instruction Buffer, increment the IP
      * 4. Execute the instruction, repeat from step 1
      */

}
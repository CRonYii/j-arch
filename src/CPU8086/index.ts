import { FlagsRegister } from "./registers/FlagsRegister";
import { GeneralPurposeRegister } from "./registers/GeneralPurposeRegister";
import { InstructionPointerRegister } from "./registers/InstructionPointerRegister";
import { PointerRegister } from "./registers/PointerRegister";
import { SegmentRegister } from "./registers/SegmentRegister";

export class CPU8086 {

    // General Purpose Registers
    private readonly ax = new GeneralPurposeRegister();
    private readonly bx = new GeneralPurposeRegister();
    private readonly cx = new GeneralPurposeRegister();
    private readonly dx = new GeneralPurposeRegister();

    // Pointer and Index Registers
    private readonly sp = new PointerRegister();
    private readonly bp = new PointerRegister();
    private readonly si = new PointerRegister();
    private readonly di = new PointerRegister();

    // Segment Registers
    private readonly cs = new SegmentRegister('0xFFFF');
    private readonly ds = new SegmentRegister();
    private readonly ss = new SegmentRegister();
    private readonly es = new SegmentRegister();

    // Other Registers
    private readonly ip = new InstructionPointerRegister();
    private readonly flags = new FlagsRegister();

}
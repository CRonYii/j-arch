import { CPU8086 } from "./CPU8086";
import { bitBuffer } from "./CPU8086/arch/BitBuffer";

var cpu = new CPU8086();

cpu.mov('ax', '0x4E20');
cpu.add('ax', '0x1406');
cpu.mov('bx', '0x2000');
cpu.add('ax', cpu.getData('bx'));
cpu.mov('bx', cpu.getData('ax'));
cpu.add('ax', cpu.getData('bx'));

console.log(bitBuffer.toDecimal(cpu.getData('ax')));
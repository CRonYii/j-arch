import { ByteBuffer, byteBuffer } from "./CPU8086/arch/ByteBuffer";

import { CPU8086 } from "./CPU8086";
import { RegisterID8086 } from "./CPU8086/registers/types";
import { MemoryOffsetAddress, mem } from "./CPU8086/memory/Memory8086";

var cpu = new CPU8086();

function show(registerID: RegisterID8086) {
    const value = cpu.get(registerID);
    const hex = byteBuffer.toHex(value);
    const paddedHex = byteBuffer.toPrecision(hex, 4);
    console.log(registerID + ': ' + paddedHex);
}
// ax: 0x00C5
// bx: 0x4026
// ax: 0x0058
// bx: 0x4026
// ax: 0x01FE
// cpu.mov('ax', '0x001A');
// cpu.mov('bx', '0x0026');

// cpu.add('al', cpu.get('bl'));
// cpu.add('ah', cpu.get('bl'));
// cpu.add('bh', cpu.get('al'));

// cpu.mov('ah', 0);

// cpu.add('al', '0x85');
// show('ax');
// show('bx');
// cpu.add('al', '0x93');
// show('ax');
// show('bx');

// cpu.mov('ax', 0x00FF);
// cpu.add('ax', 0x00FF);
// show('ax');

cpu.mov('ax', 0x1000);
cpu.mov('ds', 'ax');
cpu.mov('ax', 11316);
cpu.mov(mem(0), 'ax');
cpu.mov('bx', mem(0));

show('ax');
show('bx');

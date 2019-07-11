import { CPU8086 } from "./CPU8086";
import { bitBuffer } from "./CPU8086/arch/BitBuffer";
import { RegisterID8086 } from "./CPU8086/registers/types";

var cpu = new CPU8086();

function show(registerID: RegisterID8086) {
    const value = cpu.get(registerID);
    const hex = bitBuffer.toHex(value);
    const paddedHex = bitBuffer.toPrecision(hex, 4);
    console.log(registerID + ': ' + paddedHex);
}

cpu.mov('ax', '0x001A');
cpu.mov('bx', '0x0026');

cpu.add('al', cpu.get('bl'));
cpu.add('ah', cpu.get('bl'));
cpu.add('bh', cpu.get('al'));

cpu.mov('ah', 0);

cpu.add('al', '0x85');
show('ax');
show('bx');
cpu.add('al', '0x93');
show('ax');
show('bx');

cpu.jmp('0x1200', '0x0003');
show('cs');
show('ip');
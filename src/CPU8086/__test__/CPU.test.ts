import { CPU8086 } from "..";
import { byteBuffer } from "../arch/ByteBuffer";
import { RegisterID8086 } from "../registers/types";

const cpu = new CPU8086();

function assertReg(regID: RegisterID8086, value: number) {
    expect(byteBuffer.value(cpu.get(regID)))
        .toBe(value);
}

describe('CPU instructions', () => {

    test('mov', () => {
        cpu.mov('ax', 0xFFFF);
        assertReg('ax', 0xFFFF);
        cpu.mov('ax', 0xFFFFAA01);
        assertReg('ax', 0xAA01);
        cpu.mov('ax', '0xDA02');
        assertReg('ax', 0xDA02);
    });

    test('add', () => {
        cpu.mov('ax', '0x001A');
        cpu.mov('bx', '0x0026');
        cpu.add('al', cpu.get('bl'));
        cpu.add('ah', cpu.get('bl'));
        cpu.add('bh', cpu.get('al'));
        cpu.mov('ah', 0);
        cpu.add('al', '0x85');

        assertReg('ax', 0x00C5);
        assertReg('bx', 0x4026);
    });

});

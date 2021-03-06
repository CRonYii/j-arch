export type GeneralRegisterID =
    'ax' | 'bx' | 'cx' | 'dx' |
    'ah' | 'al' | 'bh' | 'bl' |
    'ch' | 'cl' | 'dh' | 'dl';

export type PointerRegisterID = 'sp' | 'bp' | 'si' | 'di';

export type SegmentRegisterID = 'cs' | 'ds' | 'ss' | 'es';

export type InstructionPointerRegisterID = 'ip';

export type FlagsRegisterID = 'flags';

export type RegisterID8086 =
    GeneralRegisterID |
    PointerRegisterID |
    SegmentRegisterID |
    InstructionPointerRegisterID |
    FlagsRegisterID;

const VALID_GENERAL_REGISTER_IDS: any = {
    'ax': true, 'bx': true, 'cx': true, 'dx': true,
    'ah': true, 'al': true, 'bh': true, 'bl': true,
    'ch': true, 'cl': true, 'dh': true, 'dl': true,
};

const VALID_POINTER_REGISTER_IDS: any = {
    'sp': true, 'bp': true, 'si': true, 'di': true,
};
const VALID_SEGMENT_REGISTER_IDS: any = {
    'cs': true, 'ds': true, 'ss': true, 'es': true,
};
const VALID_INSTRUCTION_POINTER_REGISTER_IDS: any = {
    'ip': true,
};
const VALID_FLAGS_REGISTER_IDS: any = {
    'flags': true
};

const VALID_REGISTER_IDS = {
    ...VALID_GENERAL_REGISTER_IDS,
    ...VALID_POINTER_REGISTER_IDS,
    ...VALID_SEGMENT_REGISTER_IDS,
    ...VALID_INSTRUCTION_POINTER_REGISTER_IDS,
    ...VALID_FLAGS_REGISTER_IDS
} as const;

export function isRegisterID8086(id: any): id is RegisterID8086 {
    return VALID_REGISTER_IDS[id] === true;
};

export function isGeneralRegisterID8086(id: any): id is GeneralRegisterID {
    return VALID_GENERAL_REGISTER_IDS[id] === true;
};

export function isPointerRegisterID8086(id: any): id is PointerRegisterID {
    return VALID_POINTER_REGISTER_IDS[id] === true;
};

export function isSegmentID8086(id: any): id is SegmentRegisterID {
    return VALID_SEGMENT_REGISTER_IDS[id] === true;
};

export function isInstructionPointerRegisterID8086(id: any): id is InstructionPointerRegisterID {
    return VALID_INSTRUCTION_POINTER_REGISTER_IDS[id] === true;
};
export function isFlagsRegisterID8086(id: any): id is FlagsRegisterID {
    return VALID_FLAGS_REGISTER_IDS[id] === true;
};
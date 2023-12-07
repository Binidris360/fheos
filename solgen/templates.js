"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorBinding = exports.BindingLibraryType = exports.BindingsWithoutOperator = exports.OperatorOverloadDecl = exports.SolTemplate3Arg = exports.SolTemplate1Arg = exports.SolTemplate2Arg = exports.AsTypeFunction = exports.PostFix = exports.preamble = void 0;
var common_1 = require("./common");
var preamble = function () {
    return "// SPDX-License-Identifier: BSD-3-Clause-Clear\n\npragma solidity >=0.8.13 <0.9.0;\n\nimport \"./FheOS.sol\";\n\ntype ebool is uint256;\ntype euint8 is uint256;\ntype euint16 is uint256;\ntype euint32 is uint256;\n\nlibrary Common {\n    // Values used to communicate types to the runtime.\n    uint8 internal constant ebool_tfhe_go = 0;\n    uint8 internal constant euint8_tfhe_go = 0;\n    uint8 internal constant euint16_tfhe_go = 1;\n    uint8 internal constant euint32_tfhe_go = 2;\n    \n    function bigIntToBool(uint256 i) internal pure returns (bool) {\n        return (i > 0);\n    }\n    \n    function bigIntToUint8(uint256 i) internal pure returns (uint8) {\n        return uint8(i);\n    }\n    \n    function bigIntToUint16(uint256 i) internal pure returns (uint16) {\n        return uint16(i);\n    }\n    \n    function bigIntToUint32(uint256 i) internal pure returns (uint32) {\n        return uint32(i);\n    }\n    \n    function bigIntToUint64(uint256 i) internal pure returns (uint64) {\n        return uint64(i);\n    }\n    \n    function bigIntToUint128(uint256 i) internal pure returns (uint128) {\n        return uint128(i);\n    }\n    \n    function bigIntToUint256(uint256 i) internal pure returns (uint256) {\n        return i;\n    }\n}\n\nlibrary Impl {\n    function reencrypt(uint256 ciphertext, bytes32 publicKey) internal pure returns (bytes memory reencrypted) {\n        bytes32[2] memory input;\n        input[0] = bytes32(ciphertext);\n        input[1] = publicKey;\n\n        // Call the reencrypt precompile.\n        reencrypted = FheOps(Precompiles.Fheos).reencrypt(bytes.concat(input[0], input[1]));\n\n        return reencrypted;\n    }\n\n    function verify(bytes memory _ciphertextBytes, uint8 _toType) internal pure returns (uint256 result) {\n        bytes memory input = bytes.concat(_ciphertextBytes, bytes1(_toType));\n\n        bytes memory output;\n\n        // Call the verify precompile.\n        output = FheOps(Precompiles.Fheos).verify(input);\n        result = getValue(output);\n    }\n\n    function cast(uint256 ciphertext, uint8 toType) internal pure returns (uint256 result) {\n        bytes memory input = bytes.concat(bytes32(ciphertext), bytes1(toType));\n\n        bytes memory output;\n\n        // Call the cast precompile.\n        output = FheOps(Precompiles.Fheos).cast(input);\n        result = getValue(output);\n    }\n    \n    function getValue(bytes memory a) internal pure returns (uint256 value) {\n        assembly {\n            value := mload(add(a, 0x20))\n        }\n    }\n    \n    function trivialEncrypt(uint256 value, uint8 toType) internal pure returns (uint256 result) {\n        bytes memory input = bytes.concat(bytes32(value), bytes1(toType));\n\n        bytes memory output;\n\n        // Call the trivialEncrypt precompile.\n        output = FheOps(Precompiles.Fheos).trivialEncrypt(input);\n\n        result = getValue(output);\n    }\n    \n    function cmux(uint256 control, uint256 ifTrue, uint256 ifFalse) internal pure returns (uint256 result) {\n        bytes memory input = bytes.concat(bytes32(control), bytes32(ifTrue), bytes32(ifFalse));\n\n        bytes memory output;\n\n        // Call the trivialEncrypt precompile.\n        output = FheOps(Precompiles.Fheos).cmux(input);\n\n        result = getValue(output);\n    }\n\n}\n\nlibrary TFHE {\n    euint8 constant NIL8 = euint8.wrap(0);\n    euint16 constant NIL16 = euint16.wrap(0);\n    euint32 constant NIL32 = euint32.wrap(0);\n\n    // Return true if the enrypted integer is initialized and false otherwise.\n    function isInitialized(ebool v) internal pure returns (bool) {\n        return ebool.unwrap(v) != 0;\n    }\n\n    // Return true if the enrypted integer is initialized and false otherwise.\n    function isInitialized(euint8 v) internal pure returns (bool) {\n        return euint8.unwrap(v) != 0;\n    }\n\n    // Return true if the enrypted integer is initialized and false otherwise.\n    function isInitialized(euint16 v) internal pure returns (bool) {\n        return euint16.unwrap(v) != 0;\n    }\n\n    // Return true if the enrypted integer is initialized and false otherwise.\n    function isInitialized(euint32 v) internal pure returns (bool) {\n        return euint32.unwrap(v) != 0;\n    }\n    \n    function getValue(bytes memory a) internal pure returns (uint256 value) {\n        assembly {\n            value := mload(add(a, 0x20))\n        }\n    }\n\n    function mathHelper(\n        uint256 lhs,\n        uint256 rhs,\n        function(bytes memory) external pure returns (bytes memory) impl\n    ) internal pure returns (uint256 result) {\n        bytes memory input = bytes.concat(bytes32(lhs), bytes32(rhs));\n\n        bytes memory output;\n        // Call the add precompile.\n\n        output = impl(input);\n        result = getValue(output);\n    }\n";
};
exports.preamble = preamble;
var PostFix = function () {
    return "\n}";
};
exports.PostFix = PostFix;
var castFromEncrypted = function (fromType, toType, name) {
    return "Impl.cast(".concat(fromType, ".unwrap(").concat(name, "), Common.").concat(toType, "_tfhe_go)");
};
var castFromPlaintext = function (name, toType) {
    return "Impl.trivialEncrypt(".concat(name, ", Common.").concat(toType, "_tfhe_go)");
};
var castFromBytes = function (name, toType) {
    return "Impl.verify(".concat(name, ", Common.").concat(toType, "_tfhe_go)");
};
var AsTypeFunction = function (fromType, toType) {
    var castString = castFromEncrypted(fromType, toType, "value");
    if (fromType === 'bytes memory') {
        castString = castFromBytes("value", toType);
    }
    else if (common_1.EPlaintextType.includes(fromType)) {
        castString = castFromPlaintext("value", toType);
    }
    else if (!common_1.EInputType.includes(fromType)) {
        throw new Error("Unsupported type for casting: ".concat(fromType));
    }
    return "function as".concat(capitalize(toType), "(").concat(fromType, " value) internal pure returns (").concat(toType, ") {\n        return ").concat(toType, ".wrap(").concat(castString, ");\n    }\n");
};
exports.AsTypeFunction = AsTypeFunction;
var unwrapType = function (typeName, inputName) { return "".concat(typeName, ".unwrap(").concat(inputName, ")"); };
var wrapType = function (resultType, inputName) { return "".concat(resultType, ".wrap(").concat(inputName, ")"); };
var asEuintFuncName = function (typeName) { return "as".concat(capitalize(typeName)); };
var capitalize = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
function SolTemplate2Arg(name, input1, input2, returnType) {
    // special names for reencrypt function (don't check name === reencrypt) because the name could change
    var variableName1 = input2 === "bytes32" ? "value" : "lhs";
    var variableName2 = input2 === "bytes32" ? "publicKey" : "rhs";
    var funcBody = "\nfunction ".concat(name, "(").concat(input1, " ").concat(variableName1, ", ").concat(input2, " ").concat(variableName2, ") internal pure returns (").concat(returnType, ") {");
    if ((0, common_1.valueIsEncrypted)(input1)) {
        // both inputs encrypted - this is a generic math function. i.e. div, mul, eq, etc.
        // 1. possibly cast input1
        // 2. possibly cast input2
        // 3. possibly cast return type
        if ((0, common_1.valueIsEncrypted)(input2) || common_1.EPlaintextType.includes(input2)) {
            var input2Cast = input1 === input2 ? variableName2 : "".concat(asEuintFuncName(input1), "(").concat(variableName2, ")");
            //
            funcBody += "\n    if(!isInitialized(".concat(variableName1, ") || !isInitialized(").concat(variableName2, ")) {\n        revert(\"One or more inputs are not initialized.\");\n    }\n    ").concat(common_1.UnderlyingTypes[input1], " unwrappedInput1 = ").concat(unwrapType(input1, variableName1), ";\n    ").concat(common_1.UnderlyingTypes[input1], " unwrappedInput2 = ").concat(unwrapType(input1, "".concat(input2Cast)), ";\n");
            if ((0, common_1.valueIsEncrypted)(returnType)) {
                funcBody += "\n    ".concat(common_1.UnderlyingTypes[returnType], " result = mathHelper(unwrappedInput1, unwrappedInput2, FheOps(Precompiles.Fheos).").concat(name, ");\n    return ").concat(wrapType(returnType, "result"), ";\n");
            }
            else {
                funcBody += "\n    ".concat(returnType, " result = mathHelper(unwrappedInput1, unwrappedInput2, FheOps(Precompiles.Fheos).").concat(name, ");\n    return result;\n");
            }
        }
        else if (input2 === "bytes32") {
            // **** Value 1 is encrypted, value 2 is bytes32 - this is basically reencrypt/wrapForUser
            funcBody += "\n    ".concat(common_1.UnderlyingTypes[input1], " unwrapped = ").concat(unwrapType(input1, variableName1), ";\n\n    return Impl.").concat(name, "(unwrapped, ").concat(variableName2, ");\n");
        }
    }
    else {
        // don't support input 1 is plaintext
        throw new Error("Unsupported plaintext input1");
    }
    funcBody += "\n}";
    return funcBody;
}
exports.SolTemplate2Arg = SolTemplate2Arg;
function SolTemplate1Arg(name, input1, returnType) {
    var returnStr = returnType === "none" ? "" : " returns (".concat(returnType, ") ");
    var funcBody = "\nfunction ".concat(name, "(").concat(input1, " input1) internal pure ").concat(returnStr, "{");
    if ((0, common_1.valueIsEncrypted)(input1)) {
        funcBody += "\n    if(!isInitialized(input1)) {\n        revert(\"One or more inputs are not initialized.\");\n    }";
        var unwrap = "".concat(common_1.UnderlyingTypes[input1], " unwrappedInput1 = ").concat(unwrapType(input1, "input1"), ";");
        var getResult = function (inputName) { return "FheOps(Precompiles.Fheos).".concat(name, "(").concat(inputName, ");"); };
        if ((0, common_1.valueIsEncrypted)(returnType)) {
            // input and return type are encrypted - not/neg other unary functions
            funcBody += "\n    ".concat(unwrap, "\n    bytes memory inputAsBytes = bytes.concat(bytes32(unwrappedInput1));\n    bytes memory b = ").concat(getResult("inputAsBytes"), "\n    uint256 result = Impl.getValue(b);\n    return ").concat(wrapType(returnType, "result"), ";\n}\n");
        }
        else if (returnType === "none") {
            // this is essentially req
            funcBody += "\n    ".concat(unwrap, "\n    bytes memory inputAsBytes = bytes.concat(bytes32(unwrappedInput1));\n    ").concat(getResult("inputAsBytes"), "\n}\n");
        }
        else if ((0, common_1.valueIsPlaintext)(returnType)) {
            var returnTypeCamelCase = returnType.charAt(0).toUpperCase() + returnType.slice(1);
            var outputConvertor = "Common.bigIntTo".concat(returnTypeCamelCase, "(result);");
            funcBody += "\n    ".concat(unwrap, "\n    bytes memory inputAsBytes = bytes.concat(bytes32(unwrappedInput1));\n    uint256 result = ").concat(getResult("inputAsBytes"), "\n    return ").concat(outputConvertor, "\n}\n");
        }
    }
    else {
        throw new Error("unsupported function of 1 input that is not encrypted");
    }
    return funcBody;
}
exports.SolTemplate1Arg = SolTemplate1Arg;
function SolTemplate3Arg(name, input1, input2, input3, returnType) {
    if ((0, common_1.valueIsEncrypted)(returnType)) {
        if ((0, common_1.valueIsEncrypted)(input1) && (0, common_1.valueIsEncrypted)(input2) && (0, common_1.valueIsEncrypted)(input3) && input1 === 'ebool') {
            return "\nfunction ".concat(name, "(").concat(input1, " input1, ").concat(input2, " input2, ").concat(input3, " input3) internal pure returns (").concat(returnType, ") {\n    if(!isInitialized(input1) || !isInitialized(input2) || !isInitialized(input3)) {\n        revert(\"One or more inputs are not initialized.\");\n    }\n\n    ").concat(common_1.UnderlyingTypes[input1], " unwrappedInput1 = ").concat(unwrapType(input1, "input1"), ";\n    ").concat(common_1.UnderlyingTypes[input2], " unwrappedInput2 = ").concat(unwrapType(input2, "input2"), ";\n    ").concat(common_1.UnderlyingTypes[input3], " unwrappedInput3 = ").concat(unwrapType(input3, "input3"), ";\n\n    ").concat(common_1.UnderlyingTypes[returnType], " result = Impl.").concat(name, "(unwrappedInput1, unwrappedInput2, unwrappedInput3);\n    return ").concat(wrapType(returnType, "result"), ";\n    }");
        }
        else {
            return "";
        }
    }
    else {
        throw new Error("Unsupported return type ".concat(returnType, " for 3 args"));
    }
}
exports.SolTemplate3Arg = SolTemplate3Arg;
function operatorFunctionName(funcName, forType) {
    return "operator".concat(capitalize(funcName)).concat(capitalize(forType));
}
var OperatorOverloadDecl = function (funcName, op, forType, unary) {
    var opOverloadName = operatorFunctionName(funcName, forType);
    var unaryParameters = unary ? 'lhs' : 'lhs, rhs';
    var funcParams = unaryParameters.split(',').map(function (key) { return "".concat(forType, " ").concat(key); }).join(', ');
    return "\nusing {".concat(opOverloadName, " as ").concat(op, ", Bindings").concat(capitalize(forType), ".").concat(funcName, "} for ").concat(forType, " global;\n\nfunction ").concat(opOverloadName, "(").concat(funcParams, ") pure returns (").concat(forType, ") {\n    return TFHE.").concat(funcName, "(").concat(unaryParameters, ");\n}\n");
};
exports.OperatorOverloadDecl = OperatorOverloadDecl;
var BindingsWithoutOperator = function (funcName, forType) {
    return "\nusing {Bindings".concat(capitalize(forType), ".").concat(funcName, "} for ").concat(forType, " global;\n");
};
exports.BindingsWithoutOperator = BindingsWithoutOperator;
var BindingLibraryType = function (type) {
    return "\nlibrary Bindings".concat(capitalize(type), " {");
};
exports.BindingLibraryType = BindingLibraryType;
var OperatorBinding = function (funcName, forType, unary) {
    var unaryParameters = unary ? 'lhs' : 'lhs, rhs';
    var funcParams = unaryParameters.split(',').map(function (key) { return "".concat(forType, " ").concat(key); }).join(', ');
    return "\nfunction ".concat(funcName, "(").concat(funcParams, ") pure internal returns (").concat(forType, ") {\n    return TFHE.").concat(funcName, "(").concat(unaryParameters, ");\n}");
};
exports.OperatorBinding = OperatorBinding;

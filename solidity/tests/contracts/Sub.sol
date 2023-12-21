// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../FHE.sol";
import "./utils/Utils.sol";

error TestNotFound(string test);

contract SubTest {
    using Utils for *;

    function sub(string calldata test, uint256 a, uint256 b) public pure returns (uint256 output) {
        if (Utils.cmp(test, "sub(euint8,euint8)")) {
            return TFHE.decrypt(TFHE.sub(TFHE.asEuint8(a), TFHE.asEuint8(b)));
        } else if (Utils.cmp(test, "sub(euint16,euint16)")) {
            return TFHE.decrypt(TFHE.sub(TFHE.asEuint16(a), TFHE.asEuint16(b)));
        } else if (Utils.cmp(test, "sub(euint32,euint32)")) {
            return TFHE.decrypt(TFHE.sub(TFHE.asEuint32(a), TFHE.asEuint32(b)));
        } else if (Utils.cmp(test, "euint8.sub(euint8)")) {
            return TFHE.decrypt(TFHE.asEuint8(a).sub(TFHE.asEuint8(b)));
        } else if (Utils.cmp(test, "euint16.sub(euint16)")) {
            return TFHE.decrypt(TFHE.asEuint16(a).sub(TFHE.asEuint16(b)));
        } else if (Utils.cmp(test, "euint32.sub(euint32)")) {
            return TFHE.decrypt(TFHE.asEuint32(a).sub(TFHE.asEuint32(b)));
        } else if (Utils.cmp(test, "euint8 - euint8")) {
            return TFHE.decrypt(TFHE.asEuint8(a) - TFHE.asEuint8(b));
        } else if (Utils.cmp(test, "euint16 - euint16")) {
            return TFHE.decrypt(TFHE.asEuint16(a) - TFHE.asEuint16(b));
        } else if (Utils.cmp(test, "euint32 - euint32")) {
            return TFHE.decrypt(TFHE.asEuint32(a) - TFHE.asEuint32(b));
        } else {
            revert TestNotFound(test);
        }
    }

}
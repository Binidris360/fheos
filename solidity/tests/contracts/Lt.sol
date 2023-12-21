// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../FHE.sol";
import "./utils/Utils.sol";

error TestNotFound(string test);

contract LtTest {
    using Utils for *;

    function lt(string calldata test, uint256 a, uint256 b) public pure returns (uint256 output) {
        if (Utils.cmp(test, "lt(euint8,euint8)")) {
            if (TFHE.decrypt(TFHE.lt(TFHE.asEuint8(a), TFHE.asEuint8(b)))) {
                return 1;
            }

            return 0;
        } else if (Utils.cmp(test, "lt(euint16,euint16)")) {
            if (TFHE.decrypt(TFHE.lt(TFHE.asEuint16(a), TFHE.asEuint16(b)))) {
                return 1;
            }

            return 0;
        } else if (Utils.cmp(test, "lt(euint32,euint32)")) {
            if (TFHE.decrypt(TFHE.lt(TFHE.asEuint32(a), TFHE.asEuint32(b)))) {
                return 1;
            }

            return 0;
        } else if (Utils.cmp(test, "euint8.lt(euint8)")) {
            if (TFHE.decrypt(TFHE.asEuint8(a).lt(TFHE.asEuint8(b)))) {
                return 1;
            }

            return 0;
        } else if (Utils.cmp(test, "euint16.lt(euint16)")) {
            if (TFHE.decrypt(TFHE.asEuint16(a).lt(TFHE.asEuint16(b)))) {
                return 1;
            }

            return 0;
        } else if (Utils.cmp(test, "euint32.lt(euint32)")) {
            if (TFHE.decrypt(TFHE.asEuint32(a).lt(TFHE.asEuint32(b)))) {
                return 1;
            }

            return 0;
        } else {
            revert TestNotFound(test);
        }
    }

}
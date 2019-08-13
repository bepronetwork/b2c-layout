export const SET_DEPOSIT_OR_WITHDRAW_RESULT = 'SET_DEPOSIT_OR_WITHDRAW_RESULT';

export function setDepositOrWithdrawResult(data) {
    return {
        type: SET_DEPOSIT_OR_WITHDRAW_RESULT,
        action : data
    };
}



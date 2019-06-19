export const SET_PROFILE_INFO = 'SET_PROFILE_INFO';

export function setProfileInfo(data) {
    return {
        type: SET_PROFILE_INFO,
        action : data
    };
}



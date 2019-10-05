export const SET_START_LOADING_PROGRESS = 'SET_START_LOADING_PROGRESS';

export function setStartLoadingProgress(data) {
    return {
        type: SET_START_LOADING_PROGRESS,
        action : data
    };
}




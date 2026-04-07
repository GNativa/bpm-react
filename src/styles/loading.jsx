import { loadingStatus } from "../hooks/useDataSource";

export function getStyleFromLoadingStatus(status) {
    switch (status) {
        case loadingStatus.loaded:
            return 'loaded';
        case loadingStatus.loading:
            return 'loading';
        case loadingStatus.failed:
            return 'loading-failed';
        default:
            return '';
    }
}
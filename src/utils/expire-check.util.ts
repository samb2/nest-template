export function expireCheck(ttl: number): boolean {
    if (ttl === 0) {
        return true;
    }
    return ttl > Date.now();
}

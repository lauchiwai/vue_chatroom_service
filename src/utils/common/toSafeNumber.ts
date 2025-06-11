export const toSafeNumber = (value: unknown, defaultValue: number | undefined = undefined): number | undefined => {
    if (Array.isArray(value)) {
        return value.length > 0 ? toSafeNumber(value[0], defaultValue) : defaultValue
    }

    if (typeof value === 'string') {
        if (/^-?\d+$/.test(value)) {
            const num = parseInt(value, 10)
            return Number.isSafeInteger(num) ? num : defaultValue
        }
    }

    return defaultValue
}
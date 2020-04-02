import time from '../../src/time'

export function mockCurrentDate(date: Date) {
    const currentDateMock = jest.fn(() => {
        return date
    })
    time.now = currentDateMock
}

import { Server } from '../src/server';

test('Should greet with message', () => {
    const greeter = new Server('friend');
    expect(greeter.greet()).toBe('Bonjour, friend!');
});

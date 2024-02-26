interface Subscriber {
    attach(observer: Observer): void;

    detach(observer: Observer): void;

    notify(): void;
}

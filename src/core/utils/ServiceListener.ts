export interface ServiceListener<T> {
  notify(data?: T): void;
}